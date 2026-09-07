import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import YAML from 'yaml';
const root = fileURLToPath(new URL('../', import.meta.url));
function validate(mutate, mismatch=false) {
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'leadmagic-contract-'));
 try {
  const spec=JSON.parse(fs.readFileSync(path.join(root,'leadmagic-openapi-3.1.json')));
  mutate(spec);
  fs.writeFileSync(path.join(tmp,'leadmagic-openapi-3.1.json'),JSON.stringify(spec));
  fs.writeFileSync(path.join(tmp,'leadmagic-openapi-3.1.yaml'),YAML.stringify(mismatch?{}:spec));
  fs.copyFileSync(path.join(root,'public-surface.json'),path.join(tmp,'public-surface.json'));
  return spawnSync(process.execPath,[path.join(root,'scripts/check-public-surface.mjs')],{cwd:tmp,encoding:'utf8'}).status;
 } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
}
test('reviewed contract passes',()=>assert.equal(validate(()=>{}),0));
test('schema drift fails',()=>assert.notEqual(validate(()=>{},true),0));
test('new unreviewed operations fail',()=>assert.notEqual(validate(s=>{s.paths['/unreviewed']={get:{operationId:'unreviewed',responses:{200:{description:'OK'}}}};}),0));
test('alternate server origin fails',()=>assert.notEqual(validate(s=>{s.servers=[{url:'https://example.com'}];}),0));
test('anonymous operation fails',()=>assert.notEqual(validate(s=>{s.paths['/v1/credits'].get.security=[];}),0));
test('broken references fail',()=>assert.notEqual(validate(s=>{s.paths['/v1/credits'].get.responses['200']={$ref:'#/components/responses/Missing'};}),0));
test('app-only options fail',()=>assert.notEqual(validate(s=>{s.paths['/v3/companies/lookalike'].post.requestBody.content['application/json'].schema.properties.preview={type:'boolean'};}),0));

test('anonymous alternative fails',()=>assert.notEqual(validate(s=>{s.paths['/v1/credits'].get.security=[{}];}),0));
