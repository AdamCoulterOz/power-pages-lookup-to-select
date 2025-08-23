import "reflect-metadata";
import { LookupSearch, Config, Select2DropdownAdapter } from "./index";
import {
  PowerPagesShell,
  ValidateLoginSession,
} from "./modules/PowerPagesClient";

type L2SApi = {
  LookupSearch: typeof LookupSearch;
  Config: typeof Config;
  Select2DropdownAdapter: typeof Select2DropdownAdapter;
};

declare global {
  interface Window {
    L2S?: L2SApi;
    L2S_Loaded?: boolean;
    jQuery?: typeof import("jquery");
    $?: typeof import("jquery");
    shell?: PowerPagesShell;
    validateLoginSession?: ValidateLoginSession;
  }
}

window.L2S = {
  LookupSearch,
  Config,
  Select2DropdownAdapter,
} satisfies L2SApi;

(() => {
  if (window.L2S_Loaded) {
    console.warn("[L2S] bundle already loaded — skipping re-init");
    return;
  }
  window.L2S_Loaded = true;

  const start = async () => {
    const $jq = window.jQuery ?? window.$;
    if (!$jq) throw new Error("[L2S] jQuery is not available on window...");
    window.jQuery = $jq;
    window.$ = $jq;

    await waitForShellHelpers();
    await ensureSelect2();

    const lookupFields = ["sch_location", "sch_personinvolved"];
    const lookupTasks = lookupFields.map((field) => initializeLookup(field));
    await waitFor("Lookup fields", async () => {
      try {
        await Promise.all(lookupTasks);
      } catch (error) {
        console.error("[L2S] Error initializing lookup fields:", error);
        return false;
      }
      return true;
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();

async function waitForShellHelpers() {
  await waitFor(
    "Shell helpers",
    () => {
      const s = window.shell;
      return !!(
        s &&
        typeof s.getTokenDeferred === "function" &&
        typeof window.validateLoginSession === "function"
      );
    },
    8000
  );

  await waitFor(
    "EntityFormView_EntityName",
    () => !!document.getElementById("EntityFormView_EntityName"),
    4000
  );
}

async function ensureSelect2() {
  if (window.$ && typeof window.$.fn?.select2 === "function") return;

  await loadStylesheet(
    "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
  );
  await loadScript(
    "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.full.min.js"
  );

  if (!(window.$ && typeof window.$.fn?.select2 === "function")) {
    throw new Error("Select2 failed to load or plugin not registered on $.fn");
  }
}

function loadStylesheet(href: string): Promise<void> {
  if (Array.from(document.styleSheets).some(s => (s as CSSStyleSheet).href === href))
    return Promise.resolve();
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
    document.head.appendChild(link);
  });
}

function loadScript(src: string): Promise<void> {
  if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load JS: ${src}`));
    document.head.appendChild(script);
  });
}

export async function initializeLookup(fieldId: string) {
  if (document.getElementById(`${fieldId}_L2S`)) return;

  await Promise.all([
    waitFor(`GetField ${fieldId}`, () => !!document.getElementById(fieldId)),
    waitFor(
      `GetModalGrid ${fieldId}`,
      () => {
        const modal = document.getElementById(`${fieldId}_lookupmodal`);
        return !!modal?.querySelector(".entity-grid");
      },
      5000
    ),
  ]);

  const adapter = new Select2DropdownAdapter();
  const ls = new LookupSearch(adapter, fieldId, new Config());
  await ls.Apply();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type MaybePromise<T> = T | Promise<T>;

async function waitFor(
  name: string,
  cond: () => MaybePromise<boolean>,
  timeoutMs = 15_000,
  intervalMs = 250
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      if (await cond()) {
        console.info(
          `[L2S] waitFor ${name} resolved after ${Date.now() - start}ms`
        );
        return true;
      }
    } catch (error) {
      console.debug(
        `[L2S] waitFor ${name} failed in wait cycle, will retry if not timed out:`,
        error
      );
    }
    await sleep(intervalMs);
  }
  console.error(
    `[L2S] waitFor ${name} timed out after ${Date.now() - start}ms`
  );
  return false;
}
