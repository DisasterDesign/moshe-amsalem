import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = "out";
if (!existsSync(join(root, "index.html"))) {
  throw new Error("Build the static site before checking production content.");
}

const hiddenRoutes = [
  "/projects",
  "/articles/purchase-tax-guide",
  "/articles/buying-from-developer",
];
const internalNotes = /לקבל ממשה|ממתין לנתון מהלקוח|יתווסף לאחר אישור הלקוח|content\/projects\.ts|לפני העלייה לאוויר/;
const failures = [];
let pages = 0;

function checkDirectory(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) {
      checkDirectory(file);
      continue;
    }
    if (!/\.(html|txt|js|json)$/.test(entry.name)) continue;
    const html = readFileSync(file, "utf8").replace(/\\u([0-9a-f]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    if (internalNotes.test(html)) failures.push(`${file}: internal editorial note`);
    if (!entry.name.endsWith(".html")) continue;
    pages += 1;
    for (const match of html.matchAll(/\bhref="(\/[^"]*)"/g)) {
      const href = match[1].split(/[?#]/)[0];
      if (href.startsWith("//") || href.startsWith("/api/")) continue;
      if (hiddenRoutes.includes(href.replace(/\/$/, ""))) {
        failures.push(`${file}: link to hidden route ${href}`);
        continue;
      }
      const path = decodeURIComponent(href);
      if (![join(root, path), join(root, `${path}.html`), join(root, path, "index.html")].some((destination) => existsSync(destination) && statSync(destination).isFile())) {
        failures.push(`${file}: missing internal destination ${href}`);
      }
    }
  }
}

checkDirectory(root);
const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
for (const route of hiddenRoutes) {
  if (existsSync(join(root, `${route}.html`)) || existsSync(join(root, route, "index.html"))) {
    failures.push(`${route}: hidden page was exported`);
  }
  if (sitemap.includes(`https://ams-law.com${route}<`)) failures.push(`${route}: hidden page is in sitemap`);
}
if (failures.length) {
  console.error([...new Set(failures)].join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Production content check passed: ${pages} HTML pages; no internal notes, hidden pages or broken internal links.`);
}
