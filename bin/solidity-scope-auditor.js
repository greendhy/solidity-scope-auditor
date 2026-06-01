#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { auditRepository, renderMarkdown } from "../src/auditor.js";

const args = process.argv.slice(2);
const target = resolve(args[0] || ".");
const outIndex = args.indexOf("--out");
const outputPath = outIndex >= 0 ? resolve(args[outIndex + 1]) : null;

try {
  const report = auditRepository(target);
  const markdown = renderMarkdown(report);
  if (outputPath) {
    writeFileSync(outputPath, markdown);
  } else {
    process.stdout.write(markdown);
  }
} catch (error) {
  console.error(`solidity-scope-auditor: ${error.message}`);
  process.exitCode = 1;
}

