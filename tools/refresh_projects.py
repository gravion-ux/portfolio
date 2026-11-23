"""Regenerate site/assets/projects.json from the live GitHub API.

Star counts, languages, topics and URLs come from a live API call. Test counts
come from tools/verified-tests.json, which records the counts measured by
actually running each repository's own suite, together with the date and the
command used. Descriptions come from tools/project-descriptions.json, the one
canonical description per project that every published surface uses. Nothing
here is estimated.

Usage:
    python tools/refresh_projects.py            # write site/assets/projects.json
    python tools/refresh_projects.py --check    # exit 1 if the file is stale
"""
import argparse
import json
import pathlib
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "site" / "assets" / "projects.json"
TESTS_FILE = ROOT / "tools" / "verified-tests.json"
DESCRIPTIONS_FILE = ROOT / "tools" / "project-descriptions.json"

OWNER = "gravion-ux"
API = "https://api.github.com"

# Authored projects only. The profile repo, the portfolio repo and forks of
# other people's projects are not projects of this account.
EXCLUDE = {"gravion-ux", "portfolio"}

CATEGORY = {
    "fixqueue": "red-team",
    "rulebench": "red-team",
    "opsledger": "red-team",
    "violet-trace": "red-team",
    "accessweave": "red-team",
    "iamosiac": "red-team",
    "fuzzharbor": "red-team",
    "secret-sniper": "red-team",
    "quanta-sentry": "red-team",
    "cipherbench": "red-team",
    "memorytrust": "ai-security",
    "preference-data-doctor": "ai-security",
    "skill-supply-chain-auditor": "ai-security",
    "local-slm-eval-kit": "ai-security",
    "llm-security-bot": "ai-security",
    "gravion-harness": "ai-security",
    "context-bridge": "ai-security",
    "gravion-trainner": "ai-security",
    "TRISHUL": "platform",
    "webapp-security-toolkit": "platform",
    "web-security-labs": "platform",
    "api-security-testing": "platform",
    "security-automation-scripts": "platform",
    "agent-browser": "platform",
    "privacyflow": "platform",
    "localshare": "platform",
    "rasgulla-ai": "platform",
    "aegis": "platform",
    "xerj-ipv6-rate-limit-fix": "contribution",
    "catalog-forge": "other",
    "Her--Him": "platform",
    "agent-skills": "ai-security",
    "gravion-ai": "ai-security",
    "gravion-hunter": "red-team",
    "jwt-auditor": "red-team",
    "llm-redteam-kit": "red-team",
    "mcp-shield": "red-team",
    "wp-cve-hunter": "red-team",
}

CATEGORY_LABEL = {
    "red-team": "Red-team and detection engineering",
    "ai-security": "AI and agent security",
    "platform": "Assessment, automation and platform",
    "contribution": "Upstream contribution",
    "other": "Other",
}

# The six repositories featured on the GitHub Sponsors profile. Each one is MIT
# licensed, has a CI workflow, and has a measured test count. This list is the
# same set that is published as the Sponsors featured repositories.
FEATURED = ["iamosiac", "wp-cve-hunter", "llm-redteam-kit",
            "mcp-shield", "jwt-auditor", "gravion-ai"]

# The inventory data carries no ampersand character, so the canonical
# descriptions must not contain one either. The one description that used to
# carry an ampersand, rulebench, is written out in full here.


def load_descriptions():
    """The one canonical description per project, shared by every surface."""
    data = json.loads(DESCRIPTIONS_FILE.read_text(encoding="utf-8"))
    descriptions = {k: v for k, v in data.items() if not k.startswith("_")}
    for name, text in descriptions.items():
        if "&" in text:
            raise SystemExit(
                "canonical description for %s contains an ampersand; the "
                "inventory data must stay free of ampersand characters" % name)
    return descriptions


def token():
    """Read a GitHub token from the git credential helper without printing it."""
    proc = subprocess.run(
        ["git", "credential", "fill"],
        input="protocol=https\nhost=github.com\n\n",
        capture_output=True,
        text=True,
        timeout=60,
    )
    for line in proc.stdout.splitlines():
        if line.startswith("password="):
            return line.split("=", 1)[1].strip()
    return ""


def api(path, tok):
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "gravion-portfolio"}
    if tok:
        headers["Authorization"] = "Bearer " + tok
    req = urllib.request.Request(API + path, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def load_tests():
    if not TESTS_FILE.exists():
        return {}
    return json.loads(TESTS_FILE.read_text(encoding="utf-8"))


def build():
    tok = token()
    repos = api("/users/%s/repos?per_page=100&type=owner&sort=full_name" % OWNER, tok)
    tests = load_tests()
    descriptions = load_descriptions()

    projects = []
    for repo in repos:
        name = repo["name"]
        if name in EXCLUDE or repo.get("fork"):
            continue
        if name not in CATEGORY:
            continue
        if name not in descriptions:
            raise SystemExit(
                "no canonical description for %s; add it to tools/project-descriptions.json" % name)
        record = tests.get(name, {})
        projects.append({
            "name": name,
            "description": descriptions[name],
            "language": repo.get("language") or "Other",
            "stars": repo.get("stargazers_count", 0),
            "category": CATEGORY[name],
            "categoryLabel": CATEGORY_LABEL[CATEGORY[name]],
            "topics": sorted(repo.get("topics") or []),
            "url": repo.get("html_url"),
            "testCount": record.get("tests"),
            "testSource": record.get("source"),
            "featured": name in FEATURED,
        })

    projects.sort(key=lambda p: (p["category"], p["name"]))
    return {
        "generated": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "owner": OWNER,
        "featured": FEATURED,
        "categories": [
            {"id": key, "label": CATEGORY_LABEL[key]}
            for key in ("red-team", "ai-security", "platform", "contribution", "other")
        ],
        "projects": projects,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true",
                        help="exit 1 when the checked-in file differs from a fresh build")
    args = parser.parse_args()

    data = build()
    payload = json.dumps(data, indent=2, ensure_ascii=False) + "\n"

    if args.check:
        if not OUT.exists():
            print("missing %s" % OUT)
            return 1
        current = json.loads(OUT.read_text(encoding="utf-8"))
        # The generation date records when the snapshot was taken, so it is not
        # part of the staleness comparison. Everything else must match.
        current.pop("generated", None)
        data.pop("generated", None)
        if current != data:
            print("projects.json is stale")
            return 1
        print("projects.json is up to date")
        return 0

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(payload, encoding="utf-8", newline="\n")
    print("wrote %s (%d projects)" % (OUT, len(data["projects"])))
    return 0


if __name__ == "__main__":
    sys.exit(main())
