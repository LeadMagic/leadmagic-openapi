import assert from 'node:assert/strict';
import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import YAML from 'yaml';

const spec = JSON.parse(fs.readFileSync('leadmagic-openapi-3.1.json', 'utf8'));
const yaml = YAML.parse(fs.readFileSync('leadmagic-openapi-3.1.yaml', 'utf8'));
const approved = JSON.parse(fs.readFileSync('public-surface.json', 'utf8'));
assert.ok(isDeepStrictEqual(yaml, spec), 'YAML and JSON must describe exactly the same contract');
assert.equal(spec.openapi, '3.1.0');
assert.deepEqual(spec.servers.map(s => s.url), ['https://api.leadmagic.io']);
assert.ok(isDeepStrictEqual(spec.security, [{ ApiKeyAuth: [] }]), 'Global API-key authentication must be required');
const auth = spec.components?.securitySchemes?.ApiKeyAuth;
assert.ok(auth?.type === 'apiKey' && auth.in === 'header' && auth.name === 'X-API-Key', 'Public REST authentication must use X-API-Key');
const methods = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options']);
const actual = [];
const ids = new Set();
for (const [path, item] of Object.entries(spec.paths)) {
  assert.ok(!/(?:^|\/)(?:admin|internal|debug|private)(?:\/|$)/i.test(path), 'Non-public path detected');
  for (const [method, op] of Object.entries(item)) {
    if (!methods.has(method)) continue;
    actual.push(`${method.toUpperCase()} ${path}`);
    assert.ok(op.operationId && !ids.has(op.operationId), `Missing/duplicate operationId: ${method} ${path}`);
    ids.add(op.operationId);
    assert.ok(!op.security || isDeepStrictEqual(op.security, spec.security), `Authentication changed: ${path}`);
    assert.ok(!op.requestBody?.content?.['application/json']?.schema?.properties?.preview, `App-only request option: ${path}`);
  }
}
assert.deepEqual(actual.sort(), approved.operations, 'Review public documentation and explicitly approve route changes');
function visit(value) {
  if (!value || typeof value !== 'object') return;
  if (value.$ref) {
    assert.ok(value.$ref.startsWith('#/'), 'Only local schema references are allowed');
    const target = value.$ref.slice(2).split('/').reduce((v, k) => v?.[k.replaceAll('~1', '/').replaceAll('~0', '~')], spec);
    assert.notEqual(target, undefined, `Broken schema reference: ${value.$ref}`);
  }
  if (value.servers) for (const server of value.servers) assert.equal(server.url, 'https://api.leadmagic.io');
  for (const nested of Object.values(value)) visit(nested);
}
visit(spec);
console.log(`Public contract validated: ${Object.keys(spec.paths).length} paths, ${actual.length} operations; YAML/JSON match.`);

// Public sample payloads must never copy real contact records or profile URLs.
function checkSamples(value, insideSample = false) {
  if (typeof value === 'string' && insideSample) {
    for (const email of value.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) ?? []) {
      assert.ok(/@(?:[a-z0-9.-]+\.)?example\.(com|org|net)$/i.test(email), 'Use reserved example domains in sample email addresses');
    }
    for (const url of value.match(/https?:\/\/[^\s"<>]+/g) ?? []) {
      const host = new URL(url).hostname;
      assert.ok(/^(?:[a-z0-9-]+\.)*example\.(com|org|net)$/i.test(host), 'Use synthetic profile URLs in sample payloads');
    }
  }
  if (Array.isArray(value)) value.forEach(item => checkSamples(item, insideSample));
  else if (value && typeof value === 'object') for (const [key, nested] of Object.entries(value)) {
    checkSamples(nested, insideSample || key === 'examples' || key === 'example');
  }
}
checkSamples(spec);
