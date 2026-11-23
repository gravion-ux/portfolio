# GitHub Sponsors Reconciliation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every published GitHub Sponsors claim true: the repository text matches the live 13-tier ladder, the linked support page exists, the three tier promises are backed by real sponsor slots, and every published count traces to a measurement.

**Architecture:** One spec, eight repositories. The `portfolio` repository holds the site, the measurement inventory and the content pack; the `gravion-ux` profile repository holds the profile README and its banner; the six repositories featured on the live sponsors page each get a sponsor slot and a funding file. The live GitHub Sponsors profile is edited last, because it is the only surface that cannot be changed from a repository.

**Tech Stack:** Static HTML/CSS/JS (GitHub Pages), Python 3.15 (inventory tooling), Git over HTTPS with the Windows credential manager, PIL 13.0 for the banner, `mcode-tools connector call connector__matrix__describe_images` for banner verification.

## Global Constraints

- The published tier ladder is fixed. A published tier price can never be edited. Never create, retire or re-price a tier.
- The live ladder, verbatim: monthly - Supporter $5, Backer $10, Sponsor $25, Pro Sponsor $50, Security Partner $100, Anchor $500, Executive $1,000. One-time - One-time Backer $25, One-time Sponsor $50, Fix a bug $50, Fund a feature $250, Fund a release $1,000, Fund a roadmap quarter $2,500. Goal: $250 per month, 0% funded.
- `tools/verified-tests.json` is the only source of test counts. The count convention is total collected (passed + skipped).
- Published figures after this change: **36 open-source projects**, **2,455 test cases across 34 repositories** (2,448 passing, 7 skipped, 0 failing), **36 of 36 MIT licensed**, **35 of 36 with a CI workflow**, **15 of 16 Node tools and 14 of 18 Python tools with zero runtime dependencies**.
- The site must contain no ampersand character in canonical descriptions (`tools/refresh_projects.py` enforces this).
- File formats are preserved exactly: `README.md`, `resume.md`, `docs/*.md` and `site/*.html` are LF with no BOM; `site/assets/projects.json` is UTF-8, no BOM, LF.
- The banner is edited by pixel replacement only. Every other pixel of `builder-pass-v2.png` must stay identical.

---

### Task 1: Refresh the measurement inventory

**Files:**
- Modify: `portfolio-repo/tools/verified-tests.json`
- Modify: `portfolio-repo/tools/project-descriptions.json`
- Modify: `portfolio-repo/tools/refresh_projects.py`
- Regenerate: `portfolio-repo/site/assets/projects.json`

**Interfaces:**
- Consumes: the six measured suites from Task 0 (below).
- Produces: `site/assets/projects.json` with 36 projects, `featured` equal to the live six, and `testCount` present for 34 of them. Every later task quotes these numbers.

- [ ] **Step 1: Add the six measured entries to `tools/verified-tests.json`**

Add these entries and change the `_comment` and `measured` fields to match:

```json
"_comment": "Test counts measured by running each repository's own suite on a fresh clone. Source string records the exact command used. These are the only test counts allowed to be published.",
"measured": "2026-11-23",
```

```json
"gravion-ai": { "tests": 116, "source": "python -m pytest -q (pytest 9.2.0, Python 3.15.0): 115 passed, 1 skipped" },
"wp-cve-hunter": { "tests": 82, "source": "python -m pytest -q (pytest 9.2.0, Python 3.15.0): 82 passed" },
"llm-redteam-kit": { "tests": 46, "source": "python -m pytest -q (pytest 9.2.0, Python 3.15.0): 46 passed" },
"mcp-shield": { "tests": 46, "source": "python -m pytest -q (pytest 9.2.0, Python 3.15.0): 46 passed" },
"jwt-auditor": { "tests": 36, "source": "python -m pytest -q (pytest 9.2.0, Python 3.15.0): 36 passed" },
"gravion-hunter": { "tests": 26, "source": "python -m pytest -q (pytest 9.2.0, Python 3.15.0): 26 passed" },
```

- [ ] **Step 2: Verify the total**

Run:

```powershell
py -3 -c "import json,pathlib; d=json.loads(pathlib.Path('portfolio-repo/tools/verified-tests.json').read_text(encoding='utf-8')); v={k:x for k,x in d.items() if isinstance(x,dict) and 'tests' in x}; print(len(v), sum(x['tests'] for x in v.values()))"
```

Expected: `34 2455`. If the count is not 34 / 2455, stop and fix the JSON before continuing.

- [ ] **Step 3: Add the six canonical descriptions to `tools/project-descriptions.json`**

Add these keys. None contains an ampersand:

```json
"gravion-ai": "Gravion AI - a modular AI platform startups build on: many AI types plus an all-in-one, in four tiers, with a signed-licensing core. Bring your own key or run locally.",
"wp-cve-hunter": "WordPress plugin and theme version fingerprinter with CVE matching - prioritised vulnerability reports for authorised testing. Offline inventory mode, zero dependencies.",
"llm-redteam-kit": "A zero-dependency CI gate for LLM red-teaming: a curated OWASP-LLM-2025 probe pack with transparent scoring and an offline mock mode.",
"mcp-shield": "Security auditor for MCP server configs - tool-poisoning detection, secret and permission review, and rug-pull hash-pinning. Zero dependencies.",
"jwt-auditor": "JWT security auditor: alg=none and algorithm confusion, weak-secret dictionary attack, kid injection, parser differentials - risk-scored reports.",
"gravion-hunter": "Autonomous bug bounty agent framework - scope-enforced hunting, 7-question validation gate, dedupe-first discipline."
```

- [ ] **Step 4: Extend `CATEGORY` and `FEATURED` in `tools/refresh_projects.py`**

Add to `CATEGORY`:

```python
    "gravion-ai": "platform",
    "wp-cve-hunter": "red-team",
    "llm-redteam-kit": "ai-security",
    "mcp-shield": "ai-security",
    "jwt-auditor": "ai-security",
    "gravion-hunter": "platform",
```

Replace `FEATURED` with the live featured list:

```python
FEATURED = ["iamosiac", "wp-cve-hunter", "llm-redteam-kit", "mcp-shield", "jwt-auditor", "gravion-ai"]
```

Update the comment above `FEATURED` to: "Repositories featured on GitHub Sponsors. Each one is MIT licensed, has a CI workflow, and has a measured test count."

- [ ] **Step 5: Regenerate `site/assets/projects.json`**

Run from the repository root:

```powershell
python tools/refresh_projects.py
```

Expected: `wrote .../site/assets/projects.json (36 projects)`. The script reads the GitHub token from the credential helper and must not print it.

- [ ] **Step 6: Verify the regenerated file**

Run:

```powershell
python tools/refresh_projects.py --check
py -3 -c "import json,pathlib; d=json.loads(pathlib.Path('portfolio-repo/site/assets/projects.json').read_text(encoding='utf-8')); p=d['projects']; print(len(p), sum(x.get('testCount') or 0 for x in p), d['featured'])"
```

Expected: `projects.json is up to date` and `36 2455 ['iamosiac', 'wp-cve-hunter', 'llm-redteam-kit', 'mcp-shield', 'jwt-auditor', 'gravion-ai']`.

- [ ] **Step 7: Commit**

```powershell
git -C portfolio-repo add tools/verified-tests.json tools/project-descriptions.json tools/refresh_projects.py site/assets/projects.json
git -C portfolio-repo commit -m "chore: add six measured projects to the inventory

Measured on a fresh clone on 2026-11-23: gravion-ai 116, wp-cve-hunter 82,
llm-redteam-kit 46, mcp-shield 46, jwt-auditor 36, gravion-hunter 26.
The inventory now holds 36 projects and 2,455 test cases across 34 repos."
```

### Task 2: Update the site

**Files:**
- Modify: `portfolio-repo/site/index.html`
- Create: `portfolio-repo/site/support.html`

**Interfaces:**
- Consumes: the figures from Task 1 (36 projects, 2,455 tests).
- Produces: a live support page at `https://gravion-ux.github.io/portfolio/support.html` that `resume.md` links to, and a home page whose every number matches the inventory.

- [ ] **Step 1: Replace the counts in `site/index.html`**

Apply these exact replacements (old -> new):

| Old | New |
| --- | --- |
| `35 open-source security tools, 2,300+ automated tests, bug bounty researcher` | `36 open-source projects, 2,455 automated tests, bug bounty researcher` |
| `Penetration tester. Builder of 35 open-source security tools.` | `Penetration tester. Builder of 36 open-source projects.` |
| `35 security tools. 2,300+ automated tests. Proof, not promises.` | `36 open-source projects. 2,455 automated tests. Proof, not promises.` |
| `<span class="count" data-count="35">0</span>` | `<span class="count" data-count="36">0</span>` |
| `<span class="stat-label">open-source security tools published</span>` | `<span class="stat-label">open-source projects published</span>` |
| `<span class="count" data-count="2300">0</span>+` | `<span class="count" data-count="2455">0</span>` |
| `<span class="stat-label">automated tests, measured by running them</span>` | `<span class="stat-label">automated tests across 34 repositories</span>` |
| `I build and maintain <strong>35 open-source security tools</strong>` | `I build and maintain <strong>36 open-source projects</strong>` |
| `<span class="pass-meta">` | no change (not present) |
| `<strong>Arsenal</strong>` | no change (not present) |
| `35 tools · 2,300+ tests` | `36 projects · 2,455 tests` |
| `+30 more` | `+25 more` |
| `gravion-ai 77 tests` | `gravion-ai 116 tests` |
| `wp-cve-hunter 81 tests` | `wp-cve-hunter 82 tests` |
| `jwt-auditor 30 tests` | `jwt-auditor 36 tests` |
| `All 35 tools in the arsenal are free and open source` | `All 36 projects in the arsenal are free and open source` |
| `35 open-source tools, built in the open.` | `36 open-source projects, built in the open.` |
| `gravion-ai  wp-cve-hunter  llm-redteam-kit  mcp-shield  jwt-auditor  +30 more` | `gravion-ai  wp-cve-hunter  llm-redteam-kit  mcp-shield  jwt-auditor  +25 more` |
| `+ 30 more tools` | `+ 25 more tools` |

The five flagships already show 46 tests for `llm-redteam-kit` and `mcp-shield`; those are already correct and stay.

- [ ] **Step 2: Create `site/support.html`**

Create the page with the same head, header, footer and scripts as `site/index.html`. It has no hero canvas, so `assets/main.js` runs its guarded paths only. The body is:

```html
<main id="main">
<section class="section" id="top">
  <div class="wrap">
    <p class="section-tag reveal">// support</p>
    <h1 class="section-title reveal">Sponsor the <span class="accent">open-source work</span></h1>
    <p class="section-lede reveal">Every tool in the arsenal is free, MIT licensed and free of telemetry. Sponsorship pays for the parts nobody sees: issue triage, CI maintenance, dependency review of my own tools, and the next release. The goal is $250 a month - that is dedicated weekly time to maintain all 36 projects and ship one new community tool or a major upgrade every month.</p>
    <div class="cta-row reveal">
      <a class="btn btn-primary" href="https://github.com/sponsors/gravion-ux" rel="noopener noreferrer">Sponsor on GitHub <span aria-hidden="true">→</span></a>
      <a class="btn btn-ghost" href="index.html#support">Other ways to support</a>
    </div>
    <ul class="stats reveal" aria-label="Sponsorship facts">
      <li class="stat glass"><span class="stat-value"><span class="count" data-count="13">0</span></span><span class="stat-label">published tiers - seven monthly, six one-time</span></li>
      <li class="stat glass"><span class="stat-value"><span class="count" data-count="250">0</span></span><span class="stat-label">monthly goal in US dollars</span></li>
      <li class="stat glass"><span class="stat-value"><span class="count" data-count="36">0</span></span><span class="stat-label">open-source projects kept alive</span></li>
      <li class="stat glass"><span class="stat-value"><span class="count" data-count="2455">0</span></span><span class="stat-label">automated tests across 34 repositories</span></li>
    </ul>
  </div>
</section>

<section class="section section-alt" id="monthly">
  <div class="wrap">
    <p class="section-tag reveal">// 01 — monthly tiers</p>
    <h2 class="section-title reveal">Seven <span class="accent">monthly tiers</span></h2>
    <p class="section-lede reveal">Monthly sponsorship is what keeps a tool maintained between releases. Custom amounts are welcome from $5.</p>
    <div class="support-grid">
      <article class="pay-card glass reveal"><div class="pay-head"><span class="pay-letter">S</span><h3>Supporter</h3><span class="pay-badge">$5 / month</span></div><p>Your name in the Supporters section of my profile README, and my thanks in release notes.</p></article>
      <article class="pay-card glass reveal"><div class="pay-head"><span class="pay-letter">B</span><h3>Backer</h3><span class="pay-badge">$10 / month</span></div><p>Everything in Supporter, plus early access to new tools before public release announcements.</p></article>
      <article class="pay-card glass reveal"><div class="pay-head"><span class="pay-letter">S</span><h3>Sponsor</h3><span class="pay-badge">$25 / month</span></div><p>Everything in Backer, plus your name or logo in the flagship repos' README sponsor sections.</p></article>
      <article class="pay-card glass reveal"><div class="pay-head"><span class="pay-letter">P</span><h3>Pro Sponsor</h3><span class="pay-badge">$50 / month</span></div><p>Everything in Sponsor, plus priority on your feature requests and issue reports across my repos.</p></article>
      <article class="pay-card glass reveal"><div class="pay-head"><span class="pay-letter">SP</span><h3>Security Partner</h3><span class="pay-badge">$100 / month</span></div><p>Everything in Pro Sponsor, plus first look at new flagship tools and a monthly community Q&A post answering sponsor questions.</p></article>
      <article class="pay-card glass reveal"><div class="pay-head"><span class="pay-letter">A</span><h3>Anchor</h3><span class="pay-badge">$500 / month</span></div><p>Everything in Security Partner, named as anchor sponsor across the site, a quarterly one-to-one call, and one funded roadmap item per quarter.</p></article>
      <article class="pay-card glass reveal"><div class="pay-head"><span class="pay-letter">E</span><h3>Executive</h3><span class="pay-badge">$1,000 / month</span></div><p>Everything in Anchor, a quarterly review of your use case, two funded roadmap items per year, and first response on blocking issues.</p></article>
    </div>
  </div>
</section>

<section class="section" id="one-time">
  <div class="wrap">
    <p class="section-tag reveal">// 02 — one-time tiers</p>
    <h2 class="section-title reveal">Six <span class="accent">one-time tiers</span></h2>
    <p class="section-lede reveal">One-time sponsorship funds a specific piece of work. The scope is agreed before the work starts.</p>
    <div class="support-grid">
      <article class="pay-card glass reveal"><div class="pay-head"><span class="pay-letter">B</span><h3>One-time Backer</h3><span class="pay-badge">$25 once</span></div><p>Name in the Supporters section of my profile README.</p></article>
      <article class="pay-card glass reveal"><div class="pay-head"><span class="pay-letter">S</span><h3>One-time Sponsor</h3><span class="pay-badge">$50 once</span></div><p>Name or logo in one flagship repo's README sponsor section.</p></article>
      <article class="pay-card glass reveal"><div class="pay-head"><span class="pay-letter">B</span><h3>Fix a bug</h3><span class="pay-badge">$50 once</span></div><p>One confirmed defect fixed, credited in the release notes. The funding covers the fix, the regression test that stops it coming back, and the release notes entry.</p></article>
      <article class="pay-card glass reveal"><div class="pay-head"><span class="pay-letter">F</span><h3>Fund a feature</h3><span class="pay-badge">$250 once</span></div><p>One scoped feature shipped in a tagged release and covered by tests. The funding covers the build, the tests and the release notes.</p></article>
      <article class="pay-card glass reveal"><div class="pay-head"><span class="pay-letter">R</span><h3>Fund a release</h3><span class="pay-badge">$1,000 once</span></div><p>A full release cycle for one flagship tool: version bump, changelog, release notes, and CI green on the release commit.</p></article>
      <article class="pay-card glass reveal"><div class="pay-head"><span class="pay-letter">Q</span><h3>Fund a roadmap quarter</h3><span class="pay-badge">$2,500 once</span></div><p>One quarter of work on one flagship tool, scope agreed in advance, with progress shared at the end of the quarter.</p></article>
    </div>
  </div>
</section>

<section class="section section-alt" id="supporters">
  <div class="wrap">
    <p class="section-tag reveal">// 03 — current sponsors</p>
    <h2 class="section-title reveal">The <span class="accent">supporters</span></h2>
    <p class="support-note reveal">No sponsors yet - the profile is at 0% of its $250 monthly goal, and the first sponsor is still open. Sponsors are listed here by tier as soon as they appear.</p>
    <ul class="addr-list reveal">
      <li class="addr-row"><span class="addr-net">$5 Supporter and above</span><span class="pay-id-row"><code class="pay-id">Supporters section of the GitHub profile README</code></span></li>
      <li class="addr-row"><span class="addr-net">$25 Sponsor and above</span><span class="pay-id-row"><code class="pay-id">Sponsor sections of the flagship repository READMEs</code></span></li>
      <li class="addr-row"><span class="addr-net">$500 Anchor and above</span><span class="pay-id-row"><code class="pay-id">This page, named across the site</code></span></li>
    </ul>
    <p class="support-note reveal">Name placement starts at the $25 a month tier. Every sponsor gets a public thank-you, and no tier grants access to private code.</p>
  </div>
</section>

<section class="section" id="other">
  <div class="wrap">
    <p class="section-tag reveal">// 04 — other ways</p>
    <h2 class="section-title reveal">Not on <span class="accent">GitHub</span></h2>
    <p class="section-lede reveal">GitHub Sponsors is the rail that carries the tier promises above. These are the other rails, and they keep the tools free without a tier.</p>
    <div class="support-grid">
      <article class="pay-card glass reveal"><div class="pay-head"><h3>UPI, PayPal, Binance Pay, crypto</h3></div><p>One-off payments on the rails you already use. Payment always happens on that rail's own page or app.</p><a class="btn btn-ghost pay-cta" href="index.html#support">Open the payment options</a></article>
      <article class="pay-card glass reveal"><div class="pay-head"><h3>Paid assessments</h3></div><p>Web and API security assessments, secure code review and threat modelling, and security automation builds - scope agreed in writing before any testing starts.</p><a class="btn btn-ghost pay-cta" href="index.html#services">See the services</a></article>
    </div>
  </div>
</section>
</main>
```

The header nav on this page points at `index.html#about`, `index.html#arsenal`, `index.html#services`, `index.html#support`, `index.html#contact` instead of bare anchors, and the brand link points at `index.html`. The `<title>` is `Support the open-source work — GRAVION` and the meta description is `Sponsor the open-source security projects by Priyanshu Kumar Thakur: seven monthly tiers from $5, six one-time tiers, and a $250 monthly goal. All 36 projects stay free, MIT licensed and free of telemetry.`

- [ ] **Step 3: Verify the page locally**

Run:

```powershell
py -3 -c "import pathlib,re; t=pathlib.Path('portfolio-repo/site/support.html').read_text(encoding='utf-8'); print('tiers', len(re.findall(r'pay-card', t))); print('amp', t.count('&')); print('has_main', '<main' in t)"
```

Expected: `tiers 15`, `amp 4` (the four `&`/`&` entities in the page: `Q&A` and the `&` in `&` counts - verify no bare `&` outside an entity), `has_main True`.

- [ ] **Step 4: Commit**

```powershell
git -C portfolio-repo add site/index.html site/support.html
git -C portfolio-repo commit -m "feat: publish the support page and correct the site's counts

The short resume linked to support.html, which had never been built and
returned 404. The page now carries the live thirteen-tier ladder and the
current-sponsors panel, and every count on the home page matches the
measurement inventory: 36 projects, 2,455 tests across 34 repositories."
```

### Task 3: Correct the portfolio documentation

**Files:**
- Modify: `portfolio-repo/README.md`
- Modify: `portfolio-repo/resume.md`
- Modify: `portfolio-repo/docs/sponsors-setup.md`
- Modify: `portfolio-repo/docs/launch-checklist.md`

**Interfaces:**
- Consumes: the live ladder and the measured figures.
- Produces: four documents whose statements are all true against the live profile and the inventory.

- [ ] **Step 1: Correct `README.md`**

Apply these replacements:

| Old | New |
| --- | --- |
| `— 30 published` | `— 36 published` |
| `| Authored open-source projects | 30 | The 33 public repositories minus this profile repository, this website repository, and a fork of another maintainer's project |` | `| Authored open-source projects | 36 | The 42 public repositories minus 2 forks, this profile repository, this website repository, and 2 unrelated personal repositories |` |
| `| Test cases across 28 projects | 2,103 collected, 2,097 passing, 6 skipped, 0 failing | Each repository's own suite, run on a fresh clone on 2026-11-11 |` | `| Test cases across 34 projects | 2,455 collected, 2,448 passing, 7 skipped, 0 failing | Each repository's own suite, run on a fresh clone on 2026-11-23 |` |
| `| The three flagship tools | 129 + 187 + 115 = 431 tests | `fixqueue`, `rulebench`, `opsledger` |` | `| The five flagship builds | 116 + 82 + 46 + 46 + 36 = 326 tests | `gravion-ai`, `wp-cve-hunter`, `llm-redteam-kit`, `mcp-shield`, `jwt-auditor` |` |
| `| MIT licensed | 30 of 30 |` | `| MIT licensed | 36 of 36 |` |
| `| Repositories with a CI workflow | 23 of 30 |` | `| Repositories with a CI workflow | 35 of 36 |` |
| `| Node tools with zero runtime dependencies | 15 of 16 | `package.json` of each repository |` | `| Node tools with zero runtime dependencies | 15 of 16 | `package.json` of each repository, checked 2026-11-23 |` |
| `| Python tools with zero runtime dependencies | 9 of 12 | `pyproject.toml` and `requirements.txt` of each repository |` | `| Python tools with zero runtime dependencies | 14 of 18 | `pyproject.toml` and `requirements.txt` of each repository, checked 2026-11-23 |` |
| `Nine tiers are published on GitHub Sponsors — five monthly from $5, and four one-time.` | `Thirteen tiers are published on GitHub Sponsors — seven monthly from $5, and six one-time.` |
| `All 30 published projects carry the MIT licence.` | `All 36 published projects carry the MIT licence.` |

Add a row to the repository layout table:

```markdown
| `site/support.html` | The sponsorship page: the published tier ladder and the current-sponsors panel |
```

- [ ] **Step 2: Correct `resume.md`**

Apply these replacements:

| Old | New |
| --- | --- |
| `30 published projects, all MIT` | `36 published projects, all MIT` |
| `Built and published 30 MIT licensed security and developer tools` | `Built and published 36 MIT licensed security and developer tools` |
| `All 30 published projects are MIT licensed` | `All 36 published projects are MIT licensed` |
| `- **Monthly** — Supporter $5, Sponsor $25, Partner $100, Anchor $500, Executive $1,000` | `- **Monthly** — Supporter $5, Backer $10, Sponsor $25, Pro Sponsor $50, Security Partner $100, Anchor $500, Executive $1,000` |
| `- **One time** — Fix a bug $50, Fund a feature $250, Fund a release $1,000, Fund a roadmap quarter $2,500` | `- **One time** — One-time Backer $25, One-time Sponsor $50, Fix a bug $50, Fund a feature $250, Fund a release $1,000, Fund a roadmap quarter $2,500` |

The `support.html` link at the end of that section stays; Task 2 makes it resolve.

- [ ] **Step 3: Rebuild `docs/sponsors-setup.md`**

Replace sections 1 to 5 with the live content, keep sections 6 to 9, and change step 11 of section 8.

Section 1 becomes:

```markdown
## 1. Short bio

143 characters. GitHub's limit is 160. This is the text published on the live profile.

```
Security engineer building open-source tools for AppSec, detection engineering and engagement evidence. Funding keeps them free and maintained.
```
```

Section 2 becomes the published introduction:

```markdown
## 2. Introduction

Published on the live profile. It names the flagships and the platforms the tools are hunted on.

```
Security researcher and open-source builder from Delhi, India. I build free, MIT-licensed security tools the community can actually use - 36 open-source projects and counting, 2,455 automated tests, every repository with a CI workflow. My flagships: wp-cve-hunter - WordPress CVE detection; llm-redteam-kit - OWASP-mapped LLM red-teaming cases; mcp-shield - MCP configuration security auditor; jwt-auditor - JWT attack-surface checks; gravion-hunter - a scope-locked, dedupe-first bug bounty agent framework; GRAVION AI - a modular AI platform, built in public, piece by piece. Alongside the tools, I hunt on Patchstack, HackerOne and Bugcrowd (IDOR/BOLA, broken auth, business logic) and publish methodology writeups so other researchers can reuse the workflow. Sponsorship keeps the tools free and maintained: it funds development time, test infrastructure, and the lab I use to verify vulnerabilities safely before reporting them. Every sponsor is credited - your support is literally what keeps new tools shipping.
```
```

Section 3 becomes:

```markdown
## 3. Featured repositories - six

GitHub allows up to six. These are the six currently featured on the live profile. Each one is
MIT licensed, has a CI workflow, and has a measured test count.

| Repository | Test cases | How the count was obtained |
| --- | --- | --- |
| `iamosiac` | 39 | `python -m pytest -q` on a fresh clone |
| `wp-cve-hunter` | 82 | `python -m pytest -q` on a fresh clone |
| `llm-redteam-kit` | 46 | `python -m pytest -q` on a fresh clone |
| `mcp-shield` | 46 | `python -m pytest -q` on a fresh clone |
| `jwt-auditor` | 36 | `python -m pytest -q` on a fresh clone |
| `gravion-ai` | 116 | `python -m pytest -q` on a fresh clone - 115 passed, 1 skipped |

Star counts move. The live values are in `site/assets/projects.json`, which
`tools/refresh_projects.py` regenerates from the GitHub API.

Every repository with a measured test count is listed in `tools/verified-tests.json`. `TRISHUL`
is MIT licensed and has 118 tests, and it now has a CI workflow as well - it is simply not one
of the six featured.
```

Section 4 becomes:

```markdown
## 4. Monthly tiers - seven

| Tier | Price | What it includes |
| --- | --- | --- |
| Supporter | $5 / month | Your name in the Supporters section of my profile README, and my thanks in release notes |
| Backer | $10 / month | Everything in Supporter, plus early access to new tools before public release announcements |
| Sponsor | $25 / month | Everything in Backer, plus your name or logo in the flagship repos' README sponsor sections |
| Pro Sponsor | $50 / month | Everything in Sponsor, plus priority on your feature requests and issue reports across my repos |
| Security Partner | $100 / month | Everything in Pro Sponsor, plus first look at new flagship tools and a monthly community Q&A post answering sponsor questions |
| Anchor | $500 / month | Everything in Security Partner, named as anchor sponsor across the site, quarterly one-to-one call, one funded roadmap item per quarter |
| Executive | $1,000 / month | Everything in Anchor, quarterly review of your use case, two funded roadmap items per year, first response on blocking issues |

The ladder stops at $1,000 per month on purpose. A solo developer cannot honestly
honour a $2,500 service-level tier. Above that, it is a conversation, not a published
tier.
```

Section 5 becomes:

```markdown
## 5. One-time tiers - six

| Tier | Price | What it funds |
| --- | --- | --- |
| One-time Backer | $25 | Name in the Supporters section of my profile README |
| One-time Sponsor | $50 | Name or logo in one flagship repo's README sponsor section |
| Fix a bug | $50 | One confirmed defect fixed, credited in the release notes |
| Fund a feature | $250 | One scoped feature shipped in a tagged release and covered by tests |
| Fund a release | $1,000 | A full release cycle for one flagship tool: version bump, changelog, release notes, CI green on the release commit |
| Fund a roadmap quarter | $2,500 | One quarter of work on one flagship tool, scope agreed in advance, progress shared at the end of the quarter |
```

Section 6 keeps the custom amount values (recommended $25, minimum $5) and stays labelled
`## 6. Custom amount`. In section 8, step 11 becomes:

```markdown
11. Create the thirteen tiers from sections 4 and 5, and paste the welcome message from
    section 7 into each one. **Prices cannot be changed after publishing.**
```

Section 9 keeps its three constraints unchanged.

- [ ] **Step 4: Correct `docs/launch-checklist.md`**

Change the unchecked sponsors line to:

```markdown
- [x] GitHub Sponsors profile published with all thirteen tiers.
```

Replace the whole of section 6 with:

```markdown
## 6. Sponsor attribution slots

The live tiers promise a name in the Supporters section of the profile README and a name or
logo in the README sponsor sections of the flagship repos. Those promises have to exist before
anyone signs up for them.

- [x] `gravion-ux/README.md` - Supporters section.
- [x] `iamosiac/README.md` - sponsor slot.
- [x] `wp-cve-hunter/README.md` - sponsor slot.
- [x] `llm-redteam-kit/README.md` - sponsor slot.
- [x] `mcp-shield/README.md` - sponsor slot.
- [x] `jwt-auditor/README.md` - sponsor slot.
- [x] `gravion-ai/README.md` - sponsor slot.
- [x] `.github/FUNDING.yml` on each of the six featured repositories.

Keep the slot small and at the bottom. It should read as a fact, not a banner.

Also done, for the same reason - the Sponsor button has to be reachable from the
pages people already land on:

- [x] A current-sponsors section on the site support page.
- [x] The published tier ladder on `site/support.html`.
```

The earlier entries for `fixqueue`, `rulebench` and `opsledger` in section 6 are removed: those
three are no longer the featured six, and their sponsor slots still exist in those
repositories.

- [ ] **Step 5: Verify no stale claim survives**

Run from the repository root:

```powershell
git -C portfolio-repo grep -n -i -E "nine tiers|five monthly|four one-time|2,300\+|35 open-source|30 published|30 of 30|23 of 30|9 of 12|no CI workflow" -- README.md resume.md docs site
```

Expected: no output. Every hit must be fixed before the commit.

- [ ] **Step 6: Commit**

```powershell
git -C portfolio-repo add README.md resume.md docs/sponsors-setup.md docs/launch-checklist.md
git -C portfolio-repo commit -m "docs: reconcile the sponsor ladder, counts and checklist

The content pack described nine tiers, a six-repo featured list and a
143-character bio that no longer matched the live profile, and it claimed
TRISHUL had no CI workflow. The tier tables, the project and test counts,
the licence and CI rows, and the launch checklist now describe what is
actually published."
```

### Task 4: Back the profile promises

**Files:**
- Modify: `_clone_gravion-ux/README.md`
- Modify: `_clone_gravion-ux/builder-pass-v2.png` (already regenerated in the preparation step)

**Interfaces:**
- Consumes: the figures from Task 1 and the house style from `fixqueue/README.md`.
- Produces: a profile README with a Supporters section, which is what the $5 Supporter and $25 One-time Backer tiers promise.

- [ ] **Step 1: Add the Supporters section to the profile README**

Insert before the final `*Proof, not promises.*` line:

```markdown
## SUPPORT

Sponsorship pays for the maintenance, triage and release time behind the tools. Sponsors are
listed here by name, and name placement starts at the $25 a month tier.

- [Sponsor on GitHub](https://github.com/sponsors/gravion-ux)
```

- [ ] **Step 2: Correct the counts in the profile README**

| Old | New |
| --- | --- |
| `35 open-source tools, 2,300+ tests, Patchstack` | `36 open-source projects, 2,455 tests, Patchstack` |
| `| 35 | 2,300+ | 03 |` | `| 36 | 2,455 | 03 |` |
| `**OPEN-SOURCE TOOLS** — all MIT licensed` | `**OPEN-SOURCE PROJECTS** — all MIT licensed` |
| `**MEASURED TESTS** — across the flagships` | `**MEASURED TESTS** — across 34 repositories` |

- [ ] **Step 3: Confirm the banner pixels**

Run:

```powershell
py -3 -c "from PIL import Image, ImageChops; a=Image.open('career-ops/_sponsor_audit/builder-pass-original.png').convert('RGB'); b=Image.open('_clone_gravion-ux/builder-pass-v2.png').convert('RGB'); d=ImageChops.difference(a,b); print('bbox', d.getbbox())"
```

Expected: `bbox (791, 760, 1602, 799)` - changes confined to the two number groups.

- [ ] **Step 4: Commit**

```powershell
git -C _clone_gravion-ux add README.md builder-pass-v2.png
git -C _clone_gravion-ux commit -m "feat: add the Supporters section and refresh the banner counts

The $5 Supporter and $25 One-time Backer tiers promise a name in the
Supporters section of the profile README, and the section did not exist.
The banner now reads 36 open-source projects and 2,455 tests."
```

### Task 5: Back the flagship promises

**Files:**
- Modify: `_clone_<repo>/README.md` for `iamosiac`, `wp-cve-hunter`, `llm-redteam-kit`, `mcp-shield`, `jwt-auditor`, `gravion-ai`
- Create: `_clone_<repo>/.github/FUNDING.yml` for the same six

**Interfaces:**
- Consumes: the house style from `fixqueue/README.md`.
- Produces: the README sponsor sections and funding files that the $25 Sponsor and $50 One-time Sponsor tiers promise.

- [ ] **Step 1: Add the sponsor slot to each of the five MIT repositories**

Add this block immediately before the `## License` heading of `iamosiac`, `wp-cve-hunter`,
`llm-redteam-kit`, `mcp-shield` and `jwt-auditor`:

```markdown
## Sponsors

Sponsorship pays for the maintenance, triage and release time behind this tool. Sponsors are
listed here by name, and name placement starts at the $25 a month tier.

- [Sponsor on GitHub](https://github.com/sponsors/gravion-ux)
```

Where the repository has no `## License` heading at the end (`wp-cve-hunter` ends with an
Author section), append the block after the last section instead.

- [ ] **Step 2: Add a licence-aware sponsor slot to `gravion-ai`**

`gravion-ai`'s source code is MIT, but production deployments are governed by a commercial
agreement. The slot must not imply otherwise. Append after its `## Licence` section:

```markdown
## Sponsors

Sponsorship pays for the maintenance, triage and release time behind this tool. Sponsors are
listed here by name, and name placement starts at the $25 a month tier.

- [Sponsor on GitHub](https://github.com/sponsors/gravion-ux)

Sponsorship supports the open-source source code. Commercial deployments remain governed by
the commercial licence agreement.
```

- [ ] **Step 3: Create the funding files**

For each of the six repositories write `.github/FUNDING.yml` with exactly:

```yaml
github: [gravion-ux]
```

- [ ] **Step 4: Verify each repository**

For each of the six clones run:

```powershell
git -C _clone_<repo> status --short
git -C _clone_<repo> diff --cached --stat
```

Expected: only `README.md` and `.github/FUNDING.yml` are staged.

- [ ] **Step 5: Commit each repository separately**

```powershell
git -C _clone_<repo> commit -m "feat: add the sponsor slot and funding file

The $25 Sponsor tier promises a name or logo in the flagship repos' README
sponsor sections, and the section did not exist here."
```

- [ ] **Step 6: Push the seven repositories changed so far**

```powershell
foreach ($r in @('portfolio','gravion-ux','iamosiac','wp-cve-hunter','llm-redteam-kit','mcp-shield','jwt-auditor','gravion-ai')) {
  $d = if ($r -eq 'portfolio') { 'portfolio-repo' } else { "_clone_$r" }
  git -C $d push origin main
}
```

Check every exit code. A failed push must be fixed before continuing.

### Task 6: Update the live sponsors profile

**Files:**
- Browser only: the GitHub Sponsors profile settings for `gravion-ux`.

**Interfaces:**
- Consumes: the live ladder and the measured figures.
- Produces: a live profile whose introduction and goal text carry no stale number.

- [ ] **Step 1: Open the sponsors settings in the in-app Browser**

Load the `browser-use:control-in-app-browser` skill, then open `https://github.com/sponsors/gravion-ux`. If the page asks for a sign-in, ask the user to sign in personally in the visible tab - never type credentials.

- [ ] **Step 2: Replace the introduction text**

Set the profile introduction to the text from section 2 of `docs/sponsors-setup.md`, with `36 open-source projects and counting, 2,455 automated tests` in place of the old `35 tools and counting, 2,300+ automated tests`.

- [ ] **Step 3: Replace the goal text**

Set the goal description to:

```text
Covers dedicated weekly development time to maintain all 36 open-source projects and ship one new community tool or major upgrade every month.
```

- [ ] **Step 4: Save and verify**

Reload `https://github.com/sponsors/gravion-ux` and confirm the page shows 36 projects and 2,455 tests, and still lists the thirteen tiers and the $250 goal.

### Task 7: Verify everything and clean up

**Files:**
- Delete: `career-ops/_sponsor_audit/` and the temporary clones.

**Interfaces:**
- Consumes: every repository after its push.
- Produces: a verified public state and no temporary files left in the workspace.

- [ ] **Step 1: Wait for the Pages deployment**

The `portfolio` workflow deploys on a push to `site/**`. Poll:

```powershell
for ($i=0; $i -lt 20; $i++) {
  $code = (Invoke-WebRequest -Uri 'https://gravion-ux.github.io/portfolio/support.html' -UseBasicParsing -ErrorAction SilentlyContinue).StatusCode
  if ($code -eq 200) { "deployed after $i checks"; break }
  Start-Sleep -Seconds 20
}
```

- [ ] **Step 2: Verify the live support page**

```powershell
$c = (Invoke-WebRequest -Uri 'https://gravion-ux.github.io/portfolio/support.html' -UseBasicParsing).Content
foreach ($t in @('Supporter','Backer','Sponsor','Pro Sponsor','Security Partner','Anchor','Executive','One-time Backer','One-time Sponsor','Fix a bug','Fund a feature','Fund a release','Fund a roadmap quarter')) {
  if ($c -notmatch [regex]::Escape($t)) { "MISSING: $t" }
}
"tier names checked: 13"
```

Expected: no `MISSING:` lines.

- [ ] **Step 3: Verify no stale claim survives anywhere**

```powershell
git -C portfolio-repo grep -n -i -E "nine tiers|five monthly|four one-time|2,300\+|35 open-source|30 published|30 of 30" -- README.md resume.md docs site
git -C _clone_gravion-ux grep -n -i -E "2,300\+|35 open-source" -- README.md
```

Expected: no output from either command.

- [ ] **Step 4: Verify the inventory is consistent**

```powershell
python tools/refresh_projects.py --check
```

Expected: `projects.json is up to date`.

- [ ] **Step 5: Verify the live profile and the promise backing**

```powershell
$c = (Invoke-WebRequest -Uri 'https://github.com/sponsors/gravion-ux' -UseBasicParsing).Content
"goal 250: " + ($c -match '250')
foreach ($r in @('iamosiac','wp-cve-hunter','llm-redteam-kit','mcp-shield','jwt-auditor','gravion-ai')) {
  $rc = (Invoke-WebRequest -Uri "https://raw.githubusercontent.com/gravion-ux/$r/main/README.md" -UseBasicParsing).Content
  "{0}: sponsors section {1}, funding file {2}" -f $r, ($rc -match '## Sponsors'), ((Invoke-WebRequest -Uri "https://raw.githubusercontent.com/gravion-ux/$r/main/.github/FUNDING.yml" -UseBasicParsing).Content -match 'gravion-ux')
}
```

Expected: every repository reports `sponsors section True, funding file True`.

- [ ] **Step 6: Delete the temporary artifacts**

Delete with the trusted launcher, as a single bare top-level command:

```
rm -- "C:\Users\priya\.minimax\sessions\mvs_2ba71ace241c400e87532ec95e34a5c3\workspace\career-ops\_sponsor_audit" "C:\Users\priya\.minimax\sessions\mvs_2ba71ace241c400e87532ec95e34a5c3\workspace\portfolio-repo" "C:\Users\priya\.minimax\sessions\mvs_2ba71ace241c400e87532ec95e34a5c3\workspace\_clone_gravion-ux" "C:\Users\priya\.minimax\sessions\mvs_2ba71ace241c400e87532ec95e34a5c3\workspace\_clone_wp-cve-hunter" "C:\Users\priya\.minimax\sessions\mvs_2ba71ace241c400e87532ec95e34a5c3\workspace\_clone_llm-redteam-kit" "C:\Users\priya\.minimax\sessions\mvs_2ba71ace241c400e87532ec95e34a5c3\workspace\_clone_mcp-shield" "C:\Users\priya\.minimax\sessions\mvs_2ba71ace241c400e87532ec95e34a5c3\workspace\_clone_jwt-auditor" "C:\Users\priya\.minimax\sessions\mvs_2ba71ace241c400e87532ec95e34a5c3\workspace\_clone_gravion-ai" "C:\Users\priya\.minimax\sessions\mvs_2ba71ace241c400e87532ec95e34a5c3\workspace\_clone_iamosiac" "C:\Users\priya\.minimax\sessions\mvs_2ba71ace241c400e87532ec95e34a5c3\workspace\_clone_gravion-hunter"
```

- [ ] **Step 7: Report**

Report what was pushed to each repository, the live support page URL, the live profile state, and anything that could not be completed.

## Execution notes

Deliberate deviations from the plan above, recorded so the committed plan and
the committed files do not contradict each other.

1. **Name placement starts at $5, not $25, for the profile README.** The live
   $5 Supporter tier promises "your name in the Supporters section of my
   profile README", so the Supporters section and the support page both name
   $5/month Supporter and $25 one-time Backer for the profile README, and
   $25/month Sponsor and $50 one-time Sponsor for the repository slots.
2. **`portfolio-repo` is not a temporary artifact.** Task 7 Step 6 listed it
   for deletion; it is the primary repository and was kept.
3. **The plan's own figures were stale in three places.** `llm-redteam-kit`
   ships 26 probes, not 24; "every repo CI-green" is false (35 of 36 have a
   workflow, so the live introduction now says "every featured repo CI-green");
   and a uniform "+25 more" in the terminal listing would have totalled 30
   instead of 36, so the terminal says "+31 more" and the mini-grid "+25 more".
4. **Three canonical descriptions were tightened to what the repositories
   actually document** (`gravion-ai`, `llm-redteam-kit`, `jwt-auditor`), and
   each `tools/verified-tests.json` entry now carries its own measurement date.
5. **The profile README's "THINGS I'VE BUILT" table became the live featured
   six** - the same six the sponsors page lists - with the canonical
   descriptions from `tools/project-descriptions.json`.
6. **Stale published test counts in two featured repositories were corrected**:
   `wp-cve-hunter` said 81 tests (measured 82) and `jwt-auditor` said 30
   (measured 36). `gravion-ai` now states 116 collected, 115 passing and 1
   skipped.
