import "reflect-metadata";
import { LookupSearch, Config, Select2DropdownAdapter } from "./index";

declare global {
  interface Window {
    L2S?: any;
  }
}

(() => {
  if ((window as any).__L2S_BUNDLE_LOADED__) {
    console.warn("[L2S] bundle already loaded — skipping re-init");
    return;
  }
  (window as any).__L2S_BUNDLE_LOADED__ = true;

  // Expose to window for manual debugging in dev tools
  (window as any).L2S = { LookupSearch, Config, Select2DropdownAdapter };

  const FIELD_ID = "sch_location";

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
        if (Date.now() - start >= timeoutMs)
          return reject(new Error("timeout"));
        setTimeout(tick, intervalMs);
      };
      tick();
    });
  }

  async function tryInit() {
    try {
      await waitFor(() => !!document.getElementById(FIELD_ID));
      await waitFor(() => {
        const g = window as any;
        return !!(
          g.shell &&
          typeof g.shell.getTokenDeferred === "function" &&
          typeof g.validateLoginSession === "function"
        );
      });
      await waitFor(
        () => !!document.getElementById("EntityFormView_EntityName")
      );

      const modalId = `${FIELD_ID}_lookupmodal`;
      await waitFor(() => {
        const modal = document.getElementById(modalId);
        const grid = modal ? modal.querySelector(".entity-grid") : null;
        return !!grid;
      }, 30000);

      const adapter = new Select2DropdownAdapter();
      const ls = new LookupSearch(adapter as any, FIELD_ID, new Config());
      await ls.Apply();
    } catch (e) {
      console.error("[L2S] init failed:", e);
    }
  }

  const start = () => { void tryInit(); };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
