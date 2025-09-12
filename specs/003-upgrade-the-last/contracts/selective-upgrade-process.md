# Selective Upgrade Process Contract

## Phase 1: Compatibility Assessment

**Input**: Current package.json with 3 remaining outdated dependencies
**Output**: Upgrade decision matrix with go/no-go for each package

### Operations:
1. **Analyze @types/marked Compatibility**
   - Check latest @types/marked version compatibility with marked 16.2.1
   - Identify any breaking changes in type definitions
   - Assess impact on existing TypeScript code

2. **Evaluate @types/vscode Packaging Constraint**
   - Verify VS Code packaging requirements with current engines.vscode ^1.50.0
   - Confirm packaging failure risk with newer @types/vscode versions
   - Document hard constraint rationale

3. **Assess ESLint 9.x Ecosystem Readiness**
   - Check compatibility of current ESLint plugins with ESLint 9.x
   - Evaluate flat config migration requirements
   - Assess plugin ecosystem maturity

**Success Criteria**:
- Each package has clear upgrade decision (proceed/skip/defer)
- Rationale documented for each decision
- Risk assessment completed for potential upgrades

## Phase 2: @types/marked Upgrade

**Input**: Approved @types/marked upgrade decision
**Output**: Updated @types/marked with validated compatibility

### Operations:
1. **Backup Current State**
   - Create backup of package.json and package-lock.json
   - Document current @types/marked version (1.2.2)

2. **Apply @types/marked Upgrade**
   - Install latest @types/marked compatible with marked 16.2.1
   - Update package.json and regenerate package-lock.json

3. **Validate Type Compatibility**
   - Run TypeScript compilation to check for type errors
   - Test markdown parsing functionality in webview
   - Verify no breaking changes in type definitions

**Success Criteria**:
- TypeScript compilation passes without new errors
- Markdown parsing functionality unchanged
- No type definition conflicts introduced

## Phase 3: Skip Incompatible Packages

**Input**: Decision to skip @types/vscode and eslint upgrades
**Output**: Documentation of skip rationale and monitoring plan

### Operations:
1. **Document @types/vscode Skip Decision**
   - Record packaging constraint as blocking factor
   - Note minimum VS Code version dependency
   - Set reassessment trigger conditions

2. **Document ESLint Skip Decision**  
   - Record ecosystem compatibility issues
   - Note configuration migration complexity
   - Set monitoring plan for ecosystem maturity

3. **Update Dependency Management Documentation**
   - Add selective upgrade approach to CLAUDE.md
   - Document compatibility-first strategy
   - Provide guidance for future upgrade decisions

**Success Criteria**:
- Skip decisions clearly documented with rationale
- Future reassessment conditions defined
- Documentation updated with new approach

## Phase 4: Validation and Documentation

**Input**: Applied upgrades and skip decisions
**Output**: Validated extension with updated documentation

### Operations:
1. **Comprehensive Testing**
   - Run TypeScript compilation
   - Test extension loading in VS Code
   - Validate markdown rendering functionality
   - Test extension packaging with vsce

2. **Performance Validation**
   - Measure extension startup time
   - Check memory usage impact
   - Validate markdown parsing performance

3. **Security and Dependency Audit**
   - Run npm audit for security vulnerabilities
   - Verify no new high-severity issues introduced
   - Check dependency tree for unexpected changes

**Success Criteria**:
- All tests pass with upgraded dependencies
- Extension packages successfully
- No performance regression detected
- No new security vulnerabilities

## Error Handling Contracts

### @types/marked Upgrade Failures
- **Type Compilation Errors**: Roll back to previous version, investigate specific conflicts
- **Functionality Regression**: Revert upgrade, document incompatibility issues
- **Performance Impact**: Profile changes, consider partial rollback if significant

### Packaging Validation Failures
- **vsce Packaging Error**: Immediate rollback, verify packaging constraint documentation
- **Extension Loading Issues**: Test in clean VS Code environment, check for missing dependencies

### General Upgrade Failures
- **Security Vulnerability Introduction**: Immediate assessment, rollback if high-severity
- **Build System Failures**: Check for configuration conflicts, update build scripts if needed

## Success Metrics

### Quantitative Measures
- Number of packages successfully upgraded (target: 1 out of 3)
- Zero new TypeScript compilation errors
- Extension packaging success rate: 100%
- Performance impact: <5% startup time increase

### Qualitative Measures
- Extension functionality fully preserved
- Development workflow maintained
- Clear rationale for all upgrade decisions
- Improved documentation for future upgrades

## Monitoring and Reassessment

### Skipped Package Monitoring
- **@types/vscode**: Monitor VS Code minimum version discussions, packaging requirement changes
- **eslint**: Track ESLint plugin ecosystem adoption of flat config, major plugin compatibility

### Decision Review Process
- Schedule quarterly review of skipped packages
- Monitor dependency security advisories
- Update compatibility assessments based on ecosystem changes

### Documentation Maintenance
- Keep upgrade decision rationale current
- Update compatibility constraints as they change
- Maintain future upgrade roadmap based on monitoring results