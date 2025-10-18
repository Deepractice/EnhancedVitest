---
'@deepracticex/vitest-cucumber': patch
'@deepracticex/vitest-cucumber-plugin': patch
---

fix: StepExecutor now uses feature-scoped registry

Fixed issue where step definitions were not found during test execution. The StepExecutor now accepts an optional registry parameter and the CodeGenerator passes the feature-scoped registry to ensure step definitions are properly registered and found at runtime.
