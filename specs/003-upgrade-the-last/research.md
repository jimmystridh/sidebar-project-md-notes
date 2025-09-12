# Research: Last Remaining Dependencies Upgrade

## @types/marked Compatibility Analysis

**Current State**: @types/marked 1.2.2, marked library 16.2.1

**Decision**: Upgrade @types/marked to latest version compatible with marked 16.2.1

**Rationale**: 
- Type definitions should align with the runtime library version for accurate typing
- Marked 16.2.1 is a recent version that likely has compatible type definitions
- @types/marked provides TypeScript interfaces for the marked library's API
- Outdated type definitions can cause false type errors or miss new features

**Alternatives Considered**:
- Keep @types/marked at 1.2.2: Would maintain stability but miss type improvements and potentially have type mismatches
- Downgrade marked library: Would lose markdown parsing improvements and security fixes
- Remove @types/marked: Would lose TypeScript typing benefits for markdown operations

**Compatibility Assessment**: Need to verify that the latest @types/marked version supports the marked 16.2.1 API without breaking changes to existing code.

## @types/vscode Upgrade Feasibility

**Current State**: @types/vscode 1.50.0 (pinned), VS Code engines requirement ^1.50.0

**Decision**: Keep @types/vscode pinned at 1.50.0 for VS Code packaging compatibility

**Rationale**:
- VS Code Extension packaging (vsce) requires @types/vscode version ≤ engines.vscode version
- Extension targets minimum VS Code 1.50.0 for broad user compatibility
- Upgrading @types/vscode beyond 1.50.0 would break extension packaging
- Previous attempt to upgrade to 1.104.0 caused packaging failure requiring rollback

**Alternatives Considered**:
- Upgrade engines.vscode to match newer @types/vscode: Would break compatibility for users on older VS Code versions
- Use newer @types/vscode and ignore packaging error: Extension would fail to package for distribution
- Remove minimum version requirement: Would lose compatibility guarantees

**Technical Constraint**: VS Code packaging is a hard requirement for extension distribution, making compatibility more important than having the latest type definitions.

## ESLint 9.x Ecosystem Compatibility

**Current State**: ESLint 8.57.1, target ESLint 9.35.0

**Decision**: Skip ESLint 9.x upgrade due to ecosystem compatibility issues

**Rationale**:
- ESLint 9.x introduced significant configuration changes (flat config)
- Many popular ESLint plugins and configurations are not yet compatible with ESLint 9.x
- Previous dependency update already encountered peer dependency conflicts with ESLint ecosystem
- ESLint 8.x is still actively maintained and secure

**Alternatives Considered**:
- Force upgrade with --legacy-peer-deps: Would create unstable dependency resolution
- Rewrite entire ESLint configuration for flat config: High effort with limited benefit
- Wait for ecosystem maturity: Current approach - revisit when more plugins support ESLint 9.x

**Ecosystem Analysis**: The TypeScript ESLint plugins, Prettier integration, and Airbnb config all have varying levels of ESLint 9.x support, creating a complex compatibility matrix.

## Selective Upgrade Strategy

**Decision**: Implement compatibility-first upgrade approach

**Upgrade Priorities**:
1. **@types/marked**: UPGRADE - Low risk, high compatibility likelihood
2. **@types/vscode**: SKIP - Hard constraint from packaging requirements
3. **ESLint**: SKIP - Ecosystem compatibility issues

**Rationale**:
- Maintains extension functionality and packageability as top priorities
- Balances benefits of updates against compatibility risks
- Allows for partial modernization without breaking core requirements
- Establishes precedent for future dependency upgrade decisions

**Testing Strategy**:
- Validate TypeScript compilation before and after @types/marked upgrade
- Test extension functionality in VS Code development environment
- Verify extension packaging still works after changes
- Check for any new type errors or conflicts

## Future Upgrade Path

**@types/vscode**: Can be upgraded when either:
- Minimum VS Code version requirement is increased
- VS Code packaging requirements change to allow newer type definitions

**ESLint 9.x**: Can be upgraded when:
- All used ESLint plugins support ESLint 9.x
- Configuration migration path is clearer and more stable
- Flat config ecosystem matures

**Monitoring Strategy**: 
- Regularly check compatibility status of skipped upgrades
- Document upgrade blockers for future reference
- Reassess upgrade feasibility in future dependency update cycles