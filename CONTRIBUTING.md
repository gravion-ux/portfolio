# Contributing to portfolio

Thanks for your interest in contributing to portfolio — full-stack team task manager (MERN): JWT auth, real-time collaboration (Socket.IO), and file attachments. This guide helps you get started quickly and keep contributions consistent.

## Quick start

1. **Fork** the repository and clone your fork:
   ```bash
   git clone https://github.com/<your-username>/portfolio.git
   cd portfolio
   ```
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```
3. Run the app:
   ```bash
   npm run dev
   ```
4. Make your changes on a feature branch:
   ```bash
   git checkout -b feat/your-change
   ```

## How to contribute

- **Report bugs**: open an issue with steps to reproduce, expected vs. actual behavior, and environment details.
- **Suggest features**: open an issue describing the problem, proposed solution, and alternatives considered.
- **Fix bugs / add features**: comment on the issue first if you plan to work on it, then open a pull request referencing it.
- **Improve docs**: typos, clarifications, and examples are welcome.

## Pull request guidelines

- Keep PRs focused and small; one logical change per PR.
- Write a clear title and description: what changed, why, and how to test it.
- Link related issues (e.g. `Fixes #123`).
- Update docs and tests when behavior changes.
- Ensure `npm test` passes and lint is clean before submitting.
- Do not commit secrets, credentials, or `.env` files.

## Code style

- Follow the existing style in the codebase (Prettier/ESLint configs where present).
- Use meaningful names and keep functions small and focused.
- Add comments only where the intent is not obvious.

## Testing

- Add or update tests for bug fixes and new features where applicable.
- Run `npm test` before opening a PR.

## Code of conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md). Be respectful and constructive.

## Security

If you find a security vulnerability, please follow our [Security Policy](SECURITY.md) and do not open a public issue.

---

Thank you for helping improve portfolio!
