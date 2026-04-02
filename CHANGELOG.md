# Changelog

All notable changes to the LeadMagic OpenAPI specification will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Synced top-level repository docs to the current `leadmagic.io/docs` route layout under `/v1/...`
- Reworked the smoke-test utility as `test-api.ts` with typed test cases, secure interactive API-key entry, compact output previews, and pass/fail reporting against current documented endpoints
- Updated LLM-oriented docs to stop claiming full parity with the public docs when docs-only endpoints now exist outside this local snapshot
- Clarified how this OpenAPI snapshot aligns with the hosted MCP setup and the public Cursor plugin package
- Clarified that the current MCP surface includes competitors, technographics, and job-change tooling, while ad-search endpoints remain part of the broader API snapshot rather than the current MCP tool set
- Removed stale blanket claims that all current responses use uniform snake_case naming

### Clarified
- This repository still models the 19 core endpoints already present locally, while the live docs currently expose additional APIs such as analytics, technographics, competitors search, and extra jobs metadata endpoints

## [1.0.0] - 2025-01-26

### Added
- 🎯 Complete OpenAPI 3.1 specification for LeadMagic API
- 📋 Full documentation for all 19 API endpoints:
  - Credits management
  - Email services (validation, finding, enrichment)
  - Mobile & contact services
  - Profile & people services
  - Company services (search, funding intelligence)
  - Jobs services (search, metadata)
  - Advertisement intelligence (Google, Meta, B2B)
- ✨ 249 comprehensive examples in OpenAPI 3.1 format
- 🔐 Secure testing framework with environment variable configuration
- 📚 Platform-agnostic documentation (no vendor lock-in)
- 🧪 Comprehensive test suite for all endpoints
- 💰 Transparent credit cost documentation
- 🛠️ Developer-friendly features:
  - Copy-paste ready curl examples
  - Real API response examples
  - Multi-language code generation support
  - Rate limiting documentation
  - Complete error handling specifications

### Features
- **Authentication**: API key-based authentication via `X-API-Key` header
- **Rate Limiting**: 300 requests/minute for profile search
- **Field Naming**: Consistent snake_case throughout
- **HTTP Methods**: POST for all data endpoints, GET for metadata
- **Error Handling**: Standardized error response format
- **Security**: Environment variable configuration, no hardcoded credentials

### Technical Details
- **OpenAPI Version**: 3.1.0
- **JSON Schema**: 2020-12 support
- **File Formats**: Both YAML (60,883 bytes) and JSON (90,756 bytes)
- **Examples**: All using OpenAPI 3.1 `examples` format (no legacy `example` fields)
- **Validation**: Complete schema validation for all endpoints

### Documentation
- Complete API reference with 19 endpoints
- Use case examples for sales, recruitment, and business intelligence
- Environment setup instructions
- Credit consumption breakdown
- Platform-agnostic B2B profile integration
- Comprehensive testing and validation guide

### Repository Setup
- MIT License
- Contributing guidelines
- GitHub issue templates (bug reports, feature requests, documentation)
- GitHub Actions for automated validation
- Professional repository metadata with topics and description

## Credit Costs

| Endpoint | Credits | Notes |
|----------|---------|--------|
| `/credits` | 0 | Free to check |
| `/email-validate` | 0.05 | 20 validations per credit |
| `/email-finder` | 1 | Per email found |
| `/mobile-finder` | 5 | Per mobile found |
| `/profile-search` | 1 | Public profiles only |
| `/b2b-profile` | 10 | Reverse lookup premium |
| `/personal-email-finder` | 1 | Per email found |
| `/b2b-social-email` | 1 | Per email found |
| `/role-finder` | 0-1 | Only if found |
| `/employee-finder` | 1 | Per request |
| `/company-search` | 1 | Per search |
| `/company-funding` | 4 | Premium intelligence |
| `/jobs-finder` | 1 per job | Per job returned |
| `/google/searchads` | 1 per ad | Per ad found |
| `/meta/searchads` | 1 per ad | Per ad found |
| `/b2b/searchads` | 1 per ad | Per ad found |
| `/b2b/ad-details` | 2 | Per ad detail |
| `/job-country` | 0 | Metadata endpoint |
| `/job-types` | 0 | Metadata endpoint |

---

### Notes
- All costs verified against official LeadMagic documentation
- Specification tested against live API with provided API key
- Platform-agnostic documentation maintains functionality while removing vendor lock-in
