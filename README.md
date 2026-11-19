# Portfolio — Priyanshu Kumar Thakur

🔐 Security engineer | Application security | Security automation

**Live site:** https://gravion-ux.github.io/portfolio

🔗 [LinkedIn](https://www.linkedin.com/in/priyanshukumarthakur) ·
🔗 [Fiverr](https://www.fiverr.com/ig_priyanshu) ·
🔗 [GitHub](https://github.com/gravion-ux) ·
🔗 [Sponsor](https://github.com/sponsors/gravion-ux)

---

## About

I am a security engineer focused on web and API security, vulnerability assessment,
and authorized penetration testing. My day-to-day work centers on **OWASP Top 10**
and **OWASP API Top 10**: finding authorization flaws (BOLA and IDOR),
authentication and session-handling weaknesses, injection, and unsafe business logic,
then writing reports that engineers can act on.

Alongside that, I build and maintain **open-source security tooling** — 30 published
projects, every one of them MIT licensed — covering vulnerability triage, detection-rule
conformance, engagement evidence, and auditing for the AI systems that ship beside
modern applications. I contribute bug fixes upstream to the projects I use.

---

## The numbers, and where they come from

| Claim | Value | Source |
| --- | --- | --- |
| Authored open-source projects | 30 | The 33 public repositories minus this profile repository, this website repository, and a fork of another maintainer's project |
| Test cases across 28 projects | 2,103 collected, 2,097 passing, 6 skipped, 0 failing | Each repository's own suite, run on a fresh clone on 2026-11-11 |
| The three flagship tools | 129 + 187 + 115 = 431 tests | `fixqueue`, `rulebench`, `opsledger` |
| MIT licensed | 30 of 30 | Every `LICENSE` file fetched and compared against the canonical MIT text |
| Repositories with a CI workflow | 23 of 30 | The `.github/workflows` directory of each repository |
| Node tools with zero runtime dependencies | 15 of 16 | `package.json` of each repository |
| Python tools with zero runtime dependencies | 9 of 12 | `pyproject.toml` and `requirements.txt` of each repository |

Nothing on this site is estimated. The inventory is regenerated from the live GitHub
API by `tools/refresh_projects.py`, and the test counts come from
`tools/verified-tests.json`, which records the exact command used for each count.

---

## Projects

### Red-team and detection engineering

| Project | What it does | Tests |
| --- | --- | --- |
| [fixqueue](https://github.com/gravion-ux/fixqueue) | Merge SARIF, Trivy, Grype and OSV scanner output into one deduplicated, EPSS and KEV prioritized fix queue. | 129 |
| [rulebench](https://github.com/gravion-ux/rulebench) | Sigma rule conformance harness: run rules against events, lint them, and measure coverage against the MITRE knowledge base. | 187 |
| [opsledger](https://github.com/gravion-ux/opsledger) | Tamper-evident evidence ledger for red-team engagements: hash-chained events and a signed manifest. | 115 |
| [iamosiac](https://github.com/gravion-ux/iamosiac) | Offline cloud-IAM policy review and permission-relationship visualization data, with least-privilege remediation hints. | 39 |
| [violet-trace](https://github.com/gravion-ux/violet-trace) | A safe purple-team validation harness for defensive telemetry and detection-rule tests. | 34 |
| [accessweave](https://github.com/gravion-ux/accessweave) | Offline identity-relationship and directory-permission review from explicitly exported inventory data. | 33 |
| [fuzzharbor](https://github.com/gravion-ux/fuzzharbor) | A reproducible local fuzzing campaign manager and crash triage toolkit. | 21 |
| [secret-sniper](https://github.com/gravion-ux/secret-sniper) | Leaked credential detection with live verification. | 69 |
| [quanta-sentry](https://github.com/gravion-ux/quanta-sentry) | Cryptographic inventory and post-quantum migration-readiness reporting from source and configuration evidence. | 26 |
| [cipherbench](https://github.com/gravion-ux/cipherbench) | A benchmark and interoperability test harness specification for vetted post-quantum cryptographic providers. | 29 |

### AI and agent security

| Project | What it does | Tests |
| --- | --- | --- |
| [preference-data-doctor](https://github.com/gravion-ux/preference-data-doctor) | Diagnoses and repairs preference datasets: duplicates, contradictions, class imbalance, format drift, leaked secrets. | 147 |
| [skill-supply-chain-auditor](https://github.com/gravion-ux/skill-supply-chain-auditor) | Audits agent skill packages for prompt injection, unsafe shell, obfuscated payloads, embedded secrets, unpinned dependencies. | 125 |
| [gravion-harness](https://github.com/gravion-ux/gravion-harness) | A scoped, auditable security-testing harness with a hash-chained audit log. | 127 |
| [memorytrust](https://github.com/gravion-ux/memorytrust) | Audits an agent memory store for unverified, stale, contradictory and sensitive content and scores how much can be trusted. | 112 |
| [local-slm-eval-kit](https://github.com/gravion-ux/local-slm-eval-kit) | Evaluates a local model against a fixed task suite with redaction, timeouts and diffable reports. | 108 |
| [llm-security-bot](https://github.com/gravion-ux/llm-security-bot) | Pattern-based static analysis for code, configs, log lines and LLM input — deterministic, so the output is a triage list, not proof of exploitability. | 20 |
| [context-bridge](https://github.com/gravion-ux/context-bridge) | A VS Code extension that writes privacy-conscious Markdown handoffs, with secret redaction built in. | 66 |
| [gravion-trainner](https://github.com/gravion-ux/gravion-trainner) | Model quality evaluation starter for OpenAI-compatible chat-completions endpoints. | 27 |

### Assessment, automation and platform

| Project | What it does | Tests |
| --- | --- | --- |
| [TRISHUL](https://github.com/gravion-ux/TRISHUL) | Authorized-scope, AI-powered security testing platform with real tool integration behind scope gates and an AI policy boundary. | 118 |
| [webapp-security-toolkit](https://github.com/gravion-ux/webapp-security-toolkit) | Authorized-only web and API security assessment toolkit: header analysis, TLS posture, scope enforcement, structured findings. | 44 |
| [web-security-labs](https://github.com/gravion-ux/web-security-labs) | Four OWASP-style labs (IDOR, XSS, broken-auth, logic-flaw), each with a vulnerable and a secure variant, loopback-only by design. | 22 checks across 4 labs |
| [api-security-testing](https://github.com/gravion-ux/api-security-testing) | Read-only BOLA and cross-tenant detector with a rate-limit probe, backed by a local mock API for reproducible demos. | 18 |
| [security-automation-scripts](https://github.com/gravion-ux/security-automation-scripts) | Small Node.js and Bash utilities: header analysis, TLS configuration check, log parsing helpers. | 22 |
| [agent-browser](https://github.com/gravion-ux/agent-browser) | Visible Playwright browser starter with an explicit domain allow-list and explicit stop conditions. | 43 |
| [privacyflow](https://github.com/gravion-ux/privacyflow) | Validates authorized WireGuard profiles and plans safe VPN rotation workflows. | 38 |
| [localshare](https://github.com/gravion-ux/localshare) | Shares a local development server through Cloudflare tunnels, with loopback-only origins. | 40 |
| [rasgulla-ai](https://github.com/gravion-ux/rasgulla-ai) | A local-first AI-assisted security research workbench for code understanding and safe test generation. | 50 |
| [aegis](https://github.com/gravion-ux/aegis) | Multi-agent system core: task lifecycle, persistent memory, provider abstraction, default-deny tool registry, budgets and recovery. | 294 |

### Upstream contribution and other

| Project | What it does |
| --- | --- |
| [xerj-ipv6-rate-limit-fix](https://github.com/gravion-ux/xerj-ipv6-rate-limit-fix) | A contribution to [xerj-org/xerj](https://github.com/xerj-org/xerj) fixing the Corpus Hub rate limiter to bucket compressed IPv6 addresses by their /64. Open upstream as [xerj-org/xerj#2872](https://github.com/xerj-org/xerj/pull/2872). |
| [catalog-forge](https://github.com/gravion-ux/catalog-forge) | Crawls a shop catalog and serves it as a storefront. |

---

## Services

Starting prices are published so you know the floor before you enquire. Scope is
confirmed in writing before any testing begins.

### 1. Web and API Security Assessment — from $500

An agreed list of targets. OWASP Top 10 and OWASP API Top 10 coverage with emphasis
on authorization and cross-tenant flaws, broken authentication and session handling,
injection, and rate limiting. Five business days. Deliverable is a findings report
with impact, reproduction steps and remediation guidance per finding, plus a retest of
critical findings. No testing outside the agreed scope.

### 2. Secure Code Review and Threat Modelling — from $300

Up to two pull requests or one service. Focus on access control, session handling,
input validation and injection paths, with a short threat model of the changed
surface. Three business days. Deliverable is inline findings with severity and
concrete fix suggestions, plus a written threat-model summary.

### 3. Security Automation Build — from $800

One small CI-friendly tool for your stack: scanner triage, a dependency gate, log
normalization, or detection-rule linting. Built as a repository with a test suite, a
CI pipeline and documentation, delivered with a working demo. Two to three weeks.

**Also quoted on scope:** detection-rule review and coverage analysis, cloud IAM and
permission review, and post-quantum migration-readiness inventory.

📬 [Enquire on Fiverr](https://www.fiverr.com/ig_priyanshu) or
[LinkedIn](https://www.linkedin.com/in/priyanshukumarthakur).

---

## Support the open-source work

Sponsorship pays for the parts nobody sees: issue triage, CI maintenance, dependency
review of my own tools, and the next release. Nine tiers are published on GitHub
Sponsors — five monthly from $5, and four one-time.

🔗 [Sponsor on GitHub](https://github.com/sponsors/gravion-ux)

The tools stay free, MIT licensed, and free of telemetry whether or not anyone
sponsors them. All 30 published projects carry the MIT licence.

---

## How I work

1. Read the code path first, before running tools.
2. Reproduce the bug with the smallest possible proof.
3. Quantify the impact in the business terms the engineer cares about.
4. Write the fix as a code suggestion, not just an observation.
5. Measure before and after, and quote only the numbers a command produced.

---

## Repository layout

| Path | What it is |
| --- | --- |
| `site/` | The static website served by GitHub Pages |
| `site/assets/projects.json` | Generated project inventory, built from the live GitHub API |
| `tools/refresh_projects.py` | Regenerates the inventory. Run it whenever stars or descriptions change. |
| `tools/verified-tests.json` | Measured test counts, with the command used for each one |
| `docs/sponsors-setup.md` | The GitHub Sponsors content pack: bio, introduction, tiers and signup steps |
| `docs/launch-checklist.md` | The distribution checklist for launching the profile |
| `resume.md` | The short resume version |

## Licence

MIT. See [LICENSE](LICENSE).
