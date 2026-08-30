import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

function loadFrontendScoring() {
  const source = readFileSync(new URL("../lib/scoring.ts", import.meta.url), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const commonJs = { exports: {} };
  new Function("exports", "module", output)(commonJs.exports, commonJs);
  return commonJs.exports;
}

function loadAppsScriptScoring() {
  const source = `${readFileSync(new URL("../apps-script/Code.gs", import.meta.url), "utf8")}\n` +
    "globalThis.__calculateResult = calculateResult_; globalThis.__strategies = STRATEGIES;";
  const context = { console, Date, Set, Array, Object, String, Number, Math };
  vm.createContext(context);
  vm.runInContext(source, context);
  return context;
}

const frontend = loadFrontendScoring();
const backend = loadAppsScriptScoring();
const allAnswers = value => Object.fromEntries(Array.from({ length: 30 }, (_, index) => [index + 1, value]));
const appsAnswers = answers => Object.fromEntries(Object.entries(answers).map(([key, value]) => [`Q${String(key).padStart(2, "0")}`, value]));

test("each ERQ-30 item belongs to exactly one three-item subscale", () => {
  const items = frontend.erq30Subscales.flatMap(scale => scale.items);
  assert.equal(items.length, 30);
  assert.equal(new Set(items).size, 30);
  assert.deepEqual([...items].sort((a, b) => a - b), Array.from({ length: 30 }, (_, index) => index + 1));
});

test("minimum and maximum responses produce 3 and 21 on every subscale", () => {
  assert.ok(frontend.scoreErq30(allAnswers(1)).every(result => result.score === 3 && result.category === "low"));
  assert.ok(frontend.scoreErq30(allAnswers(7)).every(result => result.score === 21 && result.category === "high"));
});

test("frontend and Apps Script use the same mappings, scores, and categories", () => {
  const answers = Object.fromEntries(Array.from({ length: 30 }, (_, index) => [index + 1, (index % 7) + 1]));
  const uiResults = frontend.scoreErq30(answers);
  const scriptResult = backend.__calculateResult("ASM-TEST", "USR-TEST", appsAnswers(answers));
  for (const result of uiResults) {
    assert.equal(scriptResult[result.key], result.score, result.key);
    assert.equal(scriptResult[`${result.key}_category`], result.category, `${result.key} category`);
  }
});

test("Behavioral Activation uses only Q04, Q14, and Q23", () => {
  const answers = allAnswers(1);
  answers[4] = 7;
  answers[14] = 6;
  answers[23] = 5;
  const results = frontend.scoreErq30(answers);
  assert.equal(results.find(result => result.key === "behavioral_activation").score, 18);
  assert.ok(results.filter(result => result.key !== "behavioral_activation").every(result => result.score === 3));
});

test("scoring rejects incomplete and out-of-range answers", () => {
  const incomplete = allAnswers(4);
  delete incomplete[30];
  assert.throws(() => frontend.scoreErq30(incomplete), /30 jawaban/);
  const invalid = allAnswers(4);
  invalid[30] = 8;
  assert.throws(() => frontend.scoreErq30(invalid), /1–7/);
});
