import {
  Before,
  After,
  Given,
  When,
  Then,
} from '@deepracticex/vitest-cucumber';
import { expect } from 'vitest';

// Track hook execution
const executionLog: string[] = [];

Before(async function () {
  console.log('[HOOK] Before hook #1 executing');
  executionLog.push('before-1');
});

Before(async function () {
  console.log('[HOOK] Before hook #2 executing');
  executionLog.push('before-2');
});

Before(async function () {
  console.log('[HOOK] Before hook #3 executing');
  executionLog.push('before-3');
});

After(async function () {
  console.log('[HOOK] After hook executing');
  executionLog.push('after');
});

Given('the test environment is initialized', function () {
  console.log('[STEP] Background step executed');
  console.log('[DEBUG] Execution log before background:', [...executionLog]);
  executionLog.push('background-step');
});

When('I run a test step', function () {
  console.log('[STEP] Test step 1 executed');
  console.log('[DEBUG] Execution log before step 1:', [...executionLog]);
  executionLog.push('test-step-1');
});

When('I run another test step', function () {
  console.log('[STEP] Test step 2 executed');
  console.log('[DEBUG] Execution log before step 2:', [...executionLog]);
  executionLog.push('test-step-2');
});

Then('the Before hook should have executed', function () {
  console.log('[VERIFICATION] Checking Before hook execution');
  console.log('[VERIFICATION] Full execution log:', [...executionLog]);

  // Before hooks should execute before any steps in this scenario
  const beforeHooksPresent = executionLog.includes('before-1');

  if (!beforeHooksPresent) {
    console.error('[ERROR] Before hooks were NOT executed!');
    console.error('[ERROR] This confirms bug #24');
  }

  expect(beforeHooksPresent).toBe(true);
});

Then('all Before hooks should have executed in order', function () {
  console.log('[VERIFICATION] Checking multiple Before hooks execution');
  console.log('[VERIFICATION] Full execution log:', [...executionLog]);

  // All Before hooks should be present
  const allBeforeHooksPresent =
    executionLog.includes('before-1') &&
    executionLog.includes('before-2') &&
    executionLog.includes('before-3');

  if (!allBeforeHooksPresent) {
    console.error('[ERROR] Before hooks were NOT executed!');
    console.error('[ERROR] This confirms bug #24');
  }

  expect(allBeforeHooksPresent).toBe(true);

  // They should be in order
  const before1Index = executionLog.indexOf('before-1');
  const before2Index = executionLog.indexOf('before-2');
  const before3Index = executionLog.indexOf('before-3');

  if (before1Index >= 0 && before2Index >= 0 && before3Index >= 0) {
    expect(before1Index).toBeLessThan(before2Index);
    expect(before2Index).toBeLessThan(before3Index);
  }
});
