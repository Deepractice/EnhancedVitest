import { describe, it, expect, beforeEach } from 'vitest';
import { Given, When, Then } from '../api/step-definitions';
import { StepRegistry } from '../core/runtime/StepRegistry';
import { StepExecutor } from '../core/runtime/StepExecutor';
import { ContextManager } from '../core/runtime/ContextManager';

describe('Parameter Type Conversion', () => {
  beforeEach(() => {
    // Clear registry before each test
    StepRegistry.getInstance().clear();
  });

  describe('{int} parameter', () => {
    it('should convert {int} to number type', async () => {
      let capturedValue: any;
      let capturedType: string;

      Given('the value is {int}', function (value: number) {
        capturedValue = value;
        capturedType = typeof value;
      });

      // Execute the step
      const contextManager = new ContextManager();
      const executor = new StepExecutor(contextManager.getContext());

      await executor.execute({
        keyword: 'Given',
        text: 'the value is 42',
      });

      expect(capturedType).toBe('number');
      expect(capturedValue).toBe(42);
      expect(capturedValue).not.toBe('42');
    });

    it('should handle negative integers', async () => {
      let capturedValue: any;

      Then('the result should be {int}', function (value: number) {
        capturedValue = value;
      });

      const contextManager = new ContextManager();
      const executor = new StepExecutor(contextManager.getContext());

      await executor.execute({
        keyword: 'Then',
        text: 'the result should be -404',
      });

      expect(typeof capturedValue).toBe('number');
      expect(capturedValue).toBe(-404);
    });

    it('should handle multiple {int} parameters', async () => {
      let value1: any;
      let value2: any;

      When('I add {int} and {int}', function (a: number, b: number) {
        value1 = a;
        value2 = b;
      });

      const contextManager = new ContextManager();
      const executor = new StepExecutor(contextManager.getContext());

      await executor.execute({
        keyword: 'When',
        text: 'I add 10 and 20',
      });

      expect(typeof value1).toBe('number');
      expect(typeof value2).toBe('number');
      expect(value1).toBe(10);
      expect(value2).toBe(20);
    });
  });

  describe('{float} parameter', () => {
    it('should convert {float} to number type', async () => {
      let capturedValue: any;
      let capturedType: string;

      Given('the price is {float}', function (value: number) {
        capturedValue = value;
        capturedType = typeof value;
      });

      const contextManager = new ContextManager();
      const executor = new StepExecutor(contextManager.getContext());

      await executor.execute({
        keyword: 'Given',
        text: 'the price is 19.99',
      });

      expect(capturedType).toBe('number');
      expect(capturedValue).toBe(19.99);
    });

    it('should handle integers as floats', async () => {
      let capturedValue: any;

      Then('the amount is {float}', function (value: number) {
        capturedValue = value;
      });

      const contextManager = new ContextManager();
      const executor = new StepExecutor(contextManager.getContext());

      await executor.execute({
        keyword: 'Then',
        text: 'the amount is 100',
      });

      expect(typeof capturedValue).toBe('number');
      expect(capturedValue).toBe(100);
    });
  });

  describe('{string} parameter', () => {
    it('should keep {string} as string type', async () => {
      let capturedValue: any;

      Given('the name is {string}', function (value: string) {
        capturedValue = value;
      });

      const contextManager = new ContextManager();
      const executor = new StepExecutor(contextManager.getContext());

      await executor.execute({
        keyword: 'Given',
        text: 'the name is "John Doe"',
      });

      expect(typeof capturedValue).toBe('string');
      expect(capturedValue).toBe('John Doe');
    });
  });

  describe('{word} parameter', () => {
    it('should keep {word} as string type', async () => {
      let capturedValue: any;

      When('I click {word}', function (value: string) {
        capturedValue = value;
      });

      const contextManager = new ContextManager();
      const executor = new StepExecutor(contextManager.getContext());

      await executor.execute({
        keyword: 'When',
        text: 'I click submit',
      });

      expect(typeof capturedValue).toBe('string');
      expect(capturedValue).toBe('submit');
    });
  });

  describe('Mixed parameter types', () => {
    it('should handle mixed int and string parameters', async () => {
      let name: any;
      let age: any;

      Given('{string} is {int} years old', function (n: string, a: number) {
        name = n;
        age = a;
      });

      const contextManager = new ContextManager();
      const executor = new StepExecutor(contextManager.getContext());

      await executor.execute({
        keyword: 'Given',
        text: '"Alice" is 25 years old',
      });

      expect(typeof name).toBe('string');
      expect(typeof age).toBe('number');
      expect(name).toBe('Alice');
      expect(age).toBe(25);
    });
  });
});
