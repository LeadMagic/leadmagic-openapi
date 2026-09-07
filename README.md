# LeadMagic OpenAPI — B2B enrichment and search API

OpenAPI 3.1 JSON and YAML for the documented LeadMagic REST API: people and company enrichment, email finding and validation, search, jobs, advertising, and bulk workflows. Import the specification into API tooling or use it to generate a client.

[Documentation](https://leadmagic.io/docs) · [Published schema](https://leadmagic.io/docs/api-reference/openapi.yml) · [Dashboard](https://app.leadmagic.io)

## Public contract

This snapshot contains 81 reviewed public paths. The route inventory matches the published schema checked on 2026-09-06. App-only request options are excluded. This repository does not publish backend router inventories, infrastructure URLs, administrative routes, credentials, or private implementation contracts.

`public-surface.json` records the approved methods and paths. Adding an operation requires an explicit manifest update and review against public product documentation. `npm run check:public` checks that inventory, authentication, references, server origins, and YAML/JSON equality. A route being present in an internal codebase is not authorization to publish it.

Public batch-provider registration configures a customer's external provider; it does not reveal LeadMagic's private supplier infrastructure. Endpoint visibility is not an access control: the deployed API must enforce authentication and authorization independently.

## Authentication

Set `LEADMAGIC_API_KEY` through your shell or secret manager, then make a free balance request:

```bash
curl --fail-with-body 'https://api.leadmagic.io/v1/credits' \
  -H "X-API-Key: ${LEADMAGIC_API_KEY}"
```

Do not put API keys or customer response data into public issues, examples, or reports.

## Base URL

`https://api.leadmagic.io`

For hosted MCP, use [OAuth setup](https://leadmagic.io/docs/mcp/setup) at `https://mcp.leadmagic.io/mcp`. For the terminal, install [lm-tui](https://leadmagic.io/docs/cli/installation) and run `lm login`. REST API keys are not needed for those normal OAuth flows.

## Credit Consumption

Costs vary by endpoint and account entitlement. Read [credits documentation](https://leadmagic.io/docs/v1/credits) and check `GET /v1/credits` before large runs. The [agent guide](https://leadmagic.io/docs/mcp/agent-guide) explains search entitlements, cursor pagination, and paid contact unlocks.

Email Finder returns validated work emails. Email Validation is for addresses obtained elsewhere; avoid paying to revalidate a fresh finder result.

## Use Case Examples

- Find a work email: `POST /v1/people/email-finder`.
- Validate an existing email: `POST /v1/people/email-validation`.
- Enrich a company: `POST /v1/companies/company-search`.
- Search people, companies, or jobs: the documented `/v3/*/search` operations.

Consult each operation's request schema for required fields. Response shapes and credit costs vary by operation.

## Testing & Validation

```bash
npm ci --ignore-scripts
npm run check:public
npm run lint:openapi
npm run typecheck
```

The optional live smoke script requires your own API key:

```bash
npm run test:api                       # free credits check only
npm run test:api -- --group companies  # explicit paid endpoint group
npm run test:api -- --group credits --report reports/credits.json
```

Paid groups can consume credits and require suitable fixtures. Configure `LEADMAGIC_TEST_COMPANY_NAME`, `LEADMAGIC_TEST_COMPANY_DOMAIN`, `LEADMAGIC_TEST_WORK_EMAIL`, `LEADMAGIC_TEST_PROFILE_URL`, and `LEADMAGIC_TEST_AD_URL` for data you are authorized to use. Placeholder profile and ad URLs are not live test fixtures.

Reports retain HTTP status, result shape, and credit accounting while omitting response values and payloads. No live paid requests run in CI. `reports/` is ignored by Git.

## Files

- `leadmagic-openapi-3.1.yaml` and `.json`: equivalent API snapshots.
- `public-surface.json`: reviewed public methods and paths.
- `llms.txt` and `llms-full.txt`: public documentation entry points.
- `scripts/check-public-surface.mjs`: contract and publication checks.
- `test-api.ts`: optional live smoke tests.

## Related integrations

| Repository | Purpose |
| --- | --- |
| [leadmagic-openapi](https://github.com/LeadMagic/leadmagic-openapi) | Public REST API specification and validation |
| [leadmagic-n8n](https://github.com/LeadMagic/leadmagic-n8n) | n8n community node for enrichment workflows |
| [leadmagic-cursor-plugin](https://github.com/LeadMagic/leadmagic-cursor-plugin) | Cursor plugin using hosted MCP |
| [leadmagic-claude-plugin](https://github.com/LeadMagic/leadmagic-claude-plugin) | Claude Code plugin using hosted MCP |
| [leadmagic-skills](https://github.com/LeadMagic/leadmagic-skills) | LeadMagic API and workflow skills |
| [gtm-skills](https://github.com/LeadMagic/gtm-skills) | Go-to-market playbooks and agent skills |
| [leadmagic-mcp](https://github.com/LeadMagic/leadmagic-mcp) | Local stdio MCP integration for the documented enrichment subset |

## Security and support

See [SECURITY.md](SECURITY.md). Report vulnerabilities privately to [security@leadmagic.io](mailto:security@leadmagic.io); send product questions to [support@leadmagic.io](mailto:support@leadmagic.io).

MIT licensed.
