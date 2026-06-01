# Solidity Scope Auditor

Solidity Scope Auditor is a small dependency-free CLI for open source maintainers and security reviewers. It scans a Solidity repository and generates a Markdown summary of contracts, interfaces, libraries, imports, toolchain signals, and review hotspots such as access control, external calls, upgradeability, or emergency controls.

The goal is to make routine open source maintenance easier: reviewers can quickly understand what is in scope, what needs attention, and which files deserve deeper manual review before releases or bug bounty rounds.

## Install

```bash
git clone https://github.com/greendhy/solidity-scope-auditor.git
cd solidity-scope-auditor
npm test
```

## Usage

```bash
node ./bin/solidity-scope-auditor.js /path/to/solidity-repo --out scope-report.md
```

Without `--out`, the report is printed to stdout.

## What It Detects

- Solidity files, contracts, interfaces, libraries, imports, and line counts
- Foundry, Hardhat, and npm project signals
- Review signals for upgradeability, access control, low-level calls, token transfers, oracle usage, flash loans, liquidation logic, and emergency controls

## Why This Exists

Open source smart contract maintainers often need to prepare repositories for audits, public review, bug bounty programs, or routine release checks. A fast scope summary helps reduce repetitive manual work and gives contributors a consistent starting point for reviews.

This tool does not replace a professional audit. It is a maintainer workflow helper intended to make review preparation more repeatable.

## Development

```bash
npm test
```

The project intentionally avoids runtime dependencies so it can be used in constrained review environments.

## License

MIT

