# Security Policy

## Supported Versions

The project is currently in its initial public release. Security fixes will target the latest `main` branch until tagged releases are established.

## Reporting a Vulnerability

Please open a private security advisory on GitHub.

Helpful reports include:

- A clear description of the issue
- Steps to reproduce
- Expected and actual behavior
- Impact on generated reports or maintainer workflows
- Suggested mitigation, if known

## Scope

Security-sensitive areas include:

- File traversal and repository scanning behavior
- Markdown report generation
- Pattern matching that could mislead maintainers
- Future CI or API integrations

This tool is a review assistant. It does not replace manual review or a professional smart contract audit.
