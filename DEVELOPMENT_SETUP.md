# Development Setup Guide

This document outlines the development practices and tools configured for this project.

## 1. Code Quality Tools

### ESLint & Prettier

- **ESLint**: Enforces code quality rules with strict configuration
- **Prettier**: Ensures consistent code formatting
- Configuration files: `.eslintrc.js`, `.prettierrc.js`

### Available Commands:

```bash
npm run lint          # Fix linting issues
npm run lint:check    # Check for linting issues
npm run format        # Format code with Prettier
npm run format:check  # Check formatting
```

## 2. Pre-commit Hooks (Husky)

All code is automatically linted and formatted before commits using Husky and lint-staged.

- Pre-commit hook runs: ESLint → Prettier → Tests
- Configuration: `.husky/pre-commit`, `package.json` (lint-staged)

## 3. CI/CD Pipeline

### GitHub Actions Workflows:

#### CI Pipeline (`.github/workflows/ci.yml`)

Runs on every push and PR to main/develop branches:

1. **Lint**: Checks ESLint and Prettier compliance
2. **Test**: Runs unit and integration tests
3. **Build**: Builds the application
4. **Security**: Runs security audits

#### Release Pipeline (`.github/workflows/release.yml`)

- Automated versioning using semantic-release
- Runs on pushes to main branch
- Creates GitHub releases with changelogs

#### Deploy Pipeline (`.github/workflows/deploy.yml`)

- Deploys on new releases
- Supports manual deployment to staging/production
- Automatic rollback on failure

## 4. Branch Protection Rules

Configure these in GitHub Settings → Branches:

### Main Branch:

- Require PR reviews (1 approval)
- Require status checks: lint, test, build, security
- Require up-to-date branches
- Require conversation resolution
- Require linear history

### Develop Branch:

- Require PR reviews (1 approval)
- Require status checks: lint, test

## 5. TypeScript Configuration

### Setup:

- TypeScript is configured with strict mode
- Path aliases for cleaner imports
- Configuration: `tsconfig.json`

### Migration:

Run the migration script to convert JS files to TS:

```bash
node scripts/migrate-to-typescript.js
```

### Type Definitions:

Common types are defined in `src/types/index.ts`

## 6. Semantic Versioning

### Commit Convention:

Follow Angular commit convention:

- `feat:` New features (minor version bump)
- `fix:` Bug fixes (patch version bump)
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test updates
- `chore:` Maintenance tasks
- `BREAKING CHANGE:` Breaking changes (major version bump)

### Automatic Releases:

Semantic-release automatically:

- Analyzes commits
- Determines version bump
- Updates CHANGELOG.md
- Creates GitHub release
- Tags the release

## 7. Rollback Mechanism

### Automatic Rollback:

If deployment fails, the system automatically:

1. Identifies the previous stable release
2. Triggers rollback deployment
3. Creates an issue for tracking

### Manual Rollback:

```bash
./scripts/rollback.sh [environment] [version]
# Example: ./scripts/rollback.sh production v1.2.3
```

## 8. Development Workflow

### Starting Development:

1. Create feature branch from develop
2. Make changes following code standards
3. Commit with conventional commits
4. Push (pre-commit hooks run automatically)
5. Create PR to develop
6. CI checks must pass
7. Get code review approval
8. Merge to develop

### Release Process:

1. Create PR from develop to main
2. Ensure all checks pass
3. Merge to main
4. Semantic-release creates version/tag
5. Deploy workflow triggers automatically

## 9. Troubleshooting

### Lint Errors:

```bash
npm run lint        # Auto-fix issues
npm run lint:check  # See all issues
```

### Failed Commits:

If pre-commit hooks fail:

1. Fix the reported issues
2. Stage the fixes
3. Commit again

### TypeScript Errors:

```bash
npx tsc --noEmit  # Check for TS errors
```

## 10. Next Steps

### Monorepo Structure (Planned):

- Implement Lerna or Nx for monorepo management
- Separate packages for better modularity
- Shared dependencies and configurations

### Additional Improvements:

- Add E2E testing framework
- Implement code coverage requirements
- Add performance monitoring
- Set up error tracking (Sentry)
