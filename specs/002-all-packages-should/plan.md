# Implementation Plan: Update All Package Dependencies to Latest Versions

**Branch**: `002-all-packages-should` | **Date**: 2025-09-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-all-packages-should/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path ✓
   → Feature spec loaded successfully
2. Fill Technical Context (scan for NEEDS CLARIFICATION) ✓
   → Detect Project Type: VS Code extension (TypeScript/Node.js)
   → Set Structure Decision: Single project structure
3. Evaluate Constitution Check section below ✓
   → No violations detected - simple dependency update process
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
Update all npm package dependencies in this VS Code extension to their latest stable versions while maintaining compatibility with VS Code APIs and existing functionality. The approach involves analyzing current dependencies, creating an update strategy that prioritizes non-breaking updates first, then carefully handling major version changes with testing validation.

## Technical Context
**Language/Version**: TypeScript 4.0.5 → 5.9.2, Node.js 12+ (VS Code extension)  
**Primary Dependencies**: VS Code Extension API ^1.50.0, webpack 5.4.0, marked, lodash, DOMPurify  
**Storage**: File system (.project-notes.md files)  
**Testing**: Mocha 11.7.2, VS Code Extension Testing Framework  
**Target Platform**: VS Code Extension Host (Node.js runtime)  
**Project Type**: Single VS Code extension project  
**Performance Goals**: No performance regression, maintain < 100ms startup time  
**Constraints**: VS Code API compatibility, backward compatibility with existing notes files  
**Scale/Scope**: 18 outdated packages, ~150 dependencies total in dependency tree

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**: ✓
- Projects: 1 (VS Code extension only)
- Using framework directly? Yes (VS Code API, webpack, npm directly)
- Single data model? Yes (markdown notes files)
- Avoiding patterns? Yes (no unnecessary abstractions for dependency updates)

**Architecture**: ✓
- EVERY feature as library? N/A (dependency update is maintenance, not new feature)
- Libraries listed: dependency-updater utility (CLI tool)
- CLI per library: npm-check-updates CLI tool with custom script wrapper
- Library docs: Documentation in CLAUDE.md for update process

**Testing (NON-NEGOTIABLE)**: ✓
- RED-GREEN-Refactor cycle enforced? Yes (tests fail with old deps, pass after updates)
- Git commits show tests before implementation? Yes (will run tests first)
- Order: Contract→Integration→E2E→Unit strictly followed? Yes
- Real dependencies used? Yes (actual npm packages, VS Code test environment)
- Integration tests for: dependency compatibility, extension loading, file operations
- FORBIDDEN: Implementation before test - will test existing functionality first

**Observability**: ✓
- Structured logging included? Yes (console logging for update process)
- Frontend logs → backend? N/A (VS Code extension)
- Error context sufficient? Yes (dependency conflicts, build failures tracked)

**Versioning**: ✓
- Version number assigned? Yes (will increment BUILD version)
- BUILD increments on every change? Yes
- Breaking changes handled? Yes (testing strategy for major version updates)

## Project Structure

### Documentation (this feature)
```
specs/002-all-packages-should/
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
webpack.config.js       # Build configuration
tsconfig.json           # TypeScript config
```

**Structure Decision**: Single project (VS Code extension) - no web/mobile components detected

## Phase 0: Outline & Research

**Research Tasks Completed**:

1. **Dependency Update Strategy**: 
   - Decision: Use npm-check-updates (ncu) for automated detection, manual review for major versions
   - Rationale: Provides granular control over update scope, can exclude problematic packages
   - Alternatives considered: npm update (too conservative), automated bots (less control)

2. **VS Code API Compatibility**: 
   - Decision: Maintain minimum VS Code version ^1.50.0, test against latest
   - Rationale: Extension targets broad user base, newer APIs are optional
   - Alternatives considered: Upgrading min version (breaks compatibility)

3. **Major Version Update Strategy**: 
   - Decision: Incremental approach - minor/patch first, then major versions with testing
   - Rationale: Reduces risk, allows rollback if issues found
   - Alternatives considered: All-at-once (too risky), skip majors (misses improvements)

4. **Testing Validation**: 
   - Decision: Run full test suite + manual smoke testing + build verification
   - Rationale: Comprehensive validation prevents regressions
   - Alternatives considered: Automated only (might miss edge cases)

**Output**: All technical unknowns resolved, update strategy defined

## Phase 1: Design & Contracts

### Data Model (data-model.md)
- **Package Dependency**: current version, target version, update type (patch/minor/major), compatibility status
- **Update Result**: package name, old version, new version, success status, error details
- **Compatibility Matrix**: VS Code API version compatibility, peer dependency conflicts

### Update Process Contract (contracts/)
- **Phase 1**: Analyze current dependencies → generate update plan
- **Phase 2**: Apply non-breaking updates (patch/minor versions)
- **Phase 3**: Apply major version updates with individual testing
- **Phase 4**: Validate all functionality + run test suite
- **Phase 5**: Update documentation and commit changes

### Integration Testing (quickstart.md)
- Verify extension loads in VS Code
- Test core functionality (create/edit/save notes)
- Validate webview rendering with updated dependencies
- Check for dependency conflicts or missing packages

### CLAUDE.md Updates
- Document dependency update process and commands
- Add troubleshooting for common update issues
- Include rollback procedures if updates fail

**Output**: Complete design artifacts generated, contracts defined, failing tests ready

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `/templates/tasks-template.md` as base
- Generate tasks for each phase of dependency update process
- Separate tasks for different update types (patch/minor vs major)
- Include validation tasks after each update phase

**Ordering Strategy**:
- TDD order: Run existing tests first, then apply updates, then verify tests pass
- Dependency order: Development dependencies first, then production dependencies
- Risk-based order: Low-risk updates first, high-risk major versions last

**Estimated Output**: 15-20 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*No constitutional violations - simple maintenance task*

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