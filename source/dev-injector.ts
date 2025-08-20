// pnpm add -D puppeteer-core @types/node
import "reflect-metadata";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";

// let scriptIdCode: string | undefined;

// async function registerOnNewDoc(page: any, source: string) {
//   const client = (page as any)._client();
//   if (scriptIdCode) {
//     await client.send("Page.removeScriptToEvaluateOnNewDocument", {
//       identifier: scriptIdCode,
//     });
//     scriptIdCode = undefined;
//   }
//   const { identifier } = await client.send(
//     "Page.addScriptToEvaluateOnNewDocument",
//     { source }
//   );
//   scriptIdCode = identifier;
// }

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

  // Register bundle for future navigations
  // await registerOnNewDoc(page, codeWithUrl);

  // Inject once into the main frame now
  // await page.mainFrame().evaluate(codeWithUrl);
  await page.mainFrame().addScriptTag({ content: codeWithUrl });

  // // Hot reload on bundle change (debounced)
  // let reinjectTimer: NodeJS.Timeout | undefined;
  // fs.watchFile(BUNDLE, { interval: 300 }, async () => {
  //   try {
  //     if (reinjectTimer) clearTimeout(reinjectTimer);
  //     reinjectTimer = setTimeout(async () => {
  //       const updated = fs.readFileSync(BUNDLE, "utf8") + "\n//# sourceURL=https://internal.scch.org.au/app.js";
  //       await registerOnNewDoc(page, updated);
  //       await page.mainFrame().evaluate(updated);
  //       // eslint-disable-next-line no-console
  //       console.log("[injector] re-injected bundle");
  //     }, 120);
  //   } catch (e) {
  //     // eslint-disable-next-line no-console
  //     console.error("[injector] hot reload failed", e);
  //   }
  // });

  // eslint-disable-next-line no-console
  console.log("[injector] attached and watching", BUNDLE);
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[injector] error:", err);
  process.exit(1);
});
