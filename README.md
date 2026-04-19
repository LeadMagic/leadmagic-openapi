# LeadMagic OpenAPI Snapshot

This repository contains a maintained OpenAPI snapshot, LLM-friendly docs, and a live API smoke-test script for LeadMagic. It should stay aligned with the current LeadMagic MCP positioning, but it is an **API / REST** snapshot repo—not a mirror of the full Cursor plugin bundle.

**Pairing:** For **Cursor** and hosted **MCP** (OAuth by default), use the official plugin repo: [github.com/LeadMagic/leadmagic-cursor-plugin](https://github.com/LeadMagic/leadmagic-cursor-plugin). That package follows the usual Cursor plugin layout (rules, skills, **agent**, **commands**, and MCP)—similar in shape to community examples such as [encoredev/cursor-plugin](https://github.com/encoredev/cursor-plugin), but with **remote HTTP MCP** to LeadMagic’s cloud instead of a local stdio server.

The authoritative product documentation is the public docs site:

- Docs: [https://leadmagic.io/docs](https://leadmagic.io/docs)
- Docs index: [https://leadmagic.io/docs/llms.txt](https://leadmagic.io/docs/llms.txt)
- Dashboard: [https://app.leadmagic.io](https://app.leadmagic.io)

## Status
The public API docs now use versioned routes under `/v1/...` and expose more endpoints than this repo currently models. This repo currently focuses on the 19 core endpoints already represented in the local OpenAPI files, plus current route mappings and a cleaner validation script.

If you need the full current product surface, treat `https://leadmagic.io/docs` as the source of truth.

## Companion surfaces

LeadMagic's developer surface spans a few aligned entry points:

| Surface | Repository / URL | Use when |
| --- | --- | --- |
| **REST OpenAPI snapshot** | **This repo** — [github.com/LeadMagic/leadmagic-openapi](https://github.com/LeadMagic/leadmagic-openapi) | Integrating `https://api.leadmagic.io`, codegen, LLM context from `llms.txt`, or running `test-api` smoke tests |
| **Cursor plugin + MCP config** | [github.com/LeadMagic/leadmagic-cursor-plugin](https://github.com/LeadMagic/leadmagic-cursor-plugin) | Installing LeadMagic in Cursor (marketplace or team marketplace), OAuth-default `mcp.json`, skills, rules, enrichment **agent**, and **commands** |
| **MCP endpoint** | `https://mcp.leadmagic.io/mcp` | Any MCP client (Cursor, AI SDK, etc.) after auth |
| **Product docs** | [leadmagic.io/docs](https://leadmagic.io/docs), [MCP setup](https://leadmagic.io/docs/mcp/setup) | Authoritative behavior, pricing, and tool reference |

This repo should stay aligned with live API behavior, but [leadmagic.io/docs](https://leadmagic.io/docs) remains the source of truth when the product moves ahead of the snapshot.

## Hosted MCP tool surface (Cursor)

The public **hosted MCP** exposes **10 tools** (a subset of the REST API), plus:

- 1 shared docs resource: `leadmagic://docs`
- 2 built-in prompts (for example `account_research`, `contact_lookup`)

| MCP tool | Typical REST backing (see docs / OpenAPI) |
| --- | --- |
| `check_credit_balance` | `GET /v1/credits` |
| `validate_work_email` | `POST /v1/people/email-validation` |
| `find_work_email` | `POST /v1/people/email-finder` |
| `find_mobile_number` | `POST /v1/people/mobile-finder` |
| `linkedin_profile_to_work_email` | `POST /v1/people/b2b-profile-email` |
| `detect_job_change` | Job-change detector endpoint (see product docs) |
| `research_account` | Company search + funding (e.g. `/v1/companies/...`) |
| `list_company_competitors` | Competitors endpoint |
| `get_company_technographics` | Technographics endpoint |
| `find_people_by_role` | `POST /v1/people/role-finder` |

**Important:** This OpenAPI snapshot includes **jobs** and **ads** routes and other endpoints that are **not** exposed as MCP tools today. When updating copy here, keep that gap explicit and cross-check [leadmagic-cursor-plugin](https://github.com/LeadMagic/leadmagic-cursor-plugin) and [MCP tools docs](https://leadmagic.io/docs/mcp/tools).

## Hosted MCP sign-in

Connect any MCP-compatible client to LeadMagic at:

```
https://mcp.leadmagic.io/mcp
```

The public client discovery manifest (canonical source for per-client install snippets) lives at [`https://mcp.leadmagic.io/clients`](https://mcp.leadmagic.io/clients).

### Authentication modes

OAuth (Authorization Code + PKCE, S256) is the recommended path — your MCP client opens a browser, you sign in through Clerk, and a short-lived bearer token is returned. Static API-key headers are supported as a fallback for environments where OAuth is blocked.

| Mode | How it works | When to use |
| --- | --- | --- |
| **OAuth via Dynamic Client Registration (DCR)** | Client auto-registers at `https://mcp.leadmagic.io/oauth/register`, then runs the standard OAuth 2.1 flow. | Default path for Cursor, Claude, VS Code/Copilot, Amazon Q, Gemini CLI, and any client that implements MCP OAuth + DCR. |
| **OAuth with the static public client** | Skip DCR and reuse the published public client. Client ID: `4b9eLjoGVCJ1Dvnc`, secret: _(blank — PKCE)_. Consent screen shows **LeadMagic MCP & CLI (static)**. | Workspaces that block DCR but still want browser OAuth (e.g. legacy Claude.ai connectors). |
| **API key header** | Send `x-leadmagic-key: <YOUR_API_KEY>` on every MCP request. | CI, server-to-server agents, AI SDK tools, and clients that don't support OAuth yet. |
| **Bearer token** | Send `Authorization: Bearer <YOUR_LEADMAGIC_TOKEN>`. | When you've already minted a `lm-ui` token (e.g. from Claude Code's `/mcp` sign-in) and want to pass it to another runtime. |

OAuth metadata (for clients that need it explicitly):

- Authorization server: `https://mcp.leadmagic.io/.well-known/oauth-authorization-server`
- Protected resource: `https://mcp.leadmagic.io/.well-known/oauth-protected-resource/mcp`
- Registration endpoint: `https://mcp.leadmagic.io/oauth/register`
- Scopes: `openid profile email offline_access`
- Issuer: `https://clerk.leadmagic.io` (Clerk-hosted OAuth 2.1 + OIDC)

### Cursor

Use the official plugin whenever possible — it ships `mcp.json`, rules, skills, an enrichment agent, and commands together:

- Marketplace / local install: [github.com/LeadMagic/leadmagic-cursor-plugin](https://github.com/LeadMagic/leadmagic-cursor-plugin)

If you'd rather wire it up by hand, Cursor v0.48+ accepts a URL-only remote MCP entry (Cursor handles OAuth + DCR internally — fully quit and reopen Cursor after saving):

```json
{
  "mcpServers": {
    "leadmagic": {
      "url": "https://mcp.leadmagic.io/mcp"
    }
  }
}
```

- Project scope: `.cursor/mcp.json` at the project root
- User scope: `~/.cursor/mcp.json`

When OAuth is blocked, use the API-key variant and read the key from the environment (never commit the literal key):

```json
{
  "mcpServers": {
    "leadmagic": {
      "type": "http",
      "url": "https://mcp.leadmagic.io/mcp",
      "headers": {
        "x-leadmagic-key": "${LEADMAGIC_API_KEY}"
      }
    }
  }
}
```

### Other MCP clients

All of these speak the same streamable-HTTP transport against `https://mcp.leadmagic.io/mcp`. The discovery endpoint at [`/clients`](https://mcp.leadmagic.io/clients) returns the exact, per-client JSON/CLI snippet (with the right config file name and location) and is the source of truth if a client's CLI changes shape.

| Client | Recommended auth | Notes |
| --- | --- | --- |
| Claude Desktop / Claude.ai | OAuth | Remote MCP must be added via **Customize → Connectors** on claude.ai — not via `claude_desktop_config.json`. |
| Claude Code CLI | OAuth | `claude mcp add --transport http leadmagic https://mcp.leadmagic.io/mcp`, then `/mcp` to sign in. |
| ChatGPT (Developer Mode) / Responses API | OAuth (DCR, PKCE) for ChatGPT; API key for Responses API server SDK | ChatGPT registers callbacks like `https://chatgpt.com/connector/oauth/{callback_id}`. |
| VS Code / GitHub Copilot | OAuth | Uses the `servers` key (VS Code convention) — not `mcpServers` (Cursor-only). |
| Windsurf, Zed, Cline, Roo Code, Continue, Amp, Augment, JetBrains | API key header | All accept `x-leadmagic-key`; most also support OAuth DCR. |
| OpenCode | Bearer token | Uses `Authorization: Bearer` and `"oauth": false` in `opencode.json`. |
| Gemini CLI | API key header | `gemini mcp add --transport http leadmagic https://mcp.leadmagic.io/mcp -H "x-leadmagic-key: YOUR_API_KEY"`. |
| Amazon Q Developer, GitHub Copilot Coding Agent | API key header | Copilot Coding Agent snippet goes into the repo's **Settings → Copilot → Coding agent** MCP config. |

### Vercel AI SDK

For programmatic access from AI SDK agents and apps (server-side), use a per-request API key header:

```ts
import { createMCPClient } from "@ai-sdk/mcp";

const leadmagicMcp = await createMCPClient({
  transport: {
    type: "http",
    url: "https://mcp.leadmagic.io/mcp",
    headers: {
      "x-leadmagic-key": process.env.LEADMAGIC_API_KEY!,
    },
    redirect: "error",
  },
});

try {
  const tools = await leadmagicMcp.tools();
  // Pass `tools` into generateText, streamText, or your agent runtime.
} finally {
  await leadmagicMcp.close();
}
```

### Security reminders

- Never commit real API keys or bearer tokens. Use `LEADMAGIC_API_KEY` (or another secret store) and reference it with `${LEADMAGIC_API_KEY}` in committed config.
- The static OAuth client ID (`4b9eLjoGVCJ1Dvnc`) is **public by design** (PKCE, no secret). Do not treat it as a credential.
- Only install LeadMagic-branded MCP servers, skills, or plugins from the official locations listed in [`SECURITY.md`](SECURITY.md). The authoritative install paths are `github.com/LeadMagic/*` and `mcp.leadmagic.io`.

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

## Cursor and MCP alignment

If you update route names, auth expectations, pricing notes, or endpoint coverage here, keep those changes consistent with:

- [LeadMagic MCP setup](https://leadmagic.io/docs/mcp/setup) and [MCP tools](https://leadmagic.io/docs/mcp/tools) on the docs site
- [LeadMagic Cursor plugin](https://github.com/LeadMagic/leadmagic-cursor-plugin) (`mcp.json`, OAuth-default auth, README, and changelog)
- Hosted MCP: `https://mcp.leadmagic.io/mcp` and discovery at `https://mcp.leadmagic.io/clients`

## Support
- API docs: [https://leadmagic.io/docs](https://leadmagic.io/docs)
- Official site: [https://leadmagic.io](https://leadmagic.io)
- Support: [support@leadmagic.io](mailto:support@leadmagic.io)

## License
MIT
