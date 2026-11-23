#!/usr/bin/env node
// Bundle the gallery into dist/gallery (a static site: GitHub Pages or any host) and dist/page (one page plus
// one script, for hosts that take a page body).
//
//   node tools/index.mjs && node tools/build-gallery.mjs

import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { ROOT, allIds } from "./lib/fxlib.mjs";
import { usesReferenceArt } from "./lib/asset-rights.mjs";

const release = process.argv.includes("--release");
const G = join(ROOT, "gallery"), dist = release ? join(ROOT, "dist", "release") : join(ROOT, "dist");
const OUT = join(dist, "gallery"), PAGE = join(dist, "page");
mkdirSync(OUT, { recursive: true });
mkdirSync(PAGE, { recursive: true });

const releaseAssets = {
  name: "release-assets",
  setup(build) {
    build.onLoad({ filter: /[\\/]src[\\/]fx[\\/]index\.js$/ }, ({ path }) => {
      const ids = allIds().filter((id) => !usesReferenceArt(id));
      const imports = ids.map((id, i) => `import * as fx${i} from ${JSON.stringify("./" + id + ".js")};`);
      const entries = ids.map((id, i) => `${JSON.stringify(id)}: fx${i}`);
      const contents = [...imports, 'export { categories } from "./categories.js";', `export const effects = {${entries.join(",")}};`].join("\n");
      return { contents, resolveDir: dirname(path) };
    });
    build.onLoad({ filter: /[\\/](characters|portraits)[\\/]_art\.js$/ }, () => ({
      contents: "export const characterArt = {}; export const portraitArt = {};",
    }));
  },
};

await build({
  entryPoints: [join(G, "app.js")], bundle: true, format: "esm", minify: true, outfile: join(OUT, "app.js"),
  legalComments: "none", plugins: release ? [releaseAssets] : [],
});
writeFileSync(join(OUT, "style.css"), readFileSync(join(G, "style.css")));
writeFileSync(join(OUT, "index.html"), readFileSync(join(G, "index.html")));

// the one-page version: <title> and <style> first, then the body markup
const html = readFileSync(join(G, "index.html"), "utf8");
const body = html.slice(html.indexOf("<!--BODY-->") + 11, html.indexOf("<!--/BODY-->"));
const css = readFileSync(join(G, "style.css"), "utf8");
writeFileSync(
  join(PAGE, "index.html"),
  [
    "<title>farmfx</title>",
    '<meta name="claude:viewport-fit-sides" content="cover">',
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pixelify+Sans&family=Funnel+Sans:wght@400;500&family=Red+Hat+Mono:wght@400;500&display=swap">',
    `<style>\n${css}\n</style>`,
    body.trim(),
    '<script type="module" src="app.js"></script>',
  ].join("\n"),
);
cpSync(join(OUT, "app.js"), join(PAGE, "app.js"));
for (const name of ["LICENSE", "NOTICE.md"]) {
  cpSync(join(ROOT, name), join(OUT, name));
  cpSync(join(ROOT, name), join(PAGE, name));
}
console.log(`gallery and page built under ${dist} (${(readFileSync(join(OUT, "app.js")).length / 1024).toFixed(0)} KB of script)`);
