# Quickstart: Package Dependency Updates

## Prerequisites

1. **Node.js and npm**: Ensure you have Node.js 12+ and npm installed
2. **VS Code**: Install VS Code for testing the extension
3. **Git**: Working directory should be clean or changes committed
4. **Backup**: Create backup of `package.json` and `package-lock.json`

## Quick Validation Steps

### 1. Current State Assessment
```bash
# Check current dependency status
npm outdated

# Check for security vulnerabilities  
npm audit

# Verify current build works
npm run compile
npm test
```

**Expected Results**:
- List of outdated packages displayed
- Security audit shows known vulnerabilities
- Build completes successfully
- Tests pass

### 2. Install Update Tools
```bash
# Install npm-check-updates globally
npm install -g npm-check-updates

# Verify installation
ncu --version
```

### 3. Phase 1: Analysis
```bash
# Analyze available updates
ncu

# Check only major version updates
ncu --target major

# Generate update plan (dry run)
ncu --dry-run --format json > update-plan.json
```

**Expected Results**:
- Shows all available updates
- Identifies major vs minor/patch updates
- JSON file contains structured update plan

### 4. Phase 2: Apply Non-Breaking Updates
```bash
# Apply patch and minor updates only
ncu --target minor
npm install

# Verify build still works
npm run compile
npm run lint
npm test
```

**Expected Results**:
- Package.json updated with minor/patch versions
- Build completes successfully
- Linting passes
- All tests pass

### 5. Phase 3: Major Version Updates (if needed)
```bash
# Apply major updates selectively
ncu --upgrade --target major --filter "package-name"
npm install

# Test after each major update
npm run compile && npm test
```

**Expected Results**:
- Major versions updated one at a time
- Build and tests pass after each update
- Any breaking changes identified and resolved

### 6. Final Validation
```bash
# Full test suite
npm test

# Build for production
npm run vscode:prepublish

# Package the extension
npm run package
```

**Expected Results**:
- All tests pass
- Production build succeeds
- Extension packages without errors

### 7. Manual Testing in VS Code

1. **Install Extension**:
   - Open VS Code
   - Install the packaged extension (`.vsix` file)
   - Or run extension in development mode (F5)

2. **Test Core Functionality**:
   - Open a workspace folder
   - Open the Project Notes sidebar
   - Create and edit notes
   - Verify notes save to `.project-notes.md`
   - Test webview rendering
   - Verify markdown features work

3. **Test Edge Cases**:
   - Try with no workspace folder
   - Test large markdown files
   - Verify external file changes sync to UI
   - Test configuration changes

**Expected Results**:
- Extension loads without errors
- All core features work as before
- No visible performance degradation
- UI renders correctly

## Rollback Procedure

If any step fails:

```bash
# Restore from backup
cp package.json.backup package.json
cp package-lock.json.backup package-lock.json

# Reinstall original dependencies
npm ci

# Verify rollback worked
npm run compile && npm test
```

## Success Criteria Checklist

- [ ] All outdated packages updated to latest compatible versions
- [ ] Security vulnerabilities resolved
- [ ] Build process completes without errors
- [ ] All existing tests pass
- [ ] Extension loads successfully in VS Code
- [ ] Core functionality (create/edit/save notes) works
- [ ] Webview renders markdown correctly
- [ ] No performance regression detected
- [ ] Documentation updated if needed

## Troubleshooting Common Issues

### Peer Dependency Conflicts
```bash
# Check peer dependency warnings
npm ls

# Install missing peer dependencies
npm install <missing-peer-dep>
```

### Build Failures
```bash
# Check TypeScript compilation errors
npx tsc --noEmit

# Check webpack build issues
npm run webpack
```

### Test Failures
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- --grep "test-name"
```

### Extension Loading Issues
- Check VS Code Developer Console (Help > Toggle Developer Tools)
- Look for error messages during extension activation
- Verify all required files are included in the package