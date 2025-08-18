// pnpm add -D puppeteer-core ts-node @types/node
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";

const BUNDLE = path.resolve(__dirname, "dist/app.js"); // your compiled bundle with *inline* source maps
const URL_FILTER = "https://internal.scch.org.au/";

async function run() {
  // Attach to the Edge instance launched by the other config
  const browser = await puppeteer.connect({ browserURL: "http://localhost:9222" });
  let [page] = await browser.pages();

  // If multiple pages, pick the target tab
  if (!page || !page.url().startsWith(URL_FILTER)) {
    const pages = await browser.pages();
    page = pages.find(p => p.url().startsWith(URL_FILTER)) ?? pages[0];
  }

  // Bypass CSP so injection isn’t blocked
  // @ts-ignore private API typing; CDP direct:
  await (page as any)._client().send("Page.setBypassCSP", { enabled: true });

  const code = fs.readFileSync(BUNDLE, "utf8");

  // Ensure it runs on every navigation/new doc
  // @ts-ignore private API typing
  await (page as any)._client().send("Page.addScriptToEvaluateOnNewDocument", { source: code });

  // Inject once for the current page
  await page.evaluate(code);

  // Simple file watch for hot re-inject
  fs.watchFile(BUNDLE, { interval: 300 }, async () => {
    try {
      const updated = fs.readFileSync(BUNDLE, "utf8");
      await page.evaluate(updated);
      console.log("[injector] re-injected bundle");
    } catch (err) {
      console.error("[injector] inject failed:", err);
    }
  });

  console.log("[injector] attached and watching", BUNDLE);
}

run().catch(err => {
  console.error("[injector] error:", err);
  process.exit(1);
});