# Contributing to LeadMagic OpenAPI Specification

Thank you for your interest in contributing to the LeadMagic OpenAPI specification! This document provides guidelines and instructions for contributing.

## 🎯 How to Contribute

### Reporting Issues
- **API Discrepancies**: If you find the specification doesn't match the actual API behavior
- **Documentation Errors**: Typos, unclear explanations, or missing information
- **Schema Validation Issues**: Problems with request/response validation
- **Missing Endpoints**: If LeadMagic adds new API endpoints

### Suggesting Improvements
- **Better Examples**: More realistic or comprehensive API examples
- **Use Case Documentation**: Additional use cases or implementation guides
- **Developer Experience**: Tools, scripts, or utilities that help developers

## 🔄 Development Process

### 1. Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/LeadMagic/leadmagic-openapi.git
cd leadmagic-openapi

# Set up your API key for testing
export LEADMAGIC_API_KEY=your-api-key-here

# Test the current specification
npm install
npm run test:api
```

### 2. Making Changes

#### For Documentation Updates
1. Edit `README.md` for documentation changes
2. Ensure examples are accurate and helpful
3. Test any code examples you add
4. If the change affects MCP-facing naming, setup, auth, or pricing language, keep the wording aligned with the hosted MCP docs and the public Cursor plugin package

#### For OpenAPI Specification Updates
1. Edit both `leadmagic-openapi-3.1.yaml` AND `leadmagic-openapi-3.1.json`
2. Ensure both files remain synchronized
3. Validate the specification:
   ```bash
   npm install
   npm run lint:openapi
   ```

#### For Test Script Updates
1. Edit `test-api.ts` to add new test cases
2. Ensure all tests pass with a valid API key
3. Run `npm run typecheck`
4. Test edge cases and error conditions
5. If you add reporting, never write the API key or request headers to the report output

### 3. Testing Your Changes

#### Validate Against Live API
```bash
# Ensure your API key is set
export LEADMAGIC_API_KEY=your-actual-api-key

# Run the comprehensive test suite
npm run test:api

# Test specific endpoints if you made targeted changes
```

#### Validate OpenAPI Specification
```bash
# Use online validators or tools like:
# - Swagger Editor (https://editor.swagger.io/)
# - Spectral CLI for advanced linting
# - OpenAPI Generator for code generation testing
```

### 4. Submitting Changes

1. **Fork the repository** on GitHub
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/improve-email-validation-docs
   ```
3. **Make your changes** following the guidelines above
4. **Test thoroughly** against the live API
5. **Commit with clear messages**:
   ```bash
   git commit -m "docs: improve email validation response examples

   - Added more realistic company data examples
   - Clarified mx_provider field values
   - Updated use cases section"
   ```
6. **Push to your fork** and **create a Pull Request**

## 📝 Style Guidelines

### OpenAPI Specification
- **Current-doc accuracy**: Match the current public docs and verified responses for each endpoint instead of assuming one global field naming style
- **Comprehensive examples**: Include realistic, working examples
- **Clear descriptions**: Write helpful descriptions for all fields and endpoints
- **Proper validation**: Include appropriate validation rules and constraints
- **OpenAPI 3.1 schema style**: Use JSON Schema 2020-12 patterns such as `jsonSchemaDialect`, `examples`, and union types like `["string", "null"]` instead of `nullable`

### Documentation
- **Clear headings**: Use descriptive section headers
- **Code examples**: Provide copy-paste ready examples
- **Use cases**: Include practical, real-world use cases
- **Consistent formatting**: Follow the existing markdown style
- **Cross-surface consistency**: Keep API snapshot language aligned with the current MCP docs and public Cursor plugin positioning

### Testing
- **Environment variables**: Never hardcode API keys
- **Error handling**: Test both success and error cases
- **Rate limiting**: Respect API rate limits in tests
- **Clean output**: Provide clear, informative test output

## 🔍 API Accuracy Standards

### Field Verification
- **Test with live API**: All field names and types must match the actual API
- **Response validation**: Ensure response schemas accurately reflect API responses
- **Error scenarios**: Document actual error responses and status codes

### Credit Cost Accuracy
- **Verify costs**: Test actual credit consumption for each endpoint
- **Update documentation**: Keep credit cost tables current
- **Note variations**: Document when costs may vary (e.g., "per result")

## 🚀 Release Process

### For Maintainers
1. **Review all changes** thoroughly
2. **Test against live API** with multiple scenarios
3. **Update version numbers** if needed
4. **Create release notes** highlighting changes
5. **Tag releases** for stable versions

### Versioning
- Follow semantic versioning for the specification
- Major versions for breaking API changes
- Minor versions for new endpoints or significant additions
- Patch versions for documentation fixes and small improvements

## 🤝 Community Guidelines

### Be Respectful
- Respect all contributors and maintainers
- Provide constructive feedback
- Help newcomers get started

### Be Accurate
- Test changes against the actual API
- Provide evidence for API behavior claims
- Update documentation when the API changes

### Be Collaborative
- Discuss major changes in issues before implementing
- Review others' contributions constructively
- Share knowledge and best practices

## 📞 Getting Help

- **Documentation Issues**: Create an issue with the "documentation" label
- **API Questions**: Check [LeadMagic's official documentation](https://leadmagic.io/docs)
- **Specification Questions**: Create an issue with the "question" label
- **Technical Support**: Contact [support@leadmagic.io](mailto:support@leadmagic.io)

## 🏆 Recognition

Contributors will be recognized in:
- Release notes for significant contributions
- README acknowledgments
- GitHub contributor graphs

Thank you for helping make the LeadMagic OpenAPI specification better for all developers! 🎉
