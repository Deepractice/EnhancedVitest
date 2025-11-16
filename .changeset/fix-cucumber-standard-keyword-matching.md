---
"@deepracticex/vitest-cucumber": patch
---

Fix step definition matching to follow Cucumber standard

Per Cucumber official documentation, keywords (Given/When/Then/And/But) should NOT be taken into account when looking for step definitions. Only the step text pattern matters.

**Breaking change behavior** (actually fixing non-standard behavior):
- Before: `When("I do X", ...)` only matched `When I do X` in feature files
- After: `When("I do X", ...)` now matches `Given I do X`, `When I do X`, `Then I do X`, `And I do X`, `But I do X`

This aligns with Cucumber.js, Cucumber-JVM, and other official Cucumber implementations.

Reference: https://cucumber.io/docs/gherkin/reference/
