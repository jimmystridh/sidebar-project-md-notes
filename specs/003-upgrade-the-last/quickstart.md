# Quickstart: Last Remaining Dependencies Upgrade

## Prerequisites

1. **Node.js and npm**: Ensure you have Node.js 12+ and npm installed
2. **VS Code**: Install VS Code for testing the extension
3. **Git**: Working directory should be clean or changes committed
4. **Backup**: Create backup of current package files (automated in process)

## Quick Validation Steps

### 1. Current State Assessment
```bash
# Check remaining outdated dependencies
ncu

# Verify current dependency versions
npm ls @types/marked @types/vscode eslint --depth=0

# Verify current build works
npm run compile
npm test
```

**Expected Results**:
- Shows 3 remaining outdated packages: @types/marked, @types/vscode, eslint
- Current versions: @types/marked 1.2.2, @types/vscode 1.50.0, eslint 8.57.1
- Build and tests pass with current versions

### 2. Compatibility Assessment
```bash
# Check @types/marked compatibility with marked library
npm info @types/marked versions --json | tail -10
npm ls marked --depth=0

# Verify VS Code packaging constraint
npm run package 2>&1 | grep -i "vscode.*greater"

# Check ESLint ecosystem compatibility
npm ls | grep eslint
```

**Expected Results**:
- @types/marked has versions compatible with marked 16.2.1
- Extension packaging works with current @types/vscode 1.50.0
- ESLint ecosystem shows complex plugin dependencies

### 3. Selective Upgrade: @types/marked Only
```bash
# Create automated backup
cp package.json package.json.backup-deps
cp package-lock.json package-lock.json.backup-deps

# Upgrade @types/marked to latest compatible version
npm install @types/marked@latest --save-dev

# Verify no breaking changes
npm run compile
```

**Expected Results**:
- @types/marked upgraded to latest version
- TypeScript compilation passes without new errors
- No type definition conflicts

### 4. Validation Testing
```bash
# Full compilation check
npm run compile

# Linting check
npm run lint

# Extension packaging test
npm run package
```

**Expected Results**:
- TypeScript compilation succeeds
- Linting passes (may have existing warnings)
- Extension packages successfully (.vsix file created)

### 5. Functional Validation in VS Code

1. **Load Extension**:
   - Open VS Code in development mode (F5) or install the .vsix package
   - Verify extension activates without errors

2. **Test Core Functionality**:
   - Open a workspace folder
   - Create and edit markdown notes in the Project Notes sidebar
   - Verify markdown rendering works correctly
   - Test checkbox interactions and note persistence

3. **Test Edge Cases**:
   - Create notes with complex markdown syntax
   - Test with large markdown files
   - Verify file watching and sync functionality

**Expected Results**:
- Extension loads without errors
- All markdown functionality works as before
- No visible changes in behavior (type-only upgrade)

### 6. Skip Decision Validation

**@types/vscode Skip Verification**:
```bash
# Confirm packaging constraint
npm install @types/vscode@latest --save-dev
npm run package 2>&1 || echo "Expected packaging failure"

# Restore correct version
npm install @types/vscode@1.50.0 --save-dev --save-exact
npm run package
```

**ESLint Skip Verification**:
```bash
# Check what would break with ESLint 9.x
npm install eslint@9 --save-dev
npm run lint 2>&1 || echo "Expected compatibility issues"

# Restore working version
npm install eslint@^8.57.1 --save-dev
npm run lint
```

## Rollback Procedure

If @types/marked upgrade causes issues:

```bash
# Restore from backup
cp package.json.backup-deps package.json
cp package-lock.json.backup-deps package-lock.json

# Reinstall original dependencies
npm ci

# Verify rollback worked
npm run compile && npm run package
```

## Success Criteria Checklist

- [ ] @types/marked upgraded to latest compatible version
- [ ] @types/vscode remains at 1.50.0 (packaging constraint)
- [ ] eslint remains at 8.57.1 (ecosystem compatibility)
- [ ] TypeScript compilation passes without new errors
- [ ] Extension packages successfully
- [ ] All existing functionality preserved
- [ ] Markdown rendering works correctly
- [ ] No performance regression detected
- [ ] Skip decisions documented with rationale

## Troubleshooting Common Issues

### @types/marked Upgrade Issues
```bash
# Check for type definition conflicts
npx tsc --noEmit --listFiles | grep marked

# Check marked library compatibility
npm info marked@16.2.1 peerDependencies
```

### Packaging Failures
```bash
# Verify @types/vscode constraint
npm ls @types/vscode
grep '"vscode"' package.json

# Test packaging with verbose output
npx @vscode/vsce package --verbose
```

### Type Compilation Errors
```bash
# Check specific TypeScript errors
npx tsc --noEmit --pretty

# Identify files with type issues
npx tsc --listFiles --noEmit 2>&1 | grep error
```

## Documentation Updates

After successful completion:

1. **Update CLAUDE.md**:
   - Document selective upgrade approach
   - Add compatibility-first strategy explanation
   - Update recent changes section

2. **Update Package Documentation**:
   - Note which packages were upgraded and why
   - Document skip decisions and rationale
   - Set monitoring schedule for skipped packages

3. **Create Upgrade History**:
   - Record upgrade decisions for future reference
   - Document compatibility constraints discovered
   - Note reassessment triggers for skipped packages