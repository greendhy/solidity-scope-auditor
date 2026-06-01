import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import assert from "node:assert/strict";
import { auditRepository, renderMarkdown } from "../src/auditor.js";

test("summarizes Solidity files and review signals", () => {
  const root = mkdtempSync(join(tmpdir(), "scope-auditor-"));
  mkdirSync(join(root, "src"));
  writeFileSync(join(root, "package.json"), JSON.stringify({ name: "demo" }));
  writeFileSync(join(root, "foundry.toml"), "[profile.default]\n");
  writeFileSync(join(root, "src", "Vault.sol"), `
pragma solidity ^0.8.20;
import "./IERC20.sol";
contract Vault is Ownable {
  function rescue(address token, address to) external onlyOwner {
    IERC20(token).transfer(to, 1);
  }
}
interface IERC20 { function transfer(address to, uint256 amount) external returns (bool); }
`);

  const report = auditRepository(root);
  assert.equal(report.name, "demo");
  assert.equal(report.totals.solidityFiles, 1);
  assert.equal(report.totals.contracts, 1);
  assert.equal(report.totals.interfaces, 1);
  assert.match(renderMarkdown(report), /Access control/);
  assert.match(renderMarkdown(report), /Emergency controls/);
});

