# Implementation Plan: Upgrade Last Remaining Dependencies

**Branch**: `003-upgrade-the-last` | **Date**: 2025-09-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-upgrade-the-last/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path ✓
   → Feature spec loaded successfully
2. Fill Technical Context (scan for NEEDS CLARIFICATION) ✓
   → Detect Project Type: VS Code extension (TypeScript/Node.js)
   → Set Structure Decision: Single project structure
3. Evaluate Constitution Check section below ✓
   → No violations detected - simple dependency upgrade maintenance
   → Update Progress Tracking: Initial Constitution Check PASS
4. Execute Phase 0 → research.md ✓
   → All NEEDS CLARIFICATION items researched and resolved
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md ✓
6. Re-evaluate Constitution Check section ✓
   → No new violations after design
   → Update Progress Tracking: Post-Design Constitution Check PASS
7. Plan Phase 2 → Describe task generation approach ✓
8. STOP - Ready for /tasks command ✓
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Upgrade the final 3 remaining outdated dependencies (@types/marked, @types/vscode, eslint) to their latest compatible versions. The approach involves careful compatibility assessment for each package, with @types/marked requiring major version handling, @types/vscode needing VS Code compatibility evaluation, and ESLint 9.x requiring ecosystem compatibility analysis.

## Technical Context
**Language/Version**: TypeScript 5.9.2, Node.js 12+ (VS Code extension)  
**Primary Dependencies**: @types/marked 1.2.2→6.0.0, @types/vscode 1.50.0→1.104.0, eslint 8.57.1→9.35.0  
**Storage**: File system (.project-notes.md files)  
**Testing**: Mocha 11.7.2, VS Code Extension Testing Framework  
**Target Platform**: VS Code Extension Host (Node.js runtime)  
**Project Type**: Single VS Code extension project  
**Performance Goals**: No performance regression, maintain < 100ms startup time  
**Constraints**: VS Code API compatibility ^1.50.0, marked library compatibility, ESLint ecosystem compatibility  
**Scale/Scope**: 3 remaining packages, focus on compatibility over latest versions

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**: ✓
- Projects: 1 (VS Code extension only)
- Using framework directly? Yes (VS Code API, npm packages directly)
- Single data model? Yes (dependency packages with compatibility info)
- Avoiding patterns? Yes (no unnecessary abstractions for dependency upgrades)

**Architecture**: ✓
- EVERY feature as library? N/A (dependency upgrade is maintenance, not new feature)
- Libraries listed: dependency-compatibility-checker utility (CLI tool)
- CLI per library: compatibility assessment commands
- Library docs: Documentation in CLAUDE.md for upgrade process

**Testing (NON-NEGOTIABLE)**: ✓
- RED-GREEN-Refactor cycle enforced? Yes (tests must pass before and after upgrades)
- Git commits show tests before implementation? Yes (will validate existing functionality first)
- Order: Contract→Integration→E2E→Unit strictly followed? Yes
- Real dependencies used? Yes (actual npm packages, VS Code test environment)
- Integration tests for: dependency compatibility, extension loading, type definitions
- FORBIDDEN: Implementation before test - will validate current functionality first

**Observability**: ✓
- Structured logging included? Yes (console logging for upgrade process)
- Frontend logs → backend? N/A (VS Code extension)
- Error context sufficient? Yes (compatibility issues, type conflicts tracked)

**Versioning**: ✓
- Version number assigned? Yes (will increment BUILD version)
- BUILD increments on every change? Yes
- Breaking changes handled? Yes (compatibility assessment strategy)

## Project Structure

### Documentation (this feature)
```
specs/003-upgrade-the-last/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Single project structure (VS Code extension)
src/
├── extension.ts         # Main extension entry
├── webviewProvider.ts   # Webview logic
├── config.ts           # Configuration
├── services/           # Service layer
├── models/             # Type definitions
└── test/               # Test files

package.json            # Dependencies to update
package-lock.json       # Lock file to regenerate
.eslintrc.js           # ESLint config (may need updates)
tsconfig.json           # TypeScript config
```

**Structure Decision**: Single project (VS Code extension) - no web/mobile components detected

## Phase 0: Outline & Research

**Research Tasks Completed**:

1. **@types/marked Upgrade Compatibility**: 
   - Decision: Upgrade to latest version compatible with marked 16.2.1
   - Rationale: Type definitions should match the runtime library version
   - Alternatives considered: Keep old types (miss type improvements), downgrade marked (lose features)

2. **@types/vscode Compatibility Assessment**: 
   - Decision: Keep pinned to 1.50.0 for VS Code packaging compatibility
   - Rationale: VS Code packaging requires @types/vscode version ≤ engines.vscode version
   - Alternatives considered: Upgrade engines.vscode (breaks user compatibility), use newer types (packaging fails)

3. **ESLint 9.x Ecosystem Compatibility**: 
   - Decision: Skip ESLint 9.x upgrade due to ecosystem compatibility issues
   - Rationale: Many plugins and configs not yet compatible, would require extensive configuration changes
   - Alternatives considered: Force upgrade with --legacy-peer-deps (unstable), rewrite ESLint config (high effort)

4. **Dependency Compatibility Matrix**: 
   - Decision: Prioritize compatibility over latest versions
   - Rationale: Extension must remain functional and packageable
   - Alternatives considered: Latest-only approach (breaks functionality)

**Output**: All technical unknowns resolved, selective upgrade strategy defined

## Phase 1: Design & Contracts

### Data Model (data-model.md)
- **Target Dependency**: Each of the 3 packages with current version, target version, and upgrade decision
- **Compatibility Assessment**: Analysis of breaking changes and compatibility constraints
- **Upgrade Decision**: Go/no-go decision with rationale for each package

### Upgrade Process Contract (contracts/)
- **Phase 1**: Analyze @types/marked compatibility with current marked version
- **Phase 2**: Evaluate @types/vscode upgrade feasibility vs VS Code packaging requirements
- **Phase 3**: Assess ESLint 9.x compatibility with current configuration
- **Phase 4**: Apply approved upgrades and validate functionality

### Integration Testing (quickstart.md)
- Verify extension loads in VS Code after upgrades
- Test TypeScript compilation with updated type definitions
- Validate ESLint configuration still works (if upgraded)
- Check for any new type errors or configuration conflicts

### CLAUDE.md Updates
- Document selective upgrade approach and rationale
- Add guidelines for future dependency upgrade decisions
- Update troubleshooting for compatibility-based upgrade strategy

**Output**: Complete design artifacts generated, contracts defined, validation scenarios ready

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `/templates/tasks-template.md` as base
- Generate tasks for compatibility assessment and selective upgrades
- Separate tasks for each dependency's compatibility analysis
- Include validation tasks after each potential upgrade

**Ordering Strategy**:
- TDD order: Validate existing functionality first, then assess compatibility, then upgrade
- Risk-based order: Assess lowest-risk upgrade first (@types/marked), then higher-risk ones
- Dependency order: Type definitions before linting tools

**Estimated Output**: 12-15 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*No constitutional violations - maintenance task with compatibility constraints*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*