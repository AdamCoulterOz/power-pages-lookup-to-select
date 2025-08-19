#!/usr/bin/env node
/* eslint-disable no-console */
const esbuild = require("esbuild");
const path = require("path");

async function run() {
  const entry = path.resolve(__dirname, "..", "dev-bundle.ts");
  const outFile = path.resolve(__dirname, "..", "dist", "app.js");
  try {
    const absDir = path.resolve(__dirname, '..');
    await esbuild.build({
      entryPoints: [entry],
      outfile: outFile,
      bundle: true,
      absWorkingDir: absDir,
      target: ["es2019"],
      platform: "browser",
      format: "iife",
      globalName: "L2SBundle",
      sourcemap: "inline",
      keepNames: true,
      define: {
        "process.env.NODE_ENV": '"development"',
      },
    });
    console.log("[build] wrote", outFile);
  } catch (e) {
    console.error("[build] failed", e);
    process.exit(1);
  }
}
run();
