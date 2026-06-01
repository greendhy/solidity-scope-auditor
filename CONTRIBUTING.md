# Contributing

Thanks for helping improve Solidity Scope Auditor.

## Development

```bash
npm test
```

The project intentionally avoids runtime dependencies. Please keep new features small, reviewable, and useful for maintainers preparing Solidity repositories for audits, releases, or public security review.

## Good First Contributions

- Add detector patterns with tests
- Improve Markdown report wording
- Add example repositories and expected reports
- Improve CI documentation
- Add edge cases for Solidity syntax patterns

## Pull Request Checklist

- Include tests for new detector behavior
- Keep generated reports readable in plain Markdown
- Avoid sending source code or repository contents to external services
- Update documentation when behavior changes

## Maintainer Workflow

The maintainer reviews issues, detector proposals, tests, and release notes. The goal is to keep the tool practical for open source Solidity and DeFi maintainers.

