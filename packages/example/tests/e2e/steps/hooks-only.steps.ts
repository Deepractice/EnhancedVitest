import { Before, Then } from '@deepracticex/vitest-cucumber';
import { expect } from 'vitest';

let hookExecuted = false;

Before(async function () {
  console.log('[TEST] Before hook IS EXECUTING - Bug #24 is FIXED!');
  hookExecuted = true;
});

Then('hooks executed', function () {
  console.log('[TEST] Checking if hook executed...');
  console.log('[TEST] hookExecuted =', hookExecuted);
  expect(hookExecuted).toBe(true);
});
