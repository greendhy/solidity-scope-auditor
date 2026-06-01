import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";

const SKIP_DIRS = new Set([".git", "node_modules", "cache", "out", "artifacts", "broadcast"]);

const PATTERNS = [
  { name: "Upgradeability", re: /\b(upgradeTo|initializer|UUPSUpgradeable|TransparentUpgradeableProxy)\b/g },
  { name: "Access control", re: /\b(onlyOwner|AccessControl|Ownable|DEFAULT_ADMIN_ROLE)\b/g },
  { name: "External calls", re: /\.(call|delegatecall|staticcall)\s*\(/g },
  { name: "Token transfers", re: /\b(transfer|transferFrom|safeTransfer|safeTransferFrom)\s*\(/g },
  { name: "Oracle usage", re: /\b(AggregatorV3Interface|latestRoundData|Chainlink|oracle)\b/gi },
  { name: "Flash loans", re: /\b(flashLoan|flashBorrow|onFlashLoan|flash)\b/gi },
  { name: "Liquidation", re: /\b(liquidat|auction|seize)\w*/gi },
  { name: "Emergency controls", re: /\b(pause|paused|Pausable|emergency|rescue)\w*/gi }
];

export function auditRepository(root) {
  if (!existsSync(root)) {
    throw new Error(`path does not exist: ${root}`);
  }

  const files = walk(root).filter((file) => file.endsWith(".sol"));
  const contracts = files.map((file) => analyzeSolidityFile(root, file));
  const packageJson = readOptionalJson(join(root, "package.json"));
  const foundryToml = existsSync(join(root, "foundry.toml"));
  const hardhatConfig = ["hardhat.config.js", "hardhat.config.ts"].some((name) => existsSync(join(root, name)));

  return {
    root,
    name: packageJson?.name || basename(root),
    generatedAt: new Date().toISOString(),
    toolchain: {
      foundry: foundryToml,
      hardhat: hardhatConfig,
      npmPackage: Boolean(packageJson)
    },
    totals: {
      solidityFiles: contracts.length,
      contracts: sum(contracts, "contracts"),
      interfaces: sum(contracts, "interfaces"),
      libraries: sum(contracts, "libraries")
    },
    contracts
  };
}

function analyzeSolidityFile(root, file) {
  const source = readFileSync(file, "utf8");
  const hits = PATTERNS.map((pattern) => ({
    name: pattern.name,
    count: [...source.matchAll(pattern.re)].length
  })).filter((hit) => hit.count > 0);

  return {
    path: relative(root, file).replaceAll("\\", "/"),
    contracts: count(source, /\bcontract\s+\w+/g),
    interfaces: count(source, /\binterface\s+\w+/g),
    libraries: count(source, /\blibrary\s+\w+/g),
    imports: count(source, /^\s*import\s+/gm),
    lines: source.split(/\r?\n/).length,
    hits
  };
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      return SKIP_DIRS.has(name) ? [] : walk(path);
    }
    return stat.isFile() ? [path] : [];
  });
}

function count(source, re) {
  return [...source.matchAll(re)].length;
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + row[key], 0);
}

function readOptionalJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

export function renderMarkdown(report) {
  const rows = report.contracts
    .map((file) => {
      const signals = file.hits.map((hit) => `${hit.name} (${hit.count})`).join(", ") || "None";
      return `| ${file.path} | ${file.contracts} | ${file.interfaces} | ${file.libraries} | ${file.imports} | ${file.lines} | ${signals} |`;
    })
    .join("\n");

  return `# Solidity Scope Auditor Report

Repository: ${report.name}
Generated: ${report.generatedAt}

## Summary

| Metric | Count |
| --- | ---: |
| Solidity files | ${report.totals.solidityFiles} |
| Contracts | ${report.totals.contracts} |
| Interfaces | ${report.totals.interfaces} |
| Libraries | ${report.totals.libraries} |

## Toolchain

| Tool | Detected |
| --- | --- |
| Foundry | ${yesNo(report.toolchain.foundry)} |
| Hardhat | ${yesNo(report.toolchain.hardhat)} |
| npm package | ${yesNo(report.toolchain.npmPackage)} |

## Files

| File | Contracts | Interfaces | Libraries | Imports | Lines | Review signals |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
${rows || "| No Solidity files found | 0 | 0 | 0 | 0 | 0 | None |"}
`;
}

function yesNo(value) {
  return value ? "Yes" : "No";
}

