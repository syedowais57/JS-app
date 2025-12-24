# PR Reviewer Bot Notes

## Build Status Check

🧪 Build status check is working

## Lambda Runtime Limitation

⚠️ **npm not available in Lambda runtime**

This is expected behavior when the PR reviewer bot runs in AWS Lambda environment, as npm is not included by default in Lambda runtimes.

### Possible Solutions:
- Use a Lambda layer with npm/node
- Run build checks in a different environment (GitHub Actions, etc.)
- Skip npm build checks when running in Lambda
- Use a container-based Lambda with full Node.js environment

---

*Last updated: Testing PR reviewer bot functionality*


