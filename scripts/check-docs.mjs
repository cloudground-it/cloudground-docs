#!/usr/bin/env node
// Enforces the checkable rules of STANDARD.md (section 6) on every page of
// both locales. Exit code 1 lists every problem found; --strict also refuses
// pages that are still `last_verified: unverified`. Mermaid diagrams are
// parsed too: a syntax error would otherwise only show in the browser.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const LOCALES = {
  it: path.join(ROOT, 'docs'),
  en: path.join(ROOT, 'i18n/en/docusaurus-plugin-content-docs/current'),
};
const TYPES = ['tutorial', 'how-to', 'reference', 'explanation', 'index'];
// Group folder -> the only page type it may hold (besides its index).
const FOLDER_TYPE = {
  tutorials: 'tutorial',
  sites: 'how-to',
  data: 'how-to',
  access: 'how-to',
  server: 'how-to',
  reference: 'reference',
  explanation: 'explanation',
  cli: 'reference',
  api: 'reference',
};
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const strict = process.argv.includes('--strict');

const problems = [];
const unverified = [];
const fail = (file, msg) => problems.push(`${path.relative(ROOT, file)}: ${msg}`);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (/\.mdx?$/.test(entry.name)) out.push(p);
  }
  return out;
}

function parse(file) {
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return {fm: null, body: src};
  try {
    return {fm: yaml.load(m[1]) ?? {}, body: src.slice(m[0].length)};
  } catch (e) {
    fail(file, `front matter is not valid YAML: ${e.message}`);
    return {fm: null, body: src};
  }
}

// Permalink of a page, as Docusaurus computes it with routeBasePath '/'.
function permalink(rel, fm) {
  const dir = path.posix.dirname(rel.split(path.sep).join('/'));
  if (fm?.slug) {
    return fm.slug.startsWith('/') ? fm.slug : `/${dir === '.' ? '' : `${dir}/`}${fm.slug}`;
  }
  const base = path.posix.basename(rel, path.extname(rel));
  if (base === 'index' || base === path.posix.basename(dir)) return dir === '.' ? '/' : `/${dir}`;
  return `/${dir === '.' ? '' : `${dir}/`}${base}`;
}

// Fenced code is not prose: links inside it are not checked.
const stripCode = (body) => body.replace(/^(```|~~~)[\s\S]*?^\1/gm, '');

function links(body) {
  const text = stripCode(body);
  const found = [];
  for (const m of text.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) found.push(m[1]);
  for (const m of text.matchAll(/\bto=["']([^"']+)["']/g)) found.push(m[1]);
  for (const m of text.matchAll(/\bhref=["']([^"']+)["']/g)) found.push(m[1]);
  return found.filter((l) => !/^(https?:|mailto:|#)/.test(l));
}

const diagrams = [];
const pages = {};
for (const [locale, dir] of Object.entries(LOCALES)) {
  pages[locale] = new Map();
  for (const file of walk(dir)) {
    const rel = path.relative(dir, file);
    pages[locale].set(rel, {file, ...parse(file)});
  }
}

for (const [locale, map] of Object.entries(pages)) {
  const permalinks = new Set([...map].map(([rel, p]) => permalink(rel, p.fm)));
  for (const [rel, {file, fm, body}] of map) {
    if (!fm) {
      fail(file, 'no front matter');
      continue;
    }
    for (const key of ['title', 'description', 'type', 'last_verified']) {
      if (fm[key] === undefined || fm[key] === null || fm[key] === '') fail(file, `missing \`${key}\``);
    }
    if (fm.type && !TYPES.includes(fm.type)) fail(file, `type \`${fm.type}\` is not one of ${TYPES.join(', ')}`);
    const lv = fm.last_verified instanceof Date ? fm.last_verified.toISOString().slice(0, 10) : fm.last_verified;
    if (lv !== undefined && lv !== 'unverified' && !DATE.test(String(lv))) {
      fail(file, `last_verified \`${lv}\` is neither YYYY-MM-DD nor unverified`);
    }
    if (lv === 'unverified' && locale === 'it') unverified.push(rel);
    const folder = rel.split(path.sep)[0];
    const isIndex = fm.type === 'index';
    if (!isIndex) {
      if (!fm.version) fail(file, 'missing `version`');
      if (!Array.isArray(fm.prerequisites)) fail(file, '`prerequisites` must be a list (use [] for none)');
      if (FOLDER_TYPE[folder] && fm.type !== FOLDER_TYPE[folder]) {
        fail(file, `a \`${fm.type}\` page in ${folder}/, which holds \`${FOLDER_TYPE[folder]}\` pages`);
      }
      if (!/^##\s.*\{#next\}\s*$/m.test(body)) fail(file, 'no next-step section (`## … {#next}`)');
    }
    for (const m of body.matchAll(/^```mermaid\n([\s\S]*?)^```/gm)) diagrams.push({file, src: m[1]});
    for (const link of links(body)) {
      const target = link.split('#')[0];
      if (!target) continue;
      if (target.startsWith('/')) {
        const clean = target.replace(/\/$/, '') || '/';
        const asStatic = path.join(ROOT, 'static', clean);
        if (!permalinks.has(clean) && !fs.existsSync(asStatic)) fail(file, `broken link ${link}`);
      } else if (!fs.existsSync(path.resolve(path.dirname(file), target))) {
        fail(file, `broken link ${link}`);
      }
    }
  }
}

// Both languages, page by page.
const [it, en] = [pages.it, pages.en];
for (const rel of new Set([...it.keys(), ...en.keys()])) {
  const a = it.get(rel);
  const b = en.get(rel);
  if (!a) fail(path.join(LOCALES.en, rel), 'has no Italian page at the same path');
  else if (!b) fail(a.file, 'has no English page at the same path');
  else if (a.fm && b.fm) {
    if (a.fm.type !== b.fm.type) fail(b.file, `type differs from the Italian page (${a.fm.type})`);
    if (String(a.fm.last_verified) !== String(b.fm.last_verified)) {
      fail(b.file, 'last_verified differs from the Italian page');
    }
  }
}

if (diagrams.length) {
  const {JSDOM} = await import('jsdom');
  const {window} = new JSDOM('');
  globalThis.window = window;
  globalThis.document = window.document;
  const {default: mermaid} = await import('mermaid');
  for (const {file, src} of diagrams) {
    try {
      await mermaid.parse(src);
    } catch (e) {
      fail(file, `Mermaid diagram does not parse: ${String(e.message).split('\n').slice(0, 3).join(' ')}`);
    }
  }
}

if (strict) for (const rel of unverified) problems.push(`${rel}: last_verified is unverified (--strict)`);

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s). See STANDARD.md.`);
  process.exit(1);
}
const total = it.size + en.size;
console.log(`${total} pages and ${diagrams.length} diagrams checked; ${unverified.length} pages per language still unverified.`);
