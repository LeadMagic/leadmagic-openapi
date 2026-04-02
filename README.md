# LeadMagic OpenAPI Snapshot

This repository contains a maintained OpenAPI snapshot, LLM-friendly docs, and a live API smoke-test script for LeadMagic. It should stay aligned with the current LeadMagic MCP positioning, but it is an API snapshot repo rather than a full mirror of the MCP surface.

The authoritative product documentation is the public docs site:

- Docs: [https://leadmagic.io/docs](https://leadmagic.io/docs)
- Docs index: [https://leadmagic.io/docs/llms.txt](https://leadmagic.io/docs/llms.txt)
- Dashboard: [https://app.leadmagic.io](https://app.leadmagic.io)

## Status
The public API docs now use versioned routes under `/v1/...` and expose more endpoints than this repo currently models. This repo currently focuses on the 19 core endpoints already represented in the local OpenAPI files, plus current route mappings and a cleaner validation script.

If you need the full current product surface, treat `https://leadmagic.io/docs` as the source of truth.

## Companion Surfaces

LeadMagic's developer surface now spans a few aligned entry points:

- `leadmagic-openapi`: this repository, for schema snapshots and API-oriented docs
- LeadMagic MCP docs: https://leadmagic.io/docs/mcp/setup
- Hosted MCP endpoint: `https://mcp.leadmagic.io/mcp`
- Cursor plugin repo: `leadmagic-cursor-plugin`, which packages the hosted MCP flow for Cursor

This repo should stay aligned with the live MCP/API behavior, but it should not claim to be the only or most current product surface when the docs site has moved ahead.

## Current MCP Surface

The current LeadMagic MCP docs describe:

- 16 tools
- 1 shared docs resource: `leadmagic://docs`
- 2 built-in prompts

The MCP surface currently covers credits, people enrichment, company research, technographics, competitors, job-change detection, and jobs search.

Important distinction: the broader REST API and this OpenAPI snapshot include ad-search endpoints, but the current MCP tool surface does not expose those ad tools. Keep repo copy explicit about that difference.

## Files
- `leadmagic-openapi-3.1.yaml`: Local OpenAPI snapshot
- `leadmagic-openapi-3.1.json`: JSON form of the local snapshot
- `.spectral.yml`: OpenAPI lint configuration
- `llms.txt`: Short, current LLM-oriented overview
- `llms-full.txt`: Longer current LLM-oriented reference
- `test-api.ts`: Live smoke-test script against current documented `/v1/...` routes

## Authentication
All endpoints require an `X-API-Key` header.

```bash
curl 'https://api.leadmagic.io/v1/credits' \
  -H 'X-API-Key: YOUR_API_KEY'
```

Never commit API keys. Use `LEADMAGIC_API_KEY` or your own secrets manager.

## Base URL
`https://api.leadmagic.io`

Current docs group routes under:

- `/v1/credits`
- `/v1/people/*`
- `/v1/companies/*`
- `/v1/jobs/*`
- `/v1/ads/*`

## Current Route Map

| Legacy repo route | Current documented route |
| --- | --- |
| `POST /credits` | `GET /v1/credits` |
| `POST /email-validate` | `POST /v1/people/email-validation` |
| `POST /email-finder` | `POST /v1/people/email-finder` |
| `POST /personal-email-finder` | `POST /v1/people/personal-email-finder` |
| `POST /b2b-social-email` | `POST /v1/people/b2b-profile-email` |
| `POST /b2b-profile` | `POST /v1/people/b2b-profile` |
| `POST /mobile-finder` | `POST /v1/people/mobile-finder` |
| `POST /profile-search` | `POST /v1/people/profile-search` |
| `POST /role-finder` | `POST /v1/people/role-finder` |
| `POST /employee-finder` | `POST /v1/people/employee-finder` |
| `POST /company-search` | `POST /v1/companies/company-search` |
| `POST /company-funding` | `POST /v1/companies/company-funding` |
| `POST /jobs-finder` | `POST /v1/jobs/jobs-finder` |
| `GET /job-country` | `GET /v1/jobs/countries` |
| `GET /job-types` | `GET /v1/jobs/job-types` |
| `POST /google/searchads` | `POST /v1/ads/google-ads-search` |
| `POST /meta/searchads` | `POST /v1/ads/meta-ads-search` |
| `POST /b2b/searchads` | `POST /v1/ads/b2b-ads-search` |
| `POST /b2b/ad-details` | `POST /v1/ads/b2b-ads-details` |

## Credit Consumption

These values are aligned to the public docs as of this cleanup pass.

| Endpoint | Cost | Notes |
| --- | --- | --- |
| `GET /v1/credits` | 0 | Free, no rate limit called out |
| `POST /v1/people/email-validation` | 0.25 | 4 validations per credit |
| `POST /v1/people/email-finder` | 1 | Free on null result |
| `POST /v1/people/personal-email-finder` | 2 | Free if not found |
| `POST /v1/people/b2b-profile-email` | 5 | Free if not found |
| `POST /v1/people/b2b-profile` | 10 | Free if not found |
| `POST /v1/people/mobile-finder` | 5 | Free if not found |
| `POST /v1/people/profile-search` | 1 | Docs currently show 100 req/min |
| `POST /v1/people/role-finder` | 2 | Free if no match |
| `POST /v1/people/employee-finder` | 0.05 per employee | 20 employees per credit |
| `POST /v1/companies/company-search` | 1 | Free if not found |
| `POST /v1/companies/company-funding` | 4 | Free if not found |
| `POST /v1/jobs/jobs-finder` | 1 per job | Free if no jobs found |
| `GET /v1/jobs/countries` | 0 | Metadata |
| `GET /v1/jobs/job-types` | 0 | Metadata |
| `POST /v1/ads/google-ads-search` | 0.2 | 5 searches per credit |
| `POST /v1/ads/meta-ads-search` | 0.2 | 5 searches per credit |
| `POST /v1/ads/b2b-ads-search` | 0.2 | 5 searches per credit |
| `POST /v1/ads/b2b-ads-details` | 2 | Free if not found |

Docs-only endpoints not yet represented in the local snapshot include analytics, job change detection, technographics, competitors search, job company types, job industries, job regions, and credits helper endpoints.

## Use Case Examples

```javascript
// Sales prospecting workflow
await fetch("https://api.leadmagic.io/v1/people/email-finder", { /* ... */ });
await fetch("https://api.leadmagic.io/v1/people/email-validation", { /* ... */ });
await fetch("https://api.leadmagic.io/v1/companies/company-search", { /* ... */ });
```

```javascript
// Recruiting workflow
await fetch("https://api.leadmagic.io/v1/people/role-finder", { /* ... */ });
await fetch("https://api.leadmagic.io/v1/people/employee-finder", { /* ... */ });
await fetch("https://api.leadmagic.io/v1/people/profile-search", { /* ... */ });
```

```javascript
// Competitive intelligence workflow
await fetch("https://api.leadmagic.io/v1/companies/company-funding", { /* ... */ });
await fetch("https://api.leadmagic.io/v1/jobs/jobs-finder", { /* ... */ });
await fetch("https://api.leadmagic.io/v1/ads/google-ads-search", { /* ... */ });
```

## Testing & Validation

Set your API key or let the script prompt you securely at runtime:

```bash
export LEADMAGIC_API_KEY=your-api-key-here
npm install
npm run test:api
```

Or run the script without exporting the key first:

```bash
npm install
npm run test:api
```

The script will prompt for the key in an interactive terminal with hidden input, will not print the key back to the console, and uses the current documented `/v1/...` endpoints to print per-endpoint status, key fields, compact response previews, and a final pass/fail summary.

The default smoke-test fixtures now use live, overridable values instead of placeholder domains, because some endpoints reject placeholders such as `example.com` with validation errors. You can override them with `LEADMAGIC_TEST_COMPANY_NAME`, `LEADMAGIC_TEST_COMPANY_DOMAIN`, `LEADMAGIC_TEST_WORK_EMAIL`, `LEADMAGIC_TEST_PROFILE_URL`, and `LEADMAGIC_TEST_AD_URL`.

Useful flags:

```bash
# Only run one endpoint group
npm run test:api -- --group people

# Write a JSON report without storing the API key
npm run test:api -- --report reports/smoke-test.json

# Combine both
npm run test:api -- --group companies --report reports/companies.json
```

The report file includes status, summary fields, credits consumed, preview data, and pass/fail results. It does not include the API key or request headers.

## Notes On Field Shapes

The current docs are no longer uniformly snake_case across every endpoint. Some responses remain snake_case while others use mixed or camelCase field names in examples. Do not assume a single naming convention across the entire API surface without checking the endpoint-specific docs.

## OpenAPI 3.1 Notes

This snapshot now follows the key OpenAPI 3.1 and JSON Schema 2020-12 patterns recommended by Zuplo/OpenAPI migration guidance:

- declares `jsonSchemaDialect`
- uses JSON Schema union types like `["string", "null"]` instead of `nullable: true`
- uses `examples` arrays instead of legacy `example`
- keeps YAML and JSON snapshots synchronized

Lint the spec with:

```bash
npm install
npm run lint:openapi
```

## Cursor And MCP Alignment

If you update route names, auth expectations, pricing notes, or endpoint coverage here, keep those changes consistent with:

- the hosted MCP setup docs
- the MCP tool reference
- and the public Cursor plugin package

## Support
- API docs: [https://leadmagic.io/docs](https://leadmagic.io/docs)
- Official site: [https://leadmagic.io](https://leadmagic.io)
- Support: [support@leadmagic.io](mailto:support@leadmagic.io)

## License
MIT
