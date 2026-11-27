# Security Policy

This repository contains Priyanshu Kumar Thakur's portfolio website
and the GitHub Pages deployment workflow for it.

## Reporting a vulnerability

Please do not open a public issue for a security problem. Report it
privately through GitHub private vulnerability reporting:
<https://github.com/gravion-ux/portfolio/security/advisories/new>

Email: priyanshukumarthakur937@gmail.com

Include the affected page or file, the impact you believe it has, and
the smallest reproduction you have. Never include credentials or
private personal data in a report.

## Scope

In scope:

- Cross-site scripting or unsafe content handling in the portfolio
  site's own HTML, CSS, or JavaScript.
- Broken or misleading links that send visitors to an unintended
  destination.
- Accidental exposure of private data in site assets or repository
  files.
- Deployment workflow issues that could publish unintended content.

Out of scope:

- Vulnerabilities in separate projects linked from the portfolio.
  Report those in the relevant project repository.

## Repository hygiene

GitHub secret scanning and push protection are enabled for this
repository. Dependabot checks GitHub Actions dependencies weekly, and
CodeQL runs on pushes, pull requests, and a weekly schedule.
