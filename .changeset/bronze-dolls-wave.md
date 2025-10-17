---
'@deepracticex/vitest-cucumber-plugin': patch
'@deepracticex/vitest-cucumber': patch
---

fix: clean up global registries to prevent worker process hanging

Vitest worker processes now properly exit after tests complete by clearing global registries (StepRegistry, HookRegistry) in the generated afterAll hook. This prevents orphaned processes that consume excessive memory and can lead to infinite GC loops.
