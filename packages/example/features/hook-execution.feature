Feature: Hook Execution Test
  Test that Before/After hooks are executed correctly

  Scenario: Before hook should execute
    Then the Before hook should have executed

  Scenario: Multiple Before hooks should execute in order
    Then all Before hooks should have executed in order
