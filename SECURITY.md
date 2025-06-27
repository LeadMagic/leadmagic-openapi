# Security Policy

## 🔐 Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

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