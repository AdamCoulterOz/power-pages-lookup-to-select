import "reflect-metadata";
import { LookupSearch, Config, Select2DropdownAdapter } from "./index";

declare global {
  interface Window {
    L2S?: any;
    __L2S_BUNDLE_LOADED__?: boolean;
  }
}

/** Expose API for debugging in DevTools */
(window as any).L2S = { LookupSearch, Config, Select2DropdownAdapter };

/** Small helper used by bootstrap */
async function waitFor(
  cond: () => boolean,
  timeoutMs = 15000,
  intervalMs = 250
) {
  const start = Date.now();
  return new Promise<void>((resolve, reject) => {
    const tick = () => {
      try {
        if (cond()) return resolve();
      } catch {}
      if (Date.now() - start >= timeoutMs) return reject(new Error("timeout"));
      setTimeout(tick, intervalMs);
    };
    tick();
  });
}

/** The debuggable bootstrap (compiled with sourcemaps) */
export async function bootstrap(fieldId: string = "sch_location") {
  const g = window as any;

  // Ensure the library is present and not already applied
  if (
    !(
      g.L2S &&
      g.L2S.LookupSearch &&
      g.L2S.Select2DropdownAdapter &&
      g.L2S.Config
    )
  )
    return;
  if (document.getElementById(fieldId + "_L2S")) return;

  await waitFor(() => !!document.getElementById(fieldId));
  await waitFor(() => {
    const s = g.shell;
    return !!(
      s &&
      typeof s.getTokenDeferred === "function" &&
      typeof g.validateLoginSession === "function"
    );
  });
  await waitFor(() => !!document.getElementById("EntityFormView_EntityName"));
  await waitFor(() => {
    const modal = document.getElementById(fieldId + "_lookupmodal");
    const grid = modal ? modal.querySelector(".entity-grid") : null;
    return !!grid;
  }, 30000);

  const adapter = new Select2DropdownAdapter();
  const ls = new LookupSearch(adapter as any, fieldId, new Config());
  await ls.Apply();
}

/** Also expose bootstrap on window for manual triggering */
(window as any).L2S.bootstrap = bootstrap;

/** One-time, DOM-ready kickoff */
(() => {
  if ((window as any).__L2S_BUNDLE_LOADED__) {
    // eslint-disable-next-line no-console
    console.warn("[L2S] bundle already loaded — skipping re-init");
    return;
  }
  (window as any).__L2S_BUNDLE_LOADED__ = true;

  const start = () => {
    void bootstrap();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
