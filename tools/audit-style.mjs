#!/usr/bin/env node
// Measure every asset against the art direction (docs/STYLE.md) and list what breaks it, worst first:
// fat (scaled-up) pixels, black or thick outlines, missing outlines, missing contact shadows, airbrushed alpha,
// smooth glows, ground tiles that repeat, busy dark floors. See tools/lib/style-metrics.mjs for how each is measured.
//
//   node tools/audit-style.mjs                      every asset -> records/style-pass/audit.{json,csv,md}
//   node tools/audit-style.mjs bosses weapons       some
//   node tools/audit-style.mjs --out records/style-pass/after
//   node tools/audit-style.mjs --strict             exit 1 when any rule is broken

import { join } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
import { ROOT, allIds, resolveIds, loadEffect } from "./lib/fxlib.mjs";
import { measure, judge, renderStill, stillOptions, spread, isGround, STANDING, EFFECT, ICON } from "./lib/style-metrics.mjs";

const args = process.argv.slice(2), flag = (k, d) => { const i = args.indexOf("--" + k); return i < 0 ? d : args[i + 1]; };
const OUT = join(ROOT, flag("out", join("records", "style-pass", "before")));
const STRICT = args.includes("--strict");
const pats = args.filter((a, i) => !a.startsWith("--") && !(i && ["--out"].includes(args[i - 1])));
const ids = pats.length ? resolveIds(pats) : allIds();

const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) / 4294967296; };
const stillTime = (meta, id) => meta.loop ? (0.35 + hash(id) * 2.3) % meta.duration : meta.duration * 0.55;

const rows = [];
for (const id of ids) {
  const cat = id.split("/")[0];
  let fx;
  try { fx = await loadEffect(id); } catch (e) { rows.push({ id, cat, error: e.message }); continue; }
  const { meta, mod } = fx;
  if (meta.size[0] >= 300) { rows.push({ id, cat, skipped: "full screen" }); continue; }
  try {
    const o = stillOptions(meta, id, { seed: meta.options?.seed ?? 1 });
    // a still where a game would show it; effects also at a quarter, half and three quarters of their run
    const times = EFFECT.has(cat) || cat === "combat" ? [0.25, 0.5, 0.75].map((f) => meta.duration * f) : [stillTime(meta, id)];
    let m = null;
    for (const t of times) {
      const { frame, origin } = renderStill(mod, o, t);
      const k = measure(frame.color, frame.w, frame.h, origin, frame.light);
      if (!m) { m = k; continue; }
      // keep the fullest frame's shape numbers and the worst soft / glow numbers
      const soft = { alphaLevels: Math.max(m.alphaLevels, k.alphaLevels), soft: Math.max(m.soft, k.soft),
        lightLevels: Math.max(m.lightLevels, k.lightLevels), lit: Math.max(m.lit, k.lit) };
      m = { ...(k.solid > m.solid ? k : m), ...soft };
    }
    const row = { id, cat, size: meta.size.join("x"), ...m, notes: judge(id, meta, m) };
    // ground: how many different tiles come out across a 4 x 4 block, and how busy the floor is
    if (isGround(id, meta) && ("tileX" in meta.options || "tileY" in meta.options)) {
      // an 8 x 8 block: distinct tiles, how busy the floor is, and how much the tiles' mean tone wanders (macro
      // variation; a floor whose every tile has the same mean reads as wallpaper even when the tiles differ)
      const seen = new Set(), N = 8, all = [], means = [];
      for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
        const { frame } = renderStill(mod, { ...o, tileX: tx, tileY: ty, tileOffset: ty, edges: "", corners: [] }, 0.3, 0);
        let s = 0;
        for (const c of frame.color) s = (Math.imul(s, 31) + c) | 0;
        seen.add(s);
        const sp = spread(frame.color, frame.color.length);
        means.push(sp.med);
        for (const c of frame.color) all.push(c);
      }
      const block = Uint32Array.from(all), mm = means.reduce((a, b) => a + b, 0) / means.length;
      row.variants = seen.size;
      row.floor = { ...spread(block, block.length), detail: measure(block, 16, block.length / 16, null).detail,
        macro: +Math.sqrt(means.reduce((a, v) => a + (v - mm) ** 2, 0) / means.length).toFixed(2) };
      if (seen.size < 3) row.notes.push(`repeats: only ${seen.size} different tile${seen.size > 1 ? "s" : ""} in an 8 x 8 block (rule: 3-5 variants)`);
      else if (row.floor.macro < 0.6 && /ground|grass|sand|snow|floor|soil/.test(id)) row.notes.push(`wallpaper: tiles' mean tone wanders only ${row.floor.macro} L across an 8 x 8 block (no large-scale variation)`);
    }
    rows.push(row);
  } catch (e) {
    rows.push({ id, cat, error: String(e.message ?? e).split("\n")[0] });
  }
}

// ---------------------------------------------------------------- report
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "audit.json"), JSON.stringify(rows, null, 1));
const COLS = ["id", "cat", "size", "ink", "solid", "colors", "maxFlat", "detail", "singles", "even", "outlined", "outlineW", "outlineL", "black",
  "contact", "soft", "alphaLevels", "lit", "lightLevels", "variants", "notes"];
const cell = (v) => Array.isArray(v) ? (typeof v[0] === "number" ? v.join("x") : v.join(" | ")) : v ?? "";
writeFileSync(join(OUT, "audit.csv"), [COLS.join(","), ...rows.map((r) => COLS.map((c) => JSON.stringify(String(cell(r[c])))).join(","))].join("\n"));

const ok = rows.filter((r) => !r.error && !r.skipped), RULES = {
  "fat pixels": /^fat pixels/, "flat slab": /^flat slab/, "black outline": /^black outline/, "thick outline": /^thick outline/, "no outline": /^no outline/,
  "no contact shadow": /^no contact shadow/, "soft alpha": /^soft alpha/, "smooth glow": /^smooth glow/, "repeats": /^repeats/, "wallpaper": /^wallpaper/,
};
const broken = (re) => ok.filter((r) => r.notes.some((n) => re.test(n)));
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[s.length >> 1] : 0; };
const md = [`# Style audit`, "", `${ids.length} assets, ${ok.length} measured, ${rows.filter((r) => r.error).length} failed to render, ` +
  `${rows.filter((r) => r.skipped).length} full-screen skipped. ${ok.filter((r) => r.notes.length).length} break at least one rule.`, "",
  "## Rules broken", "", "| rule | assets | worst |", "|---|---|---|"];
for (const [name, re] of Object.entries(RULES)) {
  const b = broken(re);
  md.push(`| ${name} | ${b.length} | ${b.slice(0, 6).map((r) => r.id).join(", ")}${b.length > 6 ? ", ..." : ""} |`);
}
md.push("", "## By category", "", "| category | n | broken | median ink | median detail | median 1px runs | outlined | outline px | black | contact |",
  "|---|---|---|---|---|---|---|---|---|---|");
const cats = [...new Set(ok.map((r) => r.cat))].sort();
for (const c of cats) {
  const g = ok.filter((r) => r.cat === c), pc = (v) => (v * 100).toFixed(0) + "%";
  md.push(`| ${c} | ${g.length} | ${g.filter((r) => r.notes.length).length} | ${med(g.map((r) => r.ink[0]))}x${med(g.map((r) => r.ink[1]))} | ` +
    `${med(g.map((r) => r.detail))} | ${pc(med(g.map((r) => r.singles)))} | ${pc(med(g.map((r) => r.outlined)))} | ${med(g.map((r) => r.outlineW))} | ` +
    `${pc(med(g.map((r) => r.black)))} | ${pc(g.filter((r) => r.contact).length / g.length)} |`);
}
const floors = ok.filter((r) => r.floor);
md.push("", "## Ground tiles (8 x 8 block)", "", "| tile | variants | macro | L p5..p95 | L sd | detail |", "|---|---|---|---|---|---|");
for (const r of floors.sort((a, b) => b.floor.sd - a.floor.sd)) md.push(`| ${r.id} | ${r.variants} | ${r.floor.macro} | ${r.floor.p5}..${r.floor.p95} | ${r.floor.sd} | ${r.floor.detail} |`);
md.push("", "## Every asset with a problem", "");
for (const r of ok.filter((r) => r.notes.length)) md.push(`- **${r.id}**: ${r.notes.join("; ")}`);
for (const r of rows.filter((r) => r.error)) md.push(`- **${r.id}**: did not render (${r.error})`);
writeFileSync(join(OUT, "audit.md"), md.join("\n") + "\n");

console.log(md.slice(0, 4 + Object.keys(RULES).length + 2).join("\n"));
console.log(`\nwrote ${join(OUT, "audit.md")} (+ .json, .csv)`);
process.exit(STRICT && ok.some((r) => r.notes.length) ? 1 : 0);
