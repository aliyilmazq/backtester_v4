# Branch Protection Rules

This document outlines the branch protection rules that should be configured in GitHub for this repository.

## Main Branch Protection

Configure the following rules for the `main` branch:

1. **Require pull request reviews before merging**
   - Required approving reviews: 1
   - Dismiss stale pull request approvals when new commits are pushed
   - Require review from CODEOWNERS

2. **Require status checks to pass before merging**
   - Required status checks:
     - `lint`
     - `test`
     - `build`
     - `security`
   - Require branches to be up to date before merging

3. **Require conversation resolution before merging**

4. **Require linear history**

5. **Include administrators**

6. **Restrict who can push to matching branches**
   - Only allow specific users/teams to push directly

## Develop Branch Protection

Configure similar but less restrictive rules for the `develop` branch:

1. **Require pull request reviews before merging**
   - Required approving reviews: 1

2. **Require status checks to pass before merging**
   - Required status checks:
     - `lint`
     - `test`

## Setting Up Branch Protection

To configure these rules:

1. Go to Settings → Branches in your GitHub repository
2. Add a new rule for the `main` branch
3. Configure all the settings mentioned above
4. Add another rule for the `develop` branch
5. Save the changes

## Bypass Protection

In emergency situations, repository administrators can bypass these rules. This should be done sparingly and with proper documentation.
