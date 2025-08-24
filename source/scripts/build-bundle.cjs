#!/usr/bin/env node
const esbuild = require("esbuild");
const path = require("path");

const entry = path.resolve(__dirname, "..", "setup.ts");
const absDir = path.resolve(__dirname, "..");

const common = {
  entryPoints: [entry],
  bundle: true,
  target: ["es2019"],
  platform: "browser",
  format: "iife",
  globalName: "L2SBundle",
  absWorkingDir: absDir,
};

async function run() {
  try {
    await esbuild.build({
      ...common,
      sourcemap: "inline",
      outfile: path.resolve(__dirname, "..", "dist", "app.dev.js"),
      define: { "process.env.NODE_ENV": '"development"' },
    });

    console.log("[build] wrote", path.resolve(__dirname, "..", "dist", "app.dev.js"));

    await esbuild.build({
      ...common,
      sourcemap: false,
      outfile: path.resolve(__dirname, "..", "dist", "app.js"),
      define: { "process.env.NODE_ENV": '"production"' },
      minify: true,
    });
    
    console.log("[build] wrote", path.resolve(__dirname, "..", "dist", "app.js"));
  } catch (e) {
    console.error("[build] failed", e);
    process.exit(1);
  }
}
run();
