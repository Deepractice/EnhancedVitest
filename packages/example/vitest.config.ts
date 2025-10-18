import { defineConfig } from 'vitest/config';
import { vitestCucumber } from '@deepracticex/vitest-cucumber/plugin';

export default defineConfig({
  plugins: [
    vitestCucumber({
      steps: 'tests/e2e/steps',
    }),
  ],
  resolve: {
    // Force Vite to deduplicate @deepracticex/vitest-cucumber
    // This ensures only ONE instance of the module exists,
    // which is critical for singleton patterns like HookRegistry/StepRegistry
    dedupe: ['@deepracticex/vitest-cucumber'],
  },
  test: {
    include: ['**/*.feature'],
    globals: true,
  },
});
