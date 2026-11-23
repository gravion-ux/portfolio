# Launch checklist

A profile does not attract sponsors by existing. These are the distribution moves
that put it in front of people. Every item is something you do, not something that
happens to you.

---

## Before anything goes public

- [x] Profile README rewritten and pushed.
- [x] Portfolio README, resume and LICENSE pushed.
- [x] The site deployed to `https://gravion-ux.github.io/portfolio` and loading over
      HTTPS.
- [x] GitHub profile metadata updated: bio, website, location, company.
- [x] GitHub Sponsors profile published with all thirteen tiers.
- [ ] The sponsor link checked from a logged-out browser — it should reach the
      published Sponsors page.

---

## 1. Releases — do this first

Releases are what a sponsor sees first, and a repo with no release reads as
unfinished.

- [ ] `fixqueue` — `v0.1.0`
- [ ] `rulebench` — `v0.1.0`
- [ ] `opsledger` — `v0.1.0`

Each release note should say what the tool does in one sentence, what problem it
removes, and what is coming next.

---

## 2. LinkedIn — one post per featured tool

Six posts, not one. One tool per post gets three times the reach of a single
catch-all post, and the algorithm treats them separately.

Each post follows the same shape:

1. The problem, stated concretely.
2. The approach, in two or three sentences.
3. One screenshot of the tool actually running.
4. The repository link.
5. The sponsor link.
6. A closing question that invites a comment.

Do not post all six on the same day. Space them a week or two apart.

---

## 3. Hacker News

- [ ] Submit `fixqueue` to Show HN. It has the broadest appeal of the three: it
      takes a real problem every security team has and makes it boring.

Post it as a Show HN with the repository link in the text. Hacker News punishes
anything that reads as promotion, so lead with the problem and the approach, not
with the ask.

---

## 4. Reddit — targeted, one subreddit at a time

| Project | Subreddits |
| --- | --- |
| `rulebench` | r/DetectionEngineering, r/SysAdmin |
| `opsledger` | r/netsec, r/forensics |
| `fixqueue` | r/netsec |

Rules that matter:

- Read the subreddit rules before posting. Several ban self-promotion outright.
- Write the post as a technical explanation, not an announcement.
- Include what the tool does not do. That is what makes the reply trustworthy.
- Do not post the same text to more than one subreddit on the same day.

---

## 5. Cross-link from existing traction

Two repositories already have stars. Link the new tools from them, so the traffic
lands on pages that already get visited.

- [ ] `iamosiac` (11 stars) — add a "related tools" line to its README.
- [ ] `llm-security-bot` (3 stars) — same.

Do this after the featured repository READMEs have their own sponsor attribution slots, so
the cross-links point at finished pages.

---

## 6. Sponsor attribution slots

The live tiers promise a name in the Supporters section of the profile README and a name or
logo in the README sponsor sections of the flagship repos. Those promises have to exist before
anyone signs up for them.

- [x] `gravion-ux/README.md` — Supporters section.
- [x] `iamosiac/README.md` — sponsor slot.
- [x] `wp-cve-hunter/README.md` — sponsor slot.
- [x] `llm-redteam-kit/README.md` — sponsor slot.
- [x] `mcp-shield/README.md` — sponsor slot.
- [x] `jwt-auditor/README.md` — sponsor slot.
- [x] `gravion-ai/README.md` — sponsor slot.
- [x] `.github/FUNDING.yml` on each of the six featured repositories.

Keep the slot small and at the bottom. It should read as a fact, not a banner.

Also done, for the same reason — the Sponsor button has to be reachable from the
pages people already land on:

- [x] A current-sponsors section on the site support page.
- [x] The published tier ladder on `site/support.html`.

---

## 7. A recurring reason to look

- [ ] Start a short monthly "what I shipped" note.

This is the highest-leverage item on the list, because it gives people a reason to
come back and a reason to subscribe. Ship it as a GitHub release, a repository
`NOTES.md`, or a mailing list — whatever you will actually keep up. Consistency
matters more than format.

---

## 8. Ask for introductions

- [ ] Once the site is live, ask every sponsor of the paid tiers for one
      introduction each.

This is the step most people skip and the one that produces the best results.
Sponsor or client alike, most people are happy to recommend a tool they rely on —
they just never thought to do it.

---

## 9. Keep it honest

Every claim on the profile is scoped to what was measured. When you publish
something new:

- [ ] Re-run the test suite and update the count in `tools/verified-tests.json`.
- [ ] Run `python tools/refresh_projects.py` so stars and descriptions are current.
- [ ] Check that any new "MIT licensed" or "CI" sentence still matches reality.

A sponsor who catches one inflated number assumes the rest are inflated too. That
is the single thing most likely to destroy this profile, and it is entirely
avoidable.
