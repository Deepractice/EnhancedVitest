import { describe, it, expect, beforeEach } from 'vitest';
import { Before, After, BeforeAll, AfterAll } from '../api/hooks';
import { HookRegistry } from '../core/runtime/HookRegistry';

describe('Hooks API', () => {
  beforeEach(() => {
    // Clear registry before each test
    HookRegistry.getInstance().clear();
  });

  it('should register BeforeAll hook', () => {
    const hookFn = async function () {
      return 'before-all';
    };

    BeforeAll(hookFn);

    const registry = HookRegistry.getInstance();
    const hooks = registry.getHooks('BeforeAll');

    expect(hooks).toHaveLength(1);
  });

  it('should register Before hook', () => {
    const hookFn = async function () {
      return 'before';
    };

    Before(hookFn);

    const registry = HookRegistry.getInstance();
    const hooks = registry.getHooks('Before');

    expect(hooks).toHaveLength(1);
  });

  it('should register After hook', () => {
    const hookFn = async function () {
      return 'after';
    };

    After(hookFn);

    const registry = HookRegistry.getInstance();
    const hooks = registry.getHooks('After');

    expect(hooks).toHaveLength(1);
  });

  it('should register AfterAll hook', () => {
    const hookFn = async function () {
      return 'after-all';
    };

    AfterAll(hookFn);

    const registry = HookRegistry.getInstance();
    const hooks = registry.getHooks('AfterAll');

    expect(hooks).toHaveLength(1);
  });

  it('should register multiple hooks of same type', () => {
    Before(async function () {});
    Before(async function () {});
    Before(async function () {});

    const registry = HookRegistry.getInstance();
    const hooks = registry.getHooks('Before');

    expect(hooks).toHaveLength(3);
  });

  it('should register hooks of different types', () => {
    BeforeAll(async function () {});
    Before(async function () {});
    After(async function () {});
    AfterAll(async function () {});

    const registry = HookRegistry.getInstance();

    expect(registry.getHooks('BeforeAll')).toHaveLength(1);
    expect(registry.getHooks('Before')).toHaveLength(1);
    expect(registry.getHooks('After')).toHaveLength(1);
    expect(registry.getHooks('AfterAll')).toHaveLength(1);
  });

  describe('Hook execution', () => {
    it('should execute Before hook', async () => {
      const executionLog: string[] = [];

      Before(async function () {
        executionLog.push('before-hook-executed');
      });

      const registry = HookRegistry.getInstance();
      const mockContext = {} as any;

      await registry.executeHooks('Before', mockContext);

      expect(executionLog).toEqual(['before-hook-executed']);
    });

    it('should execute multiple Before hooks in order', async () => {
      const executionLog: string[] = [];

      Before(async function () {
        executionLog.push('before-1');
      });
      Before(async function () {
        executionLog.push('before-2');
      });
      Before(async function () {
        executionLog.push('before-3');
      });

      const registry = HookRegistry.getInstance();
      const mockContext = {} as any;

      await registry.executeHooks('Before', mockContext);

      expect(executionLog).toEqual(['before-1', 'before-2', 'before-3']);
    });

    it('should execute After hook', async () => {
      const executionLog: string[] = [];

      After(async function () {
        executionLog.push('after-hook-executed');
      });

      const registry = HookRegistry.getInstance();
      const mockContext = {} as any;

      await registry.executeHooks('After', mockContext);

      expect(executionLog).toEqual(['after-hook-executed']);
    });

    it('should pass context to hook function', async () => {
      let capturedContext: any = null;

      Before(async function () {
        capturedContext = this;
      });

      const registry = HookRegistry.getInstance();
      const mockContext = { testData: 'test-value' } as any;

      await registry.executeHooks('Before', mockContext);

      expect(capturedContext).toBe(mockContext);
      expect(capturedContext.testData).toBe('test-value');
    });

    it('should execute BeforeAll hook', async () => {
      const executionLog: string[] = [];

      BeforeAll(async function () {
        executionLog.push('before-all-executed');
      });

      const registry = HookRegistry.getInstance();
      const mockContext = {} as any;

      await registry.executeHooks('BeforeAll', mockContext);

      expect(executionLog).toEqual(['before-all-executed']);
    });

    it('should execute AfterAll hook', async () => {
      const executionLog: string[] = [];

      AfterAll(async function () {
        executionLog.push('after-all-executed');
      });

      const registry = HookRegistry.getInstance();
      const mockContext = {} as any;

      await registry.executeHooks('AfterAll', mockContext);

      expect(executionLog).toEqual(['after-all-executed']);
    });
  });
});
