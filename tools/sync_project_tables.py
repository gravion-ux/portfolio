"""Regenerate the project tables in the portfolio README from projects.json.

The tables used to be hand-maintained, which is how they drifted out of step with
the measured test counts and missed the repositories that appeared after the first
audit. They are generated from the same inventory the site uses, so a count can
only be published if it was measured.

Ordering inside a category: the featured repositories first, in the curated order,
then the rest by measured test count, highest first.

Usage:
    python tools/sync_project_tables.py           # rewrite the README tables
    python tools/sync_project_tables.py --check   # exit 1 if the README is stale
"""
import argparse
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
README = ROOT / "README.md"
PROJECTS = ROOT / "site" / "assets" / "projects.json"

SECTIONS = [
    ("Red-team and detection engineering", ["red-team"]),
    ("AI and agent security", ["ai-security"]),
    ("Assessment, automation and platform", ["platform"]),
    ("Upstream contribution and other", ["contribution", "other"]),
]

START = "## Projects\n"
END = "\n---\n\n## Services\n"


def test_label(project):
    """The count column. A suite that reports checks rather than test cases says so."""
    source = project.get("testSource") or ""
    count = project["testCount"]
    if "checks" in source and "tests" not in source:
        labs = re.search(r"(\d+) labs", source)
        if labs:
            return "%d checks across %s labs" % (count, labs.group(1))
        return "%d checks" % count
    return "%d tests" % count


def build(projects, featured):
    by_category = {}
    for project in projects:
        by_category.setdefault(project["category"], []).append(project)

    def ordered(categories):
        picked = [p for cat in categories for p in by_category.get(cat, [])]
        head = [p for name in featured for p in picked if p["name"] == name]
        tail = sorted((p for p in picked if p not in head),
                      key=lambda p: (-p["testCount"], p["name"]))
        return head + tail

    blocks = []
    counts = []
    for title, categories in SECTIONS:
        rows = ordered(categories)
        counts.append((title, len(rows)))
        lines = ["### %s" % title, "",
                 "| Project | What it does | Tests |",
                 "| --- | --- | --- |"]
        for project in rows:
            lines.append("| [%s](%s) | %s | %s |"
                         % (project["name"], project["url"],
                            project["description"], test_label(project)))
        blocks.append("\n".join(lines))

    generated = START + "\n" + "\n\n".join(blocks)
    return generated, counts


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true",
                        help="exit 1 when the checked-in README differs from a fresh build")
    args = parser.parse_args()

    data = json.loads(PROJECTS.read_text(encoding="utf-8"))
    generated, counts = build(data["projects"], data["featured"])

    text = README.read_text(encoding="utf-8")
    start = text.index(START)
    end = text.index(END)
    current = text[start:end]
    expected = generated

    if args.check:
        if current != expected:
            print("README project tables are stale")
            return 1
        print("README project tables are up to date")
        return 0

    updated = text[:start] + expected + text[end:]
    if updated != text:
        README.write_bytes(updated.encode("utf-8"))
        print("portfolio README project tables regenerated")
    else:
        print("portfolio README project tables already current")
    for title, count in counts:
        print("  %-42s %d projects" % (title, count))
    print("  total:", len(data["projects"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
