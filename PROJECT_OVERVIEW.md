# LeadMagic OpenAPI Snapshot - Project Overview

## Mission
Keep this repository useful as a developer-facing snapshot of the LeadMagic API while clearly deferring to `https://leadmagic.io/docs` as the live source of truth.

## Current Scope
- Preserve the 19 core endpoints already represented in this repo
- Keep top-level docs aligned to the current `/v1/...` route layout
- Provide a smoke-test script that exercises current documented endpoints
- Offer LLM-friendly summaries that do not repeat outdated path or pricing data

## Important Constraints
- The public docs currently expose more endpoints than this repo models
- Some endpoint response examples in the public docs now mix snake_case and camelCase
- This repo should avoid claiming complete or perfect parity unless that has been revalidated end-to-end
- This repo should stay aligned with the hosted MCP setup and Cursor plugin language when auth, routes, or pricing notes change
- This repo should distinguish between the broader REST API surface and the smaller current MCP tool surface

## Primary Users
- Developers integrating LeadMagic from custom applications
- AI assistants and MCP tools that need a compact endpoint overview
- Maintainers validating whether core routes still work against production

## Main Workflows

### Sales Enrichment
`email-finder -> email-validation -> company-search`

### Recruiting
`role-finder -> employee-finder -> profile-search`

### Competitive Research
`company-funding -> jobs-finder -> ads search endpoints`

## What "Good" Means For This Repo
- Top-level docs match the current public route structure
- Top-level docs describe MCP alignment without implying that every API endpoint is available as an MCP tool
- Credit/pricing notes are not obviously stale
- The smoke test script uses current documented endpoints
- Repo copy does not over-claim full coverage when the public docs have moved ahead

## Recommended Next Step
If full parity is needed, refresh `leadmagic-openapi-3.1.yaml` and `leadmagic-openapi-3.1.json` from the current published API definition and then regenerate examples from the live docs.