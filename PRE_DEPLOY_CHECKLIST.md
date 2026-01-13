# Pre-Deploy Checklist

Before deploying to production, always run these commands to catch errors:

## Quick Check (Run before every commit/deploy)

```bash
# 1. Type check (catches TypeScript errors)
npm run type-check

# 2. Build check (catches build errors)
npm run build

# 3. Lint check (catches code quality issues)
npm run lint
```

## Full Pre-Deploy Checklist

1. **Type Check**
   ```bash
   npm run type-check
   ```
   - Catches TypeScript errors before build
   - Should exit with code 0 (no errors)

2. **Build Test**
   ```bash
   npm run build
   ```
   - Tests production build
   - Catches build-time errors
   - Should complete successfully

3. **Lint Check**
   ```bash
   npm run lint
   ```
   - Catches code quality issues
   - Should have no errors

4. **Test Locally**
   ```bash
   npm run build
   npm run start
   ```
   - Test the production build locally
   - Visit http://localhost:3000 and test key features

## VS Code Integration

You can also:
- Install the "Error Lens" extension to see TypeScript errors inline
- Enable "TypeScript: Check JS" in VS Code settings
- Set up a pre-commit hook to run type-check automatically

## CI/CD Integration

The `.github/workflows/type-check.yml` file will automatically:
- Run type-check on every push to main/develop
- Run build check on pull requests
- Fail the CI if there are TypeScript errors

## Common Issues to Watch For

- Type errors (use `npm run type-check`)
- Missing imports
- Incorrect type annotations
- Unused variables (if strict mode is enabled)
- Build errors (use `npm run build`)
