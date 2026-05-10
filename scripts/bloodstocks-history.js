#!/usr/bin/env node

const { execFileSync } = require("node:child_process");
const { mkdirSync, writeFileSync } = require("node:fs");
const { dirname, resolve } = require("node:path");

const TYPE_ORDER = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const DEFAULT_REPO = "../red-cross-blood-stocks";
const DEFAULT_OUTPUT = "assets/blood-history.json";

const sourceRepo = resolve(process.env.BLOOD_STOCKS_REPO || DEFAULT_REPO);
const outputPath = resolve(process.env.BLOOD_STOCKS_OUTPUT || DEFAULT_OUTPUT);

function git(args) {
  return execFileSync("git", ["-C", sourceRepo, ...args], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 64,
  });
}

function parseStockFile(raw, commit, commitDate) {
  const date = commitDate.slice(0, 10);
  const rows = JSON.parse(raw);

  if (!Array.isArray(rows)) {
    throw new Error(`blood-stocks.json at ${commit} is not an array`);
  }

  return rows
    .filter((row) => row && TYPE_ORDER.includes(row.bloodType))
    .map((row) => ({
      date,
      bloodType: row.bloodType,
      fillLevel: Number.parseInt(row.fillLevel, 10),
      status: row.status || null,
      sourceCommit: commit,
      sourceDate: commitDate,
    }))
    .filter((row) => Number.isFinite(row.fillLevel));
}

function main() {
  const log = git([
    "log",
    "--reverse",
    "--date=iso-strict",
    "--pretty=format:%H%x09%cI",
    "--",
    "blood-stocks.json",
  ]).trim();

  const byDateAndType = new Map();

  if (log.length > 0) {
    for (const line of log.split("\n")) {
      const [commit, commitDate] = line.split("\t");
      if (!commit || !commitDate) continue;

      let raw;
      try {
        raw = git(["show", `${commit}:blood-stocks.json`]);
      } catch (error) {
        console.warn(`Skipping ${commit}: ${error.message}`);
        continue;
      }

      let parsedRows;
      try {
        parsedRows = parseStockFile(raw, commit, commitDate);
      } catch (error) {
        console.warn(`Skipping ${commit}: ${error.message}`);
        continue;
      }

      for (const row of parsedRows) {
        byDateAndType.set(`${row.date}:${row.bloodType}`, row);
      }
    }
  }

  const records = [...byDateAndType.values()].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return TYPE_ORDER.indexOf(a.bloodType) - TYPE_ORDER.indexOf(b.bloodType);
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    sourceRepo: "frizensami/red-cross-blood-stocks",
    sourceFile: "blood-stocks.json",
    records,
  };

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(payload)}\n`);
  console.error(`Wrote ${records.length} records to ${outputPath}`);
}

main();
