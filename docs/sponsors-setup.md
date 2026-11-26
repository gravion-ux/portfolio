# GitHub Sponsors setup — content pack

Everything needed to publish the GitHub Sponsors profile, copied here so it can be
pasted in one sitting. Every test count below was measured between 2026-11-22 and 2026-11-26 by running
the relevant suite on a fresh clone. The star counts and tier prices are the live
values published on GitHub Sponsors, read on 2026-11-23.

**Before starting:** two-factor authentication must be enabled on the GitHub account.
Sponsorship cannot be set up without it.

---

## 1. Short bio

143 characters. GitHub's limit is 160. This is the text published on the live profile.

```
Security engineer building open-source tools for AppSec, detection engineering and engagement evidence. Funding keeps them free and maintained.
```

---

## 2. Introduction

```
I build open-source security tools — LLM red-teaming, MCP security, JWT auditing, WordPress CVE hunting and more. Sponsorship keeps these tools free, maintained and tested, and funds new research.

Security researcher and open-source builder from Delhi, India. I build free security tools the community can actually use — 59 open-source projects and counting, 4,246 automated tests, 57 of them MIT licensed, 57 CI-gated. My flagships: wp-cve-hunter — WordPress CVE detection; llm-redteam-kit — OWASP-mapped LLM red-teaming cases; mcp-shield — MCP configuration security auditor; jwt-auditor — JWT attack-surface checks; gravion-ai — modular AI platform, built in public, piece by piece; aegis — multi-agent AI system core.

Alongside the tools, I hunt on Patchstack, HackerOne and Bugcrowd (IDOR/BOLA, broken auth, business logic) and publish methodology writeups so other researchers can reuse the workflow. Sponsorship keeps the tools free and maintained: it funds development time, test infrastructure, and the lab I use to verify vulnerabilities safely before reporting them. Every sponsor is credited — your support is literally what keeps new tools shipping.
```

---

## 3. Featured repositories — five

GitHub allows up to six. Five are published live. Each one below is MIT licensed, has a CI
workflow, and has a measured test count.

| Repository | Stars | Test cases | How the count was obtained |
| --- | --- | --- | --- |
| `wp-cve-hunter` | 4 | 82 | `pytest` on a fresh clone: 82 passed, 0 skipped |
| `llm-redteam-kit` | 4 | 46 | `pytest` on a fresh clone: 46 passed, 0 skipped |
| `mcp-shield` | 4 | 58 | `pytest` on a fresh clone: 58 passed, 0 skipped |
| `jwt-auditor` | 4 | 38 | `pytest` on a fresh clone: 38 passed, 0 skipped |
| `gravion-ai` | 4 | 385 | `pytest` on a fresh clone: 380 passed, 5 skipped, 0 failed, 385 collected |

Star counts move. The live values are in `site/assets/projects.json`, which
`tools/refresh_projects.py` regenerates from the GitHub API.

**The sixth featured slot is free.** `TRISHUL` (MIT licensed, CI-backed, 335 measured
tests) and `iamosiac` (MIT licensed, CI-backed, 61 measured tests) qualify on the same
terms as the five above, so either can take it.

---

## 4. Monthly tiers — eight

| Tier | Price | What it includes |
| --- | --- | --- |
| Supporter | $5 / month | Your name in the Supporters section of my profile README, and my thanks in release notes |
| Backer | $10 / month | Everything in Supporter, plus early access to new tools before public release announcements |
| Advocate | $15 / month | Everything in Backer, plus your name in the Supporters section of my profile README, and a monthly progress update on what your sponsorship funded |
| Sponsor | $25 / month | Everything in Backer, plus your name or logo in the flagship repos' README sponsor sections |
| Pro Sponsor | $50 / month | Everything in Sponsor, plus priority on your feature requests and issue reports across my repos |
| Security Partner | $100 / month | Everything in Pro Sponsor, plus first look at new flagship tools and a monthly community Q&A post answering sponsor questions |
| Anchor | $500 / month | Everything in Security Partner, named as anchor sponsor across the site, a quarterly one-to-one call, and one funded roadmap item per quarter |
| Executive | $1,000 / month | Everything in Anchor, a quarterly review of your use case, two funded roadmap items per year, and first response on blocking issues |

The monthly ladder stops at $1,000 on purpose. A solo developer cannot honestly
honour a $2,500 monthly service-level tier. Above that, it is a conversation, not a
published tier.

---

## 5. One-time tiers — six

| Tier | Price | What it funds |
| --- | --- | --- |
| One-time Backer | $25 | Name in the Supporters section of my profile README |
| One-time Sponsor | $50 | Name or logo in one flagship repo's README sponsor section |
| Fix a bug | $50 | One confirmed defect fixed and credited in the release notes |
| Fund a feature | $250 | One scoped feature shipped in a tagged release |
| Fund a release | $1,000 | A full release cycle for one flagship tool |
| Fund a roadmap quarter | $2,500 | One quarter of work on one flagship tool, agreed in advance |

---

## 6. Custom amount

- Recommended: **$25**
- Minimum: **$5**

---

## 7. Welcome message

The same text for every tier. GitHub shows it after payment and in the welcome
email.

```
Thanks for sponsoring. Sponsorship pays for maintenance, triage and the next release of the tools listed on this page. If you sponsor a monthly tier at $5 or above, your name appears in the supporters list. If you want a roadmap item funded, a bug fixed, or a question answered, reply to the sponsorship email and it reaches me directly. No questions asked about the amount — cancel any time from your GitHub Sponsors dashboard.
```

---

## 8. Signup steps

1. Enable two-factor authentication on the GitHub account.
2. Open `https://github.com/sponsors` and click **Get sponsored**.
3. Choose the personal account `gravion-ux`.
4. Enter contact information.
5. **Choose the payout method.** This choice is part of the signup.
   - **Direct bank account.** The region of the bank account must match the region of
     residence, so an Indian resident needs an Indian bank account. This is the
     simpler route for an individual.
   - **Fiscal host.** Handles international payouts and tax paperwork, but takes a
     cut. The seven supported hosts are: Hack Club, NumFOCUS, Open Collective Europe,
     Open Source Collective, Python Software Foundation, Radiant Earth, and Software
     in the Public Interest.
   - Fiscal-host information can only be *set up* at signup. Switching to a fiscal
     host afterwards is possible, but it requires a request through the GitHub
     Support portal.
6. Review the GitHub Sponsors Additional Terms and Privacy Statement, then submit.
7. Wait for GitHub to review the application.
8. Under **Profile details**, paste the short bio and the introduction from sections
   1 and 2.
9. Under **Featured work**, select the six repositories from section 3.
10. Optionally tick **Opt-in to get featured on github.com/sponsors**.
11. Create the fourteen tiers from sections 4 and 5, and paste the welcome message from
    section 7 into each one. **Prices cannot be changed after publishing.**
12. Submit bank details and tax information. The tax step is the W-8BEN form, and a
    Permanent Account Number is the correct foreign tax identification number for
    India.

---

## 9. Constraints worth remembering

- **A published tier price can never be edited.** The tier must be retired and
  recreated, and existing sponsors stay on the retired tier until they change it.
- **No tier grants access to a private repository.** GitHub allows that only for
  private repositories owned by an organisation, and this is a personal account.
  Every reward above is attribution, access to time, or funded work.
- **GitHub charges no fee on sponsorship from personal accounts**, so 100% of the
  amount reaches the account. Organization sponsorships carry up to 6%.
- **Maximum tier price is US$12,000 per month.** Not relevant at these price points,
  but worth knowing.
