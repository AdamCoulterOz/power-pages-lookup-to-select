import "reflect-metadata";

// Own a single jQuery instance and expose it globally *before* loading Select2
import $ from "jquery";
(window as any).jQuery = $;
(window as any).$ = $;

// Patch $.fn.select2 on that same jQuery

// (Do not import Select2 JS here, as we may need to patch around AMD/RequireJS on runtime.)

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

function ensureSelect2Css() {
  const href =
    "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css";
  if (!document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
}

// Ensures Select2 is loaded and registered on the current jQuery, even with AMD/RequireJS present
async function ensureSelect2Plugin() {
  const g: any = window as any;
  const $jq = g.jQuery || g.$;
  if ($jq?.fn?.select2) return; // already patched

  // Temporarily disable AMD so Select2's UMD executes immediately
  const hadDefine = typeof g.define === "function";
  const savedDefine = g.define;
  const hadAMD = hadDefine && !!g.define.amd;
  if (hadAMD) {
    try { g.define.amd = undefined; } catch {}
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.full.min.js";
    script.onload = () => {
      // Restore AMD if we changed it
      if (hadAMD) g.define = savedDefine;
      resolve();
    };
    script.onerror = (e) => {
      if (hadAMD) g.define = savedDefine;
      reject(new Error("Failed to load Select2 plugin script"));
    };
    document.head.appendChild(script);
  });
}

/** The debuggable bootstrap (compiled with sourcemaps) */
export async function bootstrap(fieldId: string = "sch_location") {
  const g = window as any;
  ensureSelect2Css();

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
  // Soft-wait for shell auth helpers; some pages may differ
  try {
    await waitFor(() => {
      const s = g.shell;
      return !!(
        s &&
        typeof s.getTokenDeferred === "function" &&
        typeof g.validateLoginSession === "function"
      );
    }, 8000);
    console.info("[L2S] Shell helpers detected");
  } catch {
    // eslint-disable-next-line no-console
    console.warn("[L2S] Shell helpers not detected; continuing without them");
  }

  // Soft-wait for entity name element; some forms don’t have this ID
  try {
    await waitFor(
      () => !!document.getElementById("EntityFormView_EntityName"),
      4000
    );
    console.info("[L2S] EntityFormView_EntityName detected");
  } catch {
    // eslint-disable-next-line no-console
    console.warn("[L2S] EntityFormView_EntityName not found; continuing");
  }
  // Soft-wait: the lookup modal grid may not exist until opened; don't block init on it
  try {
    await waitFor(() => {
      const modal = document.getElementById(fieldId + "_lookupmodal");
      const grid = modal ? modal.querySelector(".entity-grid") : null;
      return !!grid;
    }, 5000);
    console.info("[L2S] Modal grid detected");
  } catch {
    // eslint-disable-next-line no-console
    console.warn(
      "[L2S] Proceeding without waiting for modal grid (not present yet)"
    );
  }

  try {
    // Ensure jQuery is ready (Power Pages may lazy-load it)
    await waitFor(() => !!((window as any).jQuery || (window as any).$), 5000);
    console.info("[L2S] jQuery detected");
  } catch {
    // eslint-disable-next-line no-console
    console.warn("[L2S] jQuery not detected; continuing without it");
  }

  // Ensure Select2 plugin is actually registered even on RequireJS pages
  await ensureSelect2Plugin();

  const $jq = (window as any).jQuery || (window as any).$;
  if (typeof $jq?.fn?.select2 !== "function") {
    throw new Error("[L2S] Select2 not registered on this jQuery instance"); // THROWS HERE
  }

  // Final ensure
  // if (typeof (window as any).jQuery?.fn?.select2 !== "function") {
  //   throw new Error(
  //     "Select2 plugin not available on jQuery.fn after load. Ensure 'select2' is required/loaded before bootstrap."
  //   );
  // }

  const adapter = new Select2DropdownAdapter();
  const ls = new LookupSearch(adapter, fieldId, new Config());
  await ls.Apply();
}

/** Also expose bootstrap on window for manual triggering */
(window as any).L2S.bootstrap = bootstrap;

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
