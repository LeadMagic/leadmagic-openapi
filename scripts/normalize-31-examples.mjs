#!/usr/bin/env node
/**
 * Normalize a synced OpenAPI document to strict 3.1 example style:
 *
 * - Schema objects:     example: v            -> examples: [v]        (JSON Schema keyword)
 * - Parameter objects:  example: v            -> examples: {default: {value: v}}
 * - Media type objects: example: v            -> examples: {default: {value: v}}
 *
 * The docs-site source spec keeps the 3.0-style singular `example` fields
 * (its renderer expects them); this repo publishes the strict-3.1 form.
 *
 * Usage: node scripts/normalize-31-examples.mjs <in.yaml> <out.yaml> <out.json>
 */
import fs from "node:fs";
import { parse, stringify } from "yaml";

const [, , inFile, outYaml, outJson] = process.argv;
if (!inFile || !outYaml || !outJson) {
	console.error("usage: normalize-31-examples.mjs <in.yaml> <out.yaml> <out.json>");
	process.exit(1);
}

const doc = parse(fs.readFileSync(inFile, "utf8"));
let schemaCount = 0;
let namedCount = 0;

const MIME_RE = /^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+*-]+$/i;

/**
 * @param node       current object
 * @param parentKey  the key this object lives under
 * @param inSchema   true when inside a JSON Schema subtree
 */
function walk(node, parentKey, inSchema) {
	if (Array.isArray(node)) {
		// Parameter objects live in `parameters` arrays.
		for (const item of node) walk(item, parentKey === "parameters" ? "@parameter" : parentKey, inSchema);
		return;
	}
	if (!node || typeof node !== "object") return;

	// A `properties` map's values are schemas, but its KEYS are field names —
	// a field literally named "example" must not be rewritten.
	const isPropertyMap = parentKey === "properties";

	if (!isPropertyMap && Object.hasOwn(node, "example")) {
		const isParameter = parentKey === "@parameter" && Object.hasOwn(node, "in");
		const isMediaType = MIME_RE.test(parentKey ?? "");
		if (inSchema && !isParameter && !isMediaType) {
			node.examples = [node.example];
			delete node.example;
			schemaCount++;
		} else if (isParameter || isMediaType) {
			// `examples` may already exist; don't clobber.
			if (!Object.hasOwn(node, "examples")) {
				node.examples = { default: { value: node.example } };
			}
			delete node.example;
			namedCount++;
		}
	}

	for (const [key, value] of Object.entries(node)) {
		if (key === "examples") continue; // never descend into example payloads
		const childInSchema =
			inSchema ||
			key === "schema" ||
			(isPropertyMap === false && (key === "properties" || key === "items" || key === "allOf" || key === "oneOf" || key === "anyOf" || key === "additionalProperties" || key === "prefixItems"));
		walk(value, key, isPropertyMap ? true : childInSchema);
	}
}

walk(doc.paths, "paths", false);
// components.schemas entries ARE schemas; components.parameters entries ARE parameters.
for (const schema of Object.values(doc.components?.schemas ?? {})) walk(schema, "schema", true);
for (const param of Object.values(doc.components?.parameters ?? {})) walk(param, "@parameter", false);
walk(doc.components?.responses ?? {}, "responses", false);
walk(doc.components?.requestBodies ?? {}, "requestBodies", false);

// Anything left (e.g. bare `example` outside recognized contexts) still needs
// to satisfy the strict-3.1 CI check — report and fail loudly if any remain.
let leftovers = 0;
(function scan(node, parentKey) {
	if (Array.isArray(node)) return node.forEach((n) => scan(n, parentKey));
	if (!node || typeof node !== "object") return;
	if (parentKey !== "properties" && Object.hasOwn(node, "example")) leftovers++;
	for (const [key, value] of Object.entries(node)) {
		if (key === "examples") continue;
		scan(value, key);
	}
})(doc, null);

fs.writeFileSync(outYaml, stringify(doc, { lineWidth: 0 }));
fs.writeFileSync(outJson, `${JSON.stringify(doc, null, 2)}\n`);
console.log(`schema examples: ${schemaCount}, named examples: ${namedCount}, leftovers: ${leftovers}`);
if (leftovers > 0) process.exit(1);
