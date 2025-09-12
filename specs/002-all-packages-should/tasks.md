# Tasks: Update All Package Dependencies to Latest Versions

**Input**: Design documents from `/specs/002-all-packages-should/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory ✓
   → Tech stack: TypeScript/Node.js VS Code extension
   → Libraries: npm-check-updates, webpack, marked, lodash
2. Load optional design documents: ✓
   → data-model.md: Package Dependency, Update Result, Compatibility Matrix
   → contracts/: Update Process Contract with 4 phases
   → research.md: ncu strategy, incremental approach
3. Generate tasks by category: ✓
   → Setup: backup, tool installation, current state analysis
   → Tests: contract validation, integration testing
   → Core: dependency analysis, patch/minor updates, major updates
   → Integration: build verification, performance testing
   → Polish: documentation, rollback procedures
4. Apply task rules: ✓
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...) ✓
6. Generate dependency graph ✓
7. Create parallel execution examples ✓
8. Validate task completeness: ✓
   → All contract phases have validation tests
   → All update types have implementation tasks
   → All validation scenarios covered
9. Return: SUCCESS (tasks ready for execution) ✓
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
**Single project structure** (VS Code extension):
- Repository root: `package.json`, `package-lock.json`
- Source code: `src/` (TypeScript files)
- Tests: `src/test/` (VS Code extension testing framework)
- Build output: `out/`, `dist/`

## Phase 3.1: Setup and Preparation
- [ ] T001 [P] Create backup of package.json and package-lock.json files
- [ ] T002 [P] Install npm-check-updates (ncu) tool globally
- [ ] T003 [P] Verify current build state: npm run compile && npm test
- [ ] T004 [P] Run npm outdated to assess current dependency status
- [ ] T005 [P] Run npm audit to identify security vulnerabilities

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T006 [P] Contract test for Phase 1 analysis in src/test/contract/dependencyAnalysis.test.ts
- [ ] T007 [P] Contract test for Phase 2 patch/minor updates in src/test/contract/nonBreakingUpdates.test.ts
- [ ] T008 [P] Contract test for Phase 3 major updates in src/test/contract/majorUpdates.test.ts
- [ ] T009 [P] Contract test for Phase 4 validation in src/test/contract/updateValidation.test.ts
- [ ] T010 [P] Integration test for extension loading after updates in src/test/integration/extensionLoading.test.ts
- [ ] T011 [P] Integration test for build process validation in src/test/integration/buildVerification.test.ts
- [ ] T012 [P] Integration test for core functionality preservation in src/test/integration/functionalityPreservation.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
### Analysis Phase
- [ ] T013 Generate dependency update plan using ncu --dry-run --format json
- [ ] T014 Categorize dependencies by update type (patch/minor/major) and risk level
- [ ] T015 [P] Identify critical dependencies requiring careful testing
- [ ] T016 [P] Check VS Code API compatibility constraints

### Non-Breaking Updates
- [ ] T017 Apply patch version updates using ncu --target patch --upgrade
- [ ] T018 Install updated patch versions: npm install
- [ ] T019 Verify build after patch updates: npm run compile && npm run lint
- [ ] T020 Apply minor version updates using ncu --target minor --upgrade
- [ ] T021 Install updated minor versions: npm install  
- [ ] T022 Verify build and tests after minor updates: npm test

### Major Version Updates
- [ ] T023 Apply TypeScript major version update individually
- [ ] T024 Resolve TypeScript compilation issues if any
- [ ] T025 Apply webpack major version update individually
- [ ] T026 Update webpack configuration for compatibility
- [ ] T027 Apply @types/vscode major version update individually
- [ ] T028 Verify VS Code API compatibility
- [ ] T029 Apply remaining major version updates one by one
- [ ] T030 Test each major update individually

## Phase 3.4: Integration and Validation
- [ ] T031 Run full test suite: npm test
- [ ] T032 Build extension for production: npm run vscode:prepublish
- [ ] T033 Package extension: npm run package (if available)
- [ ] T034 [P] Verify extension bundle size hasn't increased significantly
- [ ] T035 [P] Test extension startup performance
- [ ] T036 [P] Validate markdown rendering performance with updated marked library

## Phase 3.5: Manual Testing and Polish
- [ ] T037 [P] Manual test: Load extension in VS Code development environment
- [ ] T038 [P] Manual test: Create and edit project notes
- [ ] T039 [P] Manual test: Verify webview rendering and markdown features
- [ ] T040 [P] Manual test: Test with no workspace folder
- [ ] T041 [P] Manual test: Test configuration changes (view location)
- [ ] T042 [P] Run security audit: npm audit
- [ ] T043 Update CLAUDE.md documentation with any breaking changes
- [ ] T044 [P] Create rollback procedure documentation
- [ ] T045 [P] Run final quickstart validation from quickstart.md
- [ ] T046 Commit all changes with detailed commit message

## Dependencies
**Critical Ordering**:
- Setup (T001-T005) before everything
- Tests (T006-T012) before implementation (T013-T030)
- Analysis (T013-T016) before updates (T017-T030)
- Patch updates (T017-T019) before minor updates (T020-T022)
- Minor updates (T020-T022) before major updates (T023-T030)
- Core implementation (T013-T030) before integration (T031-T036)
- Integration (T031-T036) before manual testing (T037-T046)

**Blocking Dependencies**:
- T013 blocks T014, T015, T016
- T017 blocks T018, T019
- T020 blocks T021, T022
- T023 blocks T024, T025 blocks T026, etc.
- T031 blocks T032, T033

## Parallel Example
```bash
# Setup phase - can run in parallel:
Task: "Create backup of package.json and package-lock.json files"
Task: "Install npm-check-updates (ncu) tool globally" 
Task: "Verify current build state: npm run compile && npm test"
Task: "Run npm outdated to assess current dependency status"

# Test creation phase - can run in parallel:
Task: "Contract test for Phase 1 analysis in src/test/contract/dependencyAnalysis.test.ts"
Task: "Contract test for Phase 2 patch/minor updates in src/test/contract/nonBreakingUpdates.test.ts"
Task: "Contract test for Phase 3 major updates in src/test/contract/majorUpdates.test.ts"

# Manual testing phase - can run in parallel:
Task: "Manual test: Load extension in VS Code development environment"
Task: "Manual test: Create and edit project notes"
Task: "Manual test: Verify webview rendering and markdown features"
```

## Error Handling Strategy
**Rollback Triggers**:
- Build failures during any update phase
- Test failures after dependency updates
- Extension fails to load in VS Code
- Performance regression detected
- Security vulnerabilities introduced

**Recovery Process**:
1. Stop update process immediately
2. Restore from backup: `cp package.json.backup package.json`
3. Reinstall original dependencies: `npm ci`
4. Verify rollback: `npm run compile && npm test`
5. Document problematic packages for exclusion

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Update Process Contract → 4 contract test tasks [P] (T006-T009)
   - Each phase → validation and implementation tasks

2. **From Data Model**:
   - Package Dependency entity → dependency analysis tasks (T013-T016)
   - Update Result entity → result validation tasks (T031-T033)
   - Compatibility Matrix → compatibility testing tasks (T027-T028)

3. **From User Stories**:
   - Extension functionality preservation → integration tests [P] (T010-T012)
   - Quickstart scenarios → manual validation tasks [P] (T037-T041)

4. **Ordering**:
   - Setup → Tests → Analysis → Updates → Validation → Polish
   - Sequential within update types, parallel across different files

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contract phases have corresponding tests (T006-T009)
- [x] All entities have model/analysis tasks (T013-T016)
- [x] All tests come before implementation (T006-T012 before T013+)
- [x] Parallel tasks truly independent (different files, no dependencies)
- [x] Each task specifies exact file path or command
- [x] No task modifies same file as another [P] task
- [x] Critical TDD order enforced: failing tests required before implementation
- [x] Error handling and rollback procedures included
- [x] Manual testing covers all user scenarios from quickstart.md

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing updates
- Commit after each major phase
- Monitor for peer dependency conflicts during updates
- Keep detailed log of problematic packages
- Test extension in actual VS Code environment, not just build process