import "reflect-metadata";
import fs from "fs";
import puppeteer from "puppeteer-core";

const BUNDLE = __dirname + "/app.js";
const URL_FILTER = "https://internal.scch.org.au/safety/incidents/new/";

run().catch((err) => {
  console.error("[injector] error:", err);
  process.exit(1);
});

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
  await page.mainFrame().addScriptTag({ content: codeWithUrl });

  console.log("[injector] attached and watching", BUNDLE);
}
