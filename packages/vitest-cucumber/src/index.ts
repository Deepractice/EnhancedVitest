/**
 * @deepracticex/vitest-cucumber
 *
 * Runtime API for Cucumber BDD step definitions and hooks
 */

// Export public API for step definitions
export { Given, When, Then, And, But } from '~/api';
export { Before, After, BeforeAll, AfterAll } from '~/api';
export { setWorldConstructor } from '~/api';

// Export DataTable class (not just type)
export { DataTable } from '~/types';

// Export internal runtime classes (used by generated code and runtime.ts)
export { StepExecutor } from '~/core/runtime/StepExecutor';
export { ContextManager } from '~/core/runtime/ContextManager';
export { HookRegistry } from '~/core/runtime/HookRegistry';
export {
  StepRegistry,
  __setCurrentFeatureContext__,
  __getCurrentFeatureContext__,
  __resetWarningFlag__,
} from '~/core/runtime/StepRegistry';
export type {
  ExtendedStepDefinition,
  FeatureContext,
} from '~/core/runtime/StepRegistry';

// Export public types
export type {
  StepType,
  StepFunction,
  StepDefinition,
  Step,
  DocString,
  Scenario,
  Feature,
  StepContext,
} from '~/types';

// Note: core/ internals are now accessible via runtime re-export
// but should only be used by generated test code, not end users
