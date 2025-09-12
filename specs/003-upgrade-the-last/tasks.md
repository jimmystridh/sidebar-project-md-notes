# Tasks: Upgrade Last Remaining Dependencies

**Input**: Design documents from `/specs/003-upgrade-the-last/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory ✓
   → Tech stack: TypeScript 5.9.2, VS Code extension
   → Libraries: @types/marked, @types/vscode, eslint
2. Load optional design documents: ✓
   → data-model.md: Target Dependency, Compatibility Assessment, Upgrade Decision entities
   → contracts/: Selective Upgrade Process Contract with 4 phases
   → research.md: Compatibility-first approach, skip decisions for 2/3 packages
3. Generate tasks by category: ✓
   → Setup: backup, assessment, current state validation
   → Tests: contract validation, compatibility testing
   → Core: @types/marked upgrade only, skip documentation
   → Integration: build verification, packaging validation
   → Polish: documentation updates, decision recording
4. Apply task rules: ✓
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...) ✓
6. Generate dependency graph ✓
7. Create parallel execution examples ✓
8. Validate task completeness: ✓
   → All contract phases have validation tasks
   → Skip decisions properly documented
   → Only viable upgrade (@types/marked) implemented
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

## Phase 3.1: Setup and Assessment
- [ ] T001 [P] Create backup of package.json and package-lock.json files
- [ ] T002 [P] Verify current build state: npm run compile && npm run package
- [ ] T003 [P] Check current versions of remaining dependencies: @types/marked, @types/vscode, eslint
- [ ] T004 [P] Run ncu to confirm remaining outdated packages
- [ ] T005 [P] Verify current marked library version compatibility with @types/marked

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T006 [P] Contract test for compatibility assessment process in src/test/contract/dependencyCompatibility.test.ts
- [ ] T007 [P] Contract test for @types/marked upgrade validation in src/test/contract/typesMarkedUpgrade.test.ts
- [ ] T008 [P] Contract test for package skip decision validation in src/test/contract/packageSkipDecision.test.ts
- [ ] T009 [P] Integration test for TypeScript compilation after @types/marked upgrade in src/test/integration/typesMarkedCompatibility.test.ts
- [ ] T010 [P] Integration test for extension packaging after changes in src/test/integration/extensionPackaging.test.ts
- [ ] T011 [P] Integration test for markdown functionality preservation in src/test/integration/markdownFunctionality.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
### Compatibility Assessment
- [ ] T012 Analyze @types/marked compatibility with marked 16.2.1 library version
- [ ] T013 [P] Document @types/vscode skip decision rationale in upgrade analysis
- [ ] T014 [P] Document ESLint skip decision rationale in upgrade analysis
- [ ] T015 Create compatibility decision matrix for all 3 packages

### @types/marked Upgrade Implementation
- [ ] T016 Check latest @types/marked version that supports marked 16.2.1
- [ ] T017 Apply @types/marked upgrade to latest compatible version
- [ ] T018 Install updated @types/marked: npm install @types/marked@latest --save-dev
- [ ] T019 Verify TypeScript compilation passes: npm run compile
- [ ] T020 Test markdown parsing functionality with updated types

### Skip Decision Implementation
- [ ] T021 [P] Confirm @types/vscode remains at 1.50.0 (VS Code packaging constraint)
- [ ] T022 [P] Confirm eslint remains at 8.57.1 (ecosystem compatibility)
- [ ] T023 [P] Document skip decisions in CLAUDE.md with rationale and reassessment triggers

## Phase 3.4: Integration and Validation
- [ ] T024 Run full TypeScript compilation: npm run compile
- [ ] T025 Run ESLint validation: npm run lint
- [ ] T026 Build extension for production: npm run vscode:prepublish
- [ ] T027 Package extension and verify success: npm run package
- [ ] T028 [P] Run security audit: npm audit
- [ ] T029 [P] Verify no new dependency vulnerabilities introduced

## Phase 3.5: Manual Testing and Documentation
- [ ] T030 [P] Manual test: Load extension in VS Code development environment
- [ ] T031 [P] Manual test: Create and edit project notes with markdown features
- [ ] T032 [P] Manual test: Verify webview markdown rendering works correctly
- [ ] T033 [P] Manual test: Test complex markdown syntax with updated @types/marked
- [ ] T034 Update CLAUDE.md with final upgrade results and skip decision documentation
- [ ] T035 [P] Create monitoring plan for skipped packages (@types/vscode, eslint)
- [ ] T036 [P] Document reassessment triggers for future upgrade cycles
- [ ] T037 [P] Run final quickstart validation from quickstart.md
- [ ] T038 Commit selective upgrade changes with detailed commit message

## Dependencies
**Critical Ordering**:
- Setup (T001-T005) before everything
- Tests (T006-T011) before implementation (T012-T023)
- Assessment (T012-T015) before upgrades (T016-T023)
- @types/marked upgrade (T016-T020) before validation (T024-T029)
- Core implementation (T012-T023) before integration (T024-T029)
- Integration (T024-T029) before manual testing (T030-T038)

**Blocking Dependencies**:
- T012 blocks T016 (assessment before upgrade)
- T016 blocks T017, T017 blocks T018, T018 blocks T019
- T024 blocks T025, T025 blocks T026, T026 blocks T027
- T034 blocks T038 (documentation before commit)

## Parallel Example
```bash
# Setup phase - can run in parallel:
Task: "Create backup of package.json and package-lock.json files"
Task: "Verify current build state: npm run compile && npm run package"
Task: "Check current versions of remaining dependencies"
Task: "Run ncu to confirm remaining outdated packages"

# Test creation phase - can run in parallel:
Task: "Contract test for compatibility assessment process in src/test/contract/dependencyCompatibility.test.ts"
Task: "Contract test for @types/marked upgrade validation in src/test/contract/typesMarkedUpgrade.test.ts" 
Task: "Contract test for package skip decision validation in src/test/contract/packageSkipDecision.test.ts"

# Documentation phase - can run in parallel:
Task: "Document @types/vscode skip decision rationale in upgrade analysis"
Task: "Document ESLint skip decision rationale in upgrade analysis"
Task: "Create monitoring plan for skipped packages"
```

## Selective Upgrade Strategy
**Based on research.md decisions:**

### Packages to Upgrade (1 of 3):
- **@types/marked**: 1.2.2 → latest compatible with marked 16.2.1
  - Rationale: Low risk, improves type definitions
  - Validation: TypeScript compilation, markdown functionality

### Packages to Skip (2 of 3):
- **@types/vscode**: Keep at 1.50.0
  - Rationale: VS Code packaging constraint (engines.vscode ^1.50.0)
  - Reassessment trigger: engines.vscode version increase
  
- **eslint**: Keep at 8.57.1  
  - Rationale: ESLint 9.x ecosystem compatibility issues
  - Reassessment trigger: Plugin ecosystem maturity for flat config

## Error Handling Strategy
**Rollback Triggers**:
- TypeScript compilation errors after @types/marked upgrade
- Extension packaging failures
- Markdown functionality regression
- Extension fails to load in VS Code

**Recovery Process**:
1. Stop upgrade process immediately
2. Restore from backup: `cp package.json.backup package.json`
3. Reinstall original dependencies: `npm ci`
4. Verify rollback: `npm run compile && npm run package`
5. Document problematic package version for future reference

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Selective Upgrade Process Contract → 4 contract test tasks [P] (T006-T008)
   - Each phase → assessment and implementation tasks

2. **From Data Model**:
   - Target Dependency entity → compatibility assessment tasks (T012-T015)
   - Compatibility Assessment entity → validation tasks (T024-T029)
   - Upgrade Decision entity → decision documentation tasks (T021-T023)

3. **From User Stories**:
   - Extension functionality preservation → integration tests [P] (T009-T011)
   - Quickstart scenarios → manual validation tasks [P] (T030-T033)

4. **Ordering**:
   - Setup → Tests → Assessment → Selective Implementation → Validation → Documentation
   - Only viable upgrades implemented, skip decisions documented

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contract phases have corresponding tests (T006-T008)
- [x] All entities have assessment/decision tasks (T012-T015)
- [x] All tests come before implementation (T006-T011 before T012+)
- [x] Parallel tasks truly independent (different files, no dependencies)
- [x] Each task specifies exact file path or command
- [x] No task modifies same file as another [P] task
- [x] Critical TDD order enforced: failing tests required before implementation
- [x] Skip decisions properly documented and justified
- [x] Manual testing covers all user scenarios from quickstart.md
- [x] Selective approach implemented (1 upgrade, 2 skips with rationale)

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing upgrades
- Document skip decisions with clear rationale
- Focus on @types/marked upgrade only - other packages have blocking constraints
- Maintain compatibility-first approach throughout process
- Test extension packaging after any changes to verify vsce compatibility