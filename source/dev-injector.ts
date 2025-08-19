// pnpm add -D puppeteer-core ts-node @types/node
import "reflect-metadata";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";

let scriptIdCode: string | undefined;
let scriptIdBoot: string | undefined;

async function registerOnNewDoc(
  page: any,
  source: string,
  kind: "code" | "boot"
) {
  const client = (page as any)._client();
  const current = kind === "code" ? scriptIdCode : scriptIdBoot;
  if (current) {
    await client.send("Page.removeScriptToEvaluateOnNewDocument", {
      identifier: current,
    });
    if (kind === "code") scriptIdCode = undefined;
    else scriptIdBoot = undefined;
  }
  const { identifier } = await client.send(
    "Page.addScriptToEvaluateOnNewDocument",
    { source }
  );
  if (kind === "code") scriptIdCode = identifier;
  else scriptIdBoot = identifier;
}

function resolveBundlePath() {
  const here = __dirname;
  const isCompiled = path.basename(here) === "dist";
  const root = isCompiled ? path.resolve(here, "..") : here;
  const distDir = path.join(root, "dist");
  const candidates = [
    path.join(distDir, "app.js"),
    path.join(distDir, "index.js"),
    path.join(here, "app.js"),
    path.join(here, "index.js"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return candidates[0];
}

const BUNDLE = resolveBundlePath();
const URL_FILTER = "https://internal.scch.org.au/safety/incidents/new/";

async function run() {
  const browser = await puppeteer.connect({
    browserURL: "http://localhost:9222",
  });
  let [page] = await browser.pages();

  if (!page || !page.url().startsWith(URL_FILTER)) {
    const pages = await browser.pages();
    page = pages.find((p) => p.url().startsWith(URL_FILTER)) ?? pages[0];
  }

  await (page as any)._client().send("Page.setBypassCSP", { enabled: true });

  const code = fs.readFileSync(BUNDLE, "utf8");
  const codeWithUrl =
    code + "\n//# sourceURL=https://internal.scch.org.au/app.js";

  const bootstrap = `
  /*# sourceURL=webpack:///./dev-bootstrap.js */
  (function(){
    try {
      if (window.top !== window.self) return;
      if (window.__L2S_BOOTSTRAP_DONE__) return;
      window.__L2S_BOOTSTRAP_DONE__ = true;
    } catch { return; }

    function waitFor(cond, timeoutMs, intervalMs){
      if(timeoutMs===void 0) timeoutMs=15000; if(intervalMs===void 0) intervalMs=250;
      var start = Date.now();
      return new Promise(function(resolve, reject){
        (function tick(){
          try { if(cond()) return resolve(); } catch{}
          if(Date.now()-start >= timeoutMs) return reject(new Error('timeout'));
          setTimeout(tick, intervalMs);
        })();
      });
    }

    (async function(){
      try {
        var g = window; // ✅ plain JS

        if (!(g.L2S && g.L2S.LookupSearch && g.L2S.Select2DropdownAdapter && g.L2S.Config)) return;
        var fieldId = 'sch_location';
        if (document.getElementById(fieldId + '_L2S')) return;

        await waitFor(function(){ return !!document.getElementById(fieldId); });
        await waitFor(function(){
          var s=g.shell; return !!(s && typeof s.getTokenDeferred==='function' && typeof g.validateLoginSession==='function');
        });
        await waitFor(function(){ return !!document.getElementById('EntityFormView_EntityName'); });
        await waitFor(function(){
          var modal=document.getElementById(fieldId+'_lookupmodal');
          var grid=modal?modal.querySelector('.entity-grid'):null;
          return !!grid;
        }, 30000);

        var adapter=new g.L2S.Select2DropdownAdapter();
        var ls=new g.L2S.LookupSearch(adapter, fieldId, new g.L2S.Config());
        await ls.Apply();
      } catch(e){ console.error('[injector bootstrap] apply failed', e); }
    })();
  })();
`;

  // Register for future navigations
  await registerOnNewDoc(page, codeWithUrl, "code");
  await registerOnNewDoc(page, bootstrap, "boot");

  // Inject once into main frame now
  await page.mainFrame().evaluate(codeWithUrl);
  await page.mainFrame().evaluate(bootstrap);

  // Hot reload on bundle change
  let reinjectTimer: NodeJS.Timeout | undefined;
  fs.watchFile(BUNDLE, { interval: 300 }, async () => {
    try {
      if (reinjectTimer) clearTimeout(reinjectTimer);
      reinjectTimer = setTimeout(async () => {
        const updated =
          fs.readFileSync(BUNDLE, "utf8") +
          "\n//# sourceURL=https://internal.scch.org.au/app.js";
        await registerOnNewDoc(page, updated, "code");
        await page.mainFrame().evaluate(updated);
        console.log("[injector] re-injected bundle");
      }, 120);
    } catch (e) {
      console.error("[injector] hot reload failed", e);
    }
  });

  console.log("[injector] attached and watching", BUNDLE);
}

run().catch((err) => {
  console.error("[injector] error:", err);
  process.exit(1);
});
