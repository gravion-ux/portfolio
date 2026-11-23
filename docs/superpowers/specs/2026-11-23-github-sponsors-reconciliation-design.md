# GitHub Sponsors reconciliation - design

Date: 2026-11-23. Repos in scope: `portfolio`, `gravion-ux` (profile), `wp-cve-hunter`,
`llm-redteam-kit`, `mcp-shield`, `jwt-auditor`, `gravion-ai`, `iamosiac`.

## 1. What is wrong today

The GitHub Sponsors profile publishes **13 tiers**. The repository text describes **nine**.
Three promises the live tiers make are not backed by anything. The page the short resume
links to does not exist. The published tool and test counts are not the numbers the
repository's own measurement file supports.

| Defect | Where | Evidence |
| --- | --- | --- |
| "Nine tiers - five monthly from $5, and four one-time" | `portfolio/README.md:138` | live profile publishes 7 monthly + 6 one-time |
| Monthly list misses $10 Backer, $50 Pro Sponsor; $100 named "Partner" not "Security Partner" | `portfolio/resume.md:122` | live ladder |
| One-time list misses $25 One-time Backer, $50 One-time Sponsor | `portfolio/resume.md:123` | live ladder |
| Link to `.../support.html` | `portfolio/resume.md:127` | HTTP 404 - the page was designed (unused CSS classes remain) but never built |
| Content pack describes 5 + 4 tiers, a 143-char bio and a six-repo featured list that is no longer live | `portfolio/docs/sponsors-setup.md` | live profile |
| "`TRISHUL` ... has no CI workflow" | `portfolio/docs/sponsors-setup.md:51` | false: `TRISHUL/.github/workflows/ci.yml` exists |
| "GitHub Sponsors profile published with all nine tiers" (unchecked) | `portfolio/docs/launch-checklist.md:16` | published with 13 |
| "`FUNDING.yml` on all six featured repositories", "a current-sponsors section", "a sponsors section in the profile README" (all ticked) | `portfolio/docs/launch-checklist.md:109-111` | none of the three exists |
| $5 Supporter promises a name in "the Supporters section of my profile README" | live tier | `gravion-ux/gravion-ux/README.md` has no Supporters section |
| $25 Sponsor promises name/logo in "the flagship repos' README sponsor sections" | live tier | none of the six live featured repos has one |
| "35 open-source security tools", "2,300+ automated tests" | site, profile README, sponsors intro, `builder-pass-v2.png` | `tools/verified-tests.json` supports 28 repos / 2,103 tests |

## 2. Ground truth

### 2.1 The live ladder (fetched 2026-11-23)

Goal **$250 per month**, 0% funded, "Be the first to sponsor this goal!". Featured work:
`iamosiac`, `wp-cve-hunter`, `llm-redteam-kit`, `mcp-shield`, `jwt-auditor`, `gravion-ai`.
Custom amount: default $25, minimum $5.

Monthly tiers:

| Tier | Price | Published reward |
| --- | --- | --- |
| Supporter | $5 | Your name in the Supporters section of my profile README, and my thanks in release notes. |
| Backer | $10 | Everything in Supporter, plus early access to new tools before public release announcements. |
| Sponsor | $25 | Everything in Backer, plus your name/logo in the flagship repos' README sponsor sections. |
| Pro Sponsor | $50 | Everything in Sponsor, plus priority on your feature requests and issue reports across my repos. |
| Security Partner | $100 | Everything in Pro Sponsor, plus first look at new flagship tools and a monthly community Q&A post answering sponsor questions. |
| Anchor | $500 | Everything in Security Partner; named as anchor sponsor across the site; quarterly one-to-one call; one funded roadmap item per quarter. |
| Executive | $1,000 | Everything in Anchor; quarterly review of your use case; two funded roadmap items per year; first response on blocking issues. |

One-time tiers:

| Tier | Price | Published reward |
| --- | --- | --- |
| One-time Backer | $25 | Name in the Supporters section of my profile README. |
| One-time Sponsor | $50 | Name/logo in one flagship repo's README sponsor section. |
| Fix a bug | $50 | One confirmed defect fixed; credited in the release notes. |
| Fund a feature | $250 | One scoped feature; shipped in a tagged release; covered by tests. |
| Fund a release | $1,000 | A full release cycle for one flagship tool; version bump, changelog and release notes; CI green on the release commit. |
| Fund a roadmap quarter | $2,500 | One quarter of work on one flagship tool; scope agreed in advance; progress shared at the end of the quarter. |

**A published tier price can never be edited.** The ladder is therefore fixed; only the
repository text is corrected to match it.

### 2.2 Measured counts (2026-11-23, Python 3.15.0, pytest 9.2.0)

| Repository | Command | Result | Previously published |
| --- | --- | --- | --- |
| `gravion-ai` | `python -m pytest -q` | 115 passed, 1 skipped (116 collected) | 77 |
| `wp-cve-hunter` | `python -m pytest -q` | 82 passed | 81 |
| `llm-redteam-kit` | `python -m pytest -q` | 46 passed | 46 (correct) |
| `mcp-shield` | `python -m pytest -q` | 46 passed | 46 (correct) |
| `jwt-auditor` | `python -m pytest -q` | 36 passed | 30 |
| `gravion-hunter` | `python -m pytest -q` | 26 passed | 26 (correct) |

Derived totals after the six additions:

- **2,455 test cases across 34 repositories** (2,103 + 352).
- **36 authored projects** in the published inventory (30 + the six above).
- **36 of 36 canonical MIT licences** - every `LICENSE` file fetched and compared to the
  canonical MIT text.
- **35 of 36 repositories have a CI workflow** - only `xerj-ipv6-rate-limit-fix` has none,
  which is correct for a patch submission.

Project-count derivation: 42 public repositories, minus 2 forks (`xerj`,
`web-security-labs-fork`), minus the profile repository, minus the website repository, minus
2 unrelated personal repositories (`agent-skills`, `Her--Him`) = 36.

## 3. Decisions

1. **One published metric.** Every surface says "36 open-source projects". "35 security
   tools" was never accurate: `catalog-forge` is a shop-catalogue crawler and `gravion-ai`
   is an AI platform. The project count is the number the inventory can produce.
2. **Exact test total.** Publish "2,455 automated tests", never "2,300+". The round-down
   was the only reason the old figure drifted away from the measurement file.
3. **Build `support.html` at the linked URL.** The link in `resume.md` is a promise to a
   page; a redirect would break it differently. The page uses the CSS classes that were
   already written for it (`.support-grid`, `.pay-card`, `.pay-head`, `.pay-badge`,
   `.support-note`).
4. **Tier prices and descriptions on GitHub stay untouched.** None of them mentions a
   count, and a price edit is impossible by design.
5. **Back the promises instead of weakening them.** The $5 and $25 tiers promise a
   Supporters section and README sponsor slots; those are created, with the house style
   copied from `fixqueue/README.md`, and `.github/FUNDING.yml` (`github: [gravion-ux]`) on
   every live featured repo so the Sponsor button is reachable.
6. **The banner is regenerated deterministically.** `builder-pass-v2.png` has the count
   baked into its pixels. The replacement keeps every other pixel: the two number groups
   are erased using the background sampled from a text-free strip in the same rows, and
   redrawn in Inter Bold 45 (the font calibrated against the original glyphs, IoU 0.74),
   resized to occupy exactly the original ink box and placed at the original position.
   Verified by vision: the line reads `36 OPEN-SOURCE TOOLS · 2,455 TESTS`, the other lines
   and the emblem are untouched.
7. **The live sponsors intro and goal text are edited to match.** They are the only
   surfaces that state a count outside the repository, and they live in GitHub's profile
   settings.
8. **The inventory machinery stays the source of truth.** `tools/refresh_projects.py`
   gains the six repositories, `tools/project-descriptions.json` gains their canonical
   descriptions, `tools/verified-tests.json` gains the six measurements, and
   `site/assets/projects.json` is regenerated by the script - never hand-edited.

## 4. Change list

### 4.1 `portfolio`

| File | Change |
| --- | --- |
| `site/support.html` | New. The live ladder, the $250 goal, a current-sponsors panel, and a link to the other payment rails. Reuses the existing header, footer and CSS. |
| `site/index.html` | 36 projects and 2,455 tests everywhere; per-flagship counts updated to the measured values (116 / 82 / 46 / 46 / 36); "gravion-hunter 26 tests" confirmed; "+25 more tools". |
| `README.md` | Tier ladder; 36 projects; 2,455 tests across 34 projects; 36 of 36 MIT; 35 of 36 with CI; repository layout gains `site/support.html`. |
| `resume.md` | Tier ladder (13), project and test counts, and the support page link now resolves. |
| `docs/sponsors-setup.md` | Live ladder verbatim, live bio and introduction, live featured list, the TRISHUL CI correction, signup step 11 corrected to thirteen tiers. |
| `docs/launch-checklist.md` | "all nine tiers" to thirteen and ticked; the three false ticks corrected; the remaining sponsor-slot work recorded accurately. |
| `tools/verified-tests.json` | Six measured entries added; measurement date updated. |
| `tools/project-descriptions.json` | Six canonical descriptions added (no ampersand - the site stays free of `&`). |
| `tools/refresh_projects.py` | `CATEGORY` gains the six; `FEATURED` becomes the live featured six. |
| `site/assets/projects.json` | Regenerated by the script. |

### 4.2 `gravion-ux` (profile repository)

| File | Change |
| --- | --- |
| `README.md` | A `## Supporters` section backing the $5 Supporter and $25 One-time Backer promise; counts updated to 36 / 2,455; the sponsor link added. |
| `builder-pass-v2.png` | Regenerated with 36 / 2,455. |

### 4.3 The six live featured repositories

Each gets a `## Sponsors` section in the house style and `.github/FUNDING.yml` with
`github: [gravion-ux]`. `gravion-ai` gets wording that does not imply its production
deployments are covered by the MIT licence.

## 5. Verification

1. `https://gravion-ux.github.io/portfolio/support.html` returns 200 after the Pages
   workflow deploys, and the page shows all 13 tiers.
2. A repository-wide grep finds no occurrence of "nine tiers", "five monthly", "four
   one-time", "2,300+", "35 open-source" or "30 published projects".
3. Every published number appears in `tools/verified-tests.json` or is derived from it by
   a stated rule; `python tools/refresh_projects.py --check` reports up to date.
4. The live sponsors profile shows the same ladder as the repository text and the same
   counts as the inventory.
5. The regenerated banner is checked by vision and by a pixel diff confined to the two
   number groups.

## 6. Out of scope

- The published tier rewards are not rewritten. They are the promise this change backs.
- `agent-skills` and `Her--Him` stay out of the project inventory; they are not security
  projects and are not promoted anywhere.
- No tier is created, retired or re-priced.
