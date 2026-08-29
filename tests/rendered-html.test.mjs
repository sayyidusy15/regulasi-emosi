import assert from "node:assert/strict";
import test from "node:test";

async function render(path="/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, {headers:{accept:"text/html"}}), {ASSETS:{fetch:async()=>new Response("Not found",{status:404})}}, {waitUntil(){},passThroughOnException(){}});
}

test("renders the Emora landing page", async()=>{const response=await render();const html=await response.text();assert.equal(response.status,200);assert.match(html,/Kenali Cara Kamu/);assert.match(html,/Emora/);assert.doesNotMatch(html,/codex-preview/)});
test("renders representative user and admin routes", async()=>{for(const path of ["/app","/app/pengukuran","/admin","/admin/export"]){const response=await render(path);assert.equal(response.status,200)}});
