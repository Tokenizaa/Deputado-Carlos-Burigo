#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const BASE = "https://dadosabertos.tse.jus.br";
const DATASETS = process.argv.slice(2);
const DEFAULT_DATASETS = ["candidatos-2022", "resultados-2022", "resultados-2022-boletim-de-urna"];

function normalizeResources(pkg) {
  return (pkg?.result?.resources ?? [])
    .map((r) => ({
      id: r.id ?? null,
      name: r.name ?? r.title ?? null,
      format: r.format ?? null,
      url: r.url ?? null,
      mimetype: r.mimetype ?? null,
      description: r.description ?? null,
    }))
    .filter((r) => r.url);
}

async function ckan(packageId) {
  const url = `${BASE}/api/3/action/package_show?id=${encodeURIComponent(packageId)}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`CKAN HTTP ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error("CKAN package_show returned success=false");

  return {
    source: "ckan-api",
    dataset: json.result,
    resources: normalizeResources(json),
  };
}

async function crawler(packageId) {
  const url = `${BASE}/dataset/${encodeURIComponent(packageId)}`;
  const res = await fetch(url, { headers: { accept: "text/html" } });
  if (!res.ok) throw new Error(`Portal HTTP ${res.status}`);
  const html = await res.text();

  const resources = [...html.matchAll(/href=["'](https?:\/\/[^"' ]+)["']/gi)]
    .map((m) => m[1])
    .filter((u) => u.includes("cdn.tse.jus.br"))
    .filter((u, i, a) => a.indexOf(u) === i)
    .map((url) => ({
      id: null,
      name: basename(new URL(url).pathname),
      format: null,
      url,
      mimetype: null,
      description: null,
    }));

  return {
    source: "portal-crawler",
    dataset: { id: packageId, url },
    resources,
  };
}

async function main() {
  const ids = DATASETS.length ? DATASETS : DEFAULT_DATASETS;
  const output = [];

  for (const id of ids) {
    try {
      output.push(await ckan(id));
    } catch (apiError) {
      const fallback = await crawler(id);
      fallback.api_error = String(apiError.message);
      output.push(fallback);
    }
  }

  const payload = {
    retrieved_at: new Date().toISOString(),
    provider: "TSE",
    portal: BASE,
    datasets: output,
  };

  await mkdir(resolve("artifacts/electoral"), { recursive: true });
  const path = resolve("artifacts/electoral/tse-source-catalog.json");
  await writeFile(path, JSON.stringify(payload, null, 2) + "\n", "utf8");

  for (const dataset of output) {
    console.log(`[${dataset.source}] ${dataset.dataset?.name ?? dataset.dataset?.id ?? "unknown"}`);
    for (const resource of dataset.resources) {
      console.log(`  - ${resource.name ?? resource.id ?? "resource"}: ${resource.url}`);
    }
  }

  console.log(`Catalog: ${path}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
