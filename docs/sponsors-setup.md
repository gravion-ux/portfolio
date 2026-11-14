# GitHub Sponsors setup — content pack

Everything needed to publish the GitHub Sponsors profile, copied here so it can be
pasted in one sitting. Every number below was measured on 2026-11-11 by running the
relevant test suite on a fresh clone.

**Before starting:** two-factor authentication must be enabled on the GitHub account.
Sponsorship cannot be set up without it.

---

## 1. Short bio

143 characters. GitHub's limit is 160.

```
Security engineer building open-source tools for AppSec, detection engineering and engagement evidence. Funding keeps them free and maintained.
```

---

## 2. Introduction

```
I build small, dependency-light security tools that teams run in their own pipeline — vulnerability triage with EPSS and KEV prioritization, Sigma rule conformance testing, and tamper-evident engagement evidence ledgers.

The six tools featured below are MIT licensed, carry a working CI pipeline, and ship with real test suites — 129, 187 and 115 tests for the three flagship tools alone, measured by running them. Sponsorship pays for the time that goes into the parts nobody sees: triage, CI maintenance, issue response, security review of my own dependencies, and the next release.

Sponsorship is what keeps these tools free to use, with no telemetry, no account and no upsell.
```

---

## 3. Featured repositories — six

GitHub allows up to six. Each one below is MIT licensed, has a CI workflow, and has a
measured test count.

| Repository | Stars | Test cases | How the count was obtained |
| --- | --- | --- | --- |
| `fixqueue` | 1 | 129 | `npm test` on a fresh clone |
| `rulebench` | 1 | 187 | `pytest` on a fresh clone |
| `opsledger` | 1 | 115 | `npm test` on a fresh clone |
| `iamosiac` | 11 | 39 | `pytest` on a fresh clone |
| `violet-trace` | 1 | 34 | `pytest` on a fresh clone |
| `accessweave` | 1 | 33 | `pytest` on a fresh clone |

Star counts move. The live values are in `site/assets/projects.json`, which
`tools/refresh_projects.py` regenerates from the GitHub API.

**`TRISHUL` is deliberately not featured.** It is MIT licensed and has 118 tests, but
it has no CI workflow, so it does not meet the rule that every featured repository is
MIT licensed, CI-backed and tested.

---

## 4. Monthly tiers — five

| Tier | Price | What it includes |
| --- | --- | --- |
| Supporter | $5 / month | Name on the supporters list, monthly build-notes email |
| Sponsor | $25 / month | Everything above, priority issue triage, name in all three flagship READMEs |
| Partner | $100 / month | Everything above, private monthly office hours, roadmap input, early release access |
| Anchor | $500 / month | Everything above, named as anchor sponsor site-wide, quarterly one-to-one, one funded roadmap item per quarter |
| Executive | $1,000 / month | Everything above, quarterly review of your use case, two funded roadmap items per year, first response on blocking issues |

The ladder stops at $1,000 per month on purpose. A solo developer cannot honestly
honour a $2,500 service-level tier. Above that, it is a conversation, not a published
tier.

---

## 5. One-time tiers — four

| Tier | Price | What it funds |
| --- | --- | --- |
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
11. Create the nine tiers from sections 4 and 5, and paste the welcome message from
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
