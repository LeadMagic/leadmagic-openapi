# Security Policy

## 🔐 Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🧩 Third-party skills, plugins, agents, and MCP servers

LeadMagic is commonly targeted by **impersonation / brand-squatting** attempts that try to get users to install unofficial "LeadMagic" skills, Claude Code / Cursor plugins, agent bundles, MCP servers, or CLIs. These often look like helpful contributions ("here's an `npx` command to add a LeadMagic skill") and arrive via GitHub issues, social media, blog posts, or AI-chat suggestions.

**Treat every third-party install command as full arbitrary code execution on your machine.** Skills / plugins / agents typically run inside your editor's trust boundary and can read `.env` files, exfiltrate credentials, run shell commands, and modify code.

### Official LeadMagic installer allow-list

These are the **only** GitHub owners, domains, and install paths we publish. Anything else claiming to be LeadMagic is unofficial.

| Kind | Official location | Notes |
| --- | --- | --- |
| GitHub org | `https://github.com/LeadMagic` | Exact capitalization. **Not** `lead-magic`, `leadmagic-io`, `leadmagic-team`, `leadmagic-labs`, `sales-skills`, or any other variant. |
| REST / OpenAPI repo | `https://github.com/LeadMagic/leadmagic-openapi` | This repo. |
| Cursor plugin + MCP config | `https://github.com/LeadMagic/leadmagic-cursor-plugin` | |
| Official skills repo | `https://github.com/LeadMagic/leadmagic-skills` | Only LeadMagic-branded skill is `skills/leadmagic-api/`. |
| Hosted MCP endpoint | `https://mcp.leadmagic.io/mcp` | OAuth-default. |
| MCP client discovery | `https://mcp.leadmagic.io/clients` | Canonical per-client install snippets. |
| OAuth authorization server metadata | `https://mcp.leadmagic.io/.well-known/oauth-authorization-server` | Issuer is `https://clerk.leadmagic.io`. |
| OAuth protected resource metadata | `https://mcp.leadmagic.io/.well-known/oauth-protected-resource/mcp` | |
| OAuth DCR endpoint | `https://mcp.leadmagic.io/oauth/register` | |
| Static public OAuth client ID | `4b9eLjoGVCJ1Dvnc` | Public by design (PKCE, no secret). Consent screen shows **LeadMagic MCP & CLI (static)**. Not a credential. |
| REST API base URL | `https://api.leadmagic.io` | No other production base URL. |
| Product docs | `https://leadmagic.io/docs` | Source of truth. |
| Dashboard | `https://app.leadmagic.io` | |
| Support email | `support@leadmagic.io` | |
| Security email | `security@leadmagic.io` | |

If an install snippet references **any** other owner, npm scope, domain, or MCP host and claims to be a LeadMagic integration, it is not from us.

### Known impersonation attempts

- `sales-skills/sales` / `sales-leadmagic` (GitHub org `sales-skills`, user `@ggarcia196x`) — see [issue #5](https://github.com/LeadMagic/leadmagic-openapi/issues/5). Reported to GitHub Trust & Safety.

### How to verify before installing anything "LeadMagic"

1. Confirm the GitHub owner is literally `LeadMagic`.
2. Confirm the repo is linked from `https://leadmagic.io/docs` **or** from this repo's README / the `leadmagic-cursor-plugin` README.
3. When in doubt, email `security@leadmagic.io`.

### Report a suspected impersonation

Please email `security@leadmagic.io` with:

- Link(s) to the impersonating repo / package / site.
- The install command or distribution path.
- Where you encountered it (issue, tweet, blog, AI chat suggestion, etc.).
- Any evidence of intent to deceive (use of our brand, logos, product language).

You can also open a **Third-party plugin / skill impersonation report** issue from the issue templates in this repo.

### If you already installed something unofficial

1. Stop the editor / agent session that loaded it.
2. Remove the bundle (`~/.agents/skills/`, `~/.cursor/`, project-local `.cursor/`, `.claude/`, etc.).
3. Rotate credentials: `LEADMAGIC_API_KEY`, cloud provider keys, GitHub tokens, npm tokens, SSH keys without passphrases.
4. Inspect shell rc files, `~/.npmrc`, cron/launchd, and any open repos for unexpected diffs.
5. Email `security@leadmagic.io` with what ran and when.

## 🛡️ Reporting a Vulnerability

### API Security Issues

If you discover a security vulnerability in the LeadMagic API itself, please report it directly to LeadMagic:

- **Email**: [security@leadmagic.io](mailto:security@leadmagic.io)
- **Subject Line**: "Security Vulnerability Report - API"

### Documentation Security Issues

For security issues related to this OpenAPI specification or documentation:

1. **DO NOT** create a public GitHub issue
2. **Email us directly** at [security@leadmagic.io](mailto:security@leadmagic.io)
3. **Subject Line**: "Security Vulnerability Report - OpenAPI Spec"

### What to Include

Please provide the following information:

- **Type of issue** (e.g., API key exposure, injection vulnerability, etc.)
- **Location** (specific endpoint, documentation section, file)
- **Description** of the vulnerability
- **Steps to reproduce** the issue
- **Potential impact** assessment
- **Suggested fix** (if you have one)

## 🚀 Response Timeline

- **Initial Response**: Within 24 hours
- **Investigation**: Within 72 hours
- **Fix Development**: Depends on severity (hours to days)
- **Public Disclosure**: After fix is deployed and verified

## 🏆 Recognition

We appreciate security researchers who help us keep our documentation and API secure:

- Security researchers will be credited in our security acknowledgments
- Significant findings may be eligible for a bug bounty (contact us for details)

## 🔒 Security Best Practices

### For API Users

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive configuration
3. **Rotate API keys regularly**
4. **Implement rate limiting** in your applications
5. **Validate all API responses** before processing
6. **Use HTTPS** for all API communications
7. **Store credentials securely** (e.g., using secrets management)

### For This Repository

1. **No hardcoded credentials** in any files
2. **Environment variable configuration** required
3. **GitHub secrets** for CI/CD sensitive data
4. **Regular dependency updates**
5. **Automated security scanning**

## 🚨 Common Security Issues

### ❌ What NOT to do:

```javascript
// DON'T: Hardcode API keys
const apiKey = "your-actual-api-key-here";

// DON'T: Log API keys
console.log("Using API key:", process.env.API_KEY);

// DON'T: Store in plaintext files
// api-key.txt: your-actual-api-key-here
```

### ✅ What TO do:

```javascript
// DO: Use environment variables
const apiKey = process.env.LEADMAGIC_API_KEY;
if (!apiKey) {
  throw new Error("LEADMAGIC_API_KEY environment variable is required");
}

// DO: Validate responses
const response = await fetch(url, { headers: { 'X-API-Key': apiKey } });
if (!response.ok) {
  throw new Error(`API error: ${response.status}`);
}

// DO: Use secure headers
const headers = {
  'X-API-Key': apiKey,
  'Content-Type': 'application/json',
  'User-Agent': 'YourApp/1.0.0'
};
```

## 📋 Security Checklist

Before contributing to this repository:

- [ ] No hardcoded API keys or sensitive data
- [ ] Environment variables used for configuration
- [ ] All external URLs use HTTPS
- [ ] No sensitive data in commit history
- [ ] Dependencies are up to date
- [ ] Code follows security best practices

## 🔍 Automated Security

This repository uses:

- **GitHub Security Advisories** for vulnerability tracking
- **Dependabot** for dependency updates
- **GitHub Actions** for automated validation
- **Secret scanning** to detect accidentally committed credentials

## 📞 Contact

For security-related questions or concerns:

- **General Security**: [security@leadmagic.io](mailto:security@leadmagic.io)
- **API Support**: [support@leadmagic.io](mailto:support@leadmagic.io)
- **Documentation Issues**: Create a GitHub issue (for non-security items)

---

**Remember**: When in doubt, err on the side of caution and report potential security issues privately rather than publicly.
