---
'@deepracticex/vitest-cucumber-plugin': minor
---

Share context between Background and Scenario steps to match Cucumber.js behavior

Background and Scenario steps now share the same ContextManager instance by leveraging Vitest's native context parameter mechanism. This ensures that state set in Background steps is accessible in Scenario steps, matching standard Cucumber.js behavior.

**Changes:**

- Modified `CodeGenerator.generateBackground()` to accept Vitest context and store ContextManager
- Modified `CodeGenerator.generateScenario()` to reuse ContextManager from context
- Modified `CodeGenerator.generateScenarioOutline()` to reuse ContextManager from context
- Added comprehensive tests for context sharing across different scenarios

**Impact:**

- Fixes issue #6: Background steps now properly share state with Scenario steps
- Reduces learning curve for users familiar with Cucumber.js
- Eliminates need for workarounds using Before hooks
- Background now works as expected in standard Cucumber usage patterns

**Migration:**

- Existing tests will continue to work
- Users who implemented workarounds in Before hooks can now rely on Background
- No breaking changes to user-facing APIs
