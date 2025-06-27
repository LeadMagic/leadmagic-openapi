# Pull Request

## 📋 Description

**What does this PR do?**
<!-- Provide a clear and concise description of what changes you've made -->

**Related Issue(s)**
<!-- Link to any related GitHub issues. Use "Fixes #123" to automatically close issues when merged -->
- Fixes #
- Relates to #

## 🔄 Type of Change

- [ ] 🐛 Bug fix (API discrepancy correction)
- [ ] ✨ New feature (new endpoint documentation)
- [ ] 📚 Documentation update
- [ ] 🧪 Test improvement
- [ ] 🔧 Infrastructure/tooling change
- [ ] 🎨 Style/formatting improvement
- [ ] ♻️ Code refactoring
- [ ] 🔥 Removal of deprecated features

## 🧪 Testing

**Have you tested your changes against the live API?**
- [ ] Yes, tested with valid API key
- [ ] No, changes don't require API testing (documentation only)
- [ ] Not applicable

**Testing details:**
<!-- Describe how you tested your changes -->
- API endpoints tested: 
- Test scenarios covered:
- Edge cases verified:

## ✅ Checklist

### OpenAPI Specification Changes
- [ ] Updated both YAML and JSON files (if applicable)
- [ ] Validated specification with Swagger CLI/Editor
- [ ] All examples use OpenAPI 3.1 format (`examples` not `example`)
- [ ] Field names use snake_case (matches API)
- [ ] Credit costs are accurate
- [ ] HTTP methods are correct (POST for data endpoints)

### Documentation Changes
- [ ] Updated README.md (if needed)
- [ ] Added/updated code examples
- [ ] Verified all links work
- [ ] Checked for typos and grammar
- [ ] Added use cases (if applicable)

### Security & Best Practices
- [ ] No hardcoded API keys or sensitive data
- [ ] Environment variables used for configuration
- [ ] No credentials in commit history
- [ ] Followed security guidelines

### Code Quality
- [ ] Code follows project style guidelines
- [ ] Added appropriate comments
- [ ] No console.log statements with sensitive data
- [ ] Error handling is appropriate

## 📊 API Accuracy Verification

**For specification changes:**
- [ ] Tested against live LeadMagic API
- [ ] Response schemas match actual API responses
- [ ] Request parameters match API requirements
- [ ] Error responses documented accurately
- [ ] Credit consumption verified

**Evidence:**
<!-- Paste actual API responses or test results if applicable -->
```json
// Example: Actual API response that validates your changes
```

## 💰 Credit Cost Changes

**If you've updated credit costs:**
- [ ] Verified against official LeadMagic documentation
- [ ] Tested actual consumption with API
- [ ] Updated README.md table
- [ ] Updated CHANGELOG.md

| Endpoint | Old Cost | New Cost | Verification Source |
|----------|----------|----------|-------------------|
| `/example` | X credits | Y credits | Link to official docs |

## 📈 Impact Assessment

**Breaking Changes:**
- [ ] This PR contains breaking changes
- [ ] This PR does not contain breaking changes

**Scope of changes:**
- [ ] Single endpoint
- [ ] Multiple endpoints
- [ ] Documentation only
- [ ] Testing framework
- [ ] Repository structure

## 🔗 Additional Context

**Screenshots (if applicable):**
<!-- Add screenshots for UI changes, documentation improvements, etc. -->

**Additional notes:**
<!-- Any additional information that would help reviewers understand your changes -->

**Dependencies:**
<!-- List any dependencies this PR has on other PRs or external changes -->

---

## 🎯 Reviewer Guidance

**What should reviewers focus on?**
- [ ] API accuracy
- [ ] Documentation clarity
- [ ] Code quality
- [ ] Security considerations
- [ ] Test coverage

**Special attention needed for:**
<!-- Highlight any areas that need extra review attention -->

---

By submitting this pull request, I confirm that:
- [ ] I have read and followed the [Contributing Guidelines](CONTRIBUTING.md)
- [ ] I have tested my changes thoroughly
- [ ] I have considered the impact on existing users
- [ ] I am willing to address review feedback promptly 