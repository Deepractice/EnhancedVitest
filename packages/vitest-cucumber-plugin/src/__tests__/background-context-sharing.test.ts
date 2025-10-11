import { describe, it, expect } from 'vitest';
import { CodeGenerator } from '~/core/transformer/CodeGenerator';
import type { Feature } from '~/types';

describe('Background Context Sharing', () => {
  const generator = new CodeGenerator();

  it('should generate code that shares context between Background and Scenario', () => {
    const feature: Feature = {
      type: 'Feature',
      keyword: 'Feature',
      name: 'User Login',
      description: '',
      location: { line: 1, column: 1 },
      background: {
        type: 'Background',
        keyword: 'Background',
        name: '',
        description: '',
        location: { line: 3, column: 3 },
        steps: [
          {
            type: 'Step',
            keyword: 'Given',
            text: 'I have initialized the system',
            location: { line: 4, column: 5 },
          },
        ],
      },
      scenarios: [
        {
          type: 'Scenario',
          keyword: 'Scenario',
          name: 'Successful login',
          description: '',
          location: { line: 6, column: 3 },
          isOutline: false,
          steps: [
            {
              type: 'Step',
              keyword: 'When',
              text: 'I login with valid credentials',
              location: { line: 7, column: 5 },
            },
          ],
        },
      ],
      rules: [],
    };

    const code = generator.generate(feature);

    // Verify beforeEach accepts context parameter
    expect(code).toContain('beforeEach(async (context) => {');

    // Verify Background creates and stores contextManager in vitest context
    expect(code).toContain('context.contextManager = new ContextManager();');

    // Verify it block accepts context parameter
    expect(code).toContain("it('Successful login', async (context) => {");

    // Verify Scenario reuses contextManager from vitest context
    expect(code).toContain(
      'const contextManager = context.contextManager || new ContextManager();',
    );

    // Verify executor uses the shared context
    expect(code).toContain(
      'const cucumberContext = contextManager.getContext();',
    );
    expect(code).toContain(
      'const executor = new StepExecutor(cucumberContext);',
    );
  });

  it('should handle Scenario Outline with shared context', () => {
    const feature: Feature = {
      type: 'Feature',
      keyword: 'Feature',
      name: 'User Login',
      description: '',
      location: { line: 1, column: 1 },
      background: {
        type: 'Background',
        keyword: 'Background',
        name: '',
        description: '',
        location: { line: 3, column: 3 },
        steps: [
          {
            type: 'Step',
            keyword: 'Given',
            text: 'the system is ready',
            location: { line: 4, column: 5 },
          },
        ],
      },
      scenarios: [
        {
          type: 'Scenario',
          keyword: 'Scenario Outline',
          name: 'Login with different users',
          description: '',
          location: { line: 6, column: 3 },
          isOutline: true,
          steps: [
            {
              type: 'Step',
              keyword: 'When',
              text: 'I login as <user>',
              location: { line: 7, column: 5 },
            },
          ],
          examples: [
            {
              type: 'Examples',
              keyword: 'Examples',
              name: '',
              description: '',
              location: { line: 9, column: 5 },
              headers: ['user'],
              rows: [['admin'], ['guest']],
            },
          ],
        },
      ],
      rules: [],
    };

    const code = generator.generate(feature);

    // Verify beforeEach uses context parameter
    expect(code).toContain('beforeEach(async (context) => {');

    // Verify example tests accept context parameter
    expect(code).toMatch(/it\('Example:.*', async \(context\) => \{/);

    // Verify contextManager reuse
    expect(code).toContain(
      'const contextManager = context.contextManager || new ContextManager();',
    );
  });

  it('should handle Rule with Background context sharing', () => {
    const feature: Feature = {
      type: 'Feature',
      keyword: 'Feature',
      name: 'User Management',
      description: '',
      location: { line: 1, column: 1 },
      background: {
        type: 'Background',
        keyword: 'Background',
        name: '',
        description: '',
        location: { line: 3, column: 3 },
        steps: [
          {
            type: 'Step',
            keyword: 'Given',
            text: 'feature-level setup',
            location: { line: 4, column: 5 },
          },
        ],
      },
      scenarios: [],
      rules: [
        {
          type: 'Rule',
          keyword: 'Rule',
          name: 'Admin operations',
          description: '',
          location: { line: 6, column: 3 },
          background: {
            type: 'Background',
            keyword: 'Background',
            name: '',
            description: '',
            location: { line: 7, column: 5 },
            steps: [
              {
                type: 'Step',
                keyword: 'Given',
                text: 'rule-level setup',
                location: { line: 8, column: 7 },
              },
            ],
          },
          scenarios: [
            {
              type: 'Scenario',
              keyword: 'Scenario',
              name: 'Create user',
              description: '',
              location: { line: 10, column: 5 },
              isOutline: false,
              steps: [
                {
                  type: 'Step',
                  keyword: 'When',
                  text: 'I create a new user',
                  location: { line: 11, column: 7 },
                },
              ],
            },
          ],
        },
      ],
    };

    const code = generator.generate(feature);

    // Both feature-level and rule-level beforeEach should use context parameter
    const beforeEachMatches = code.match(
      /beforeEach\(async \(context\) => \{/g,
    );
    expect(beforeEachMatches).toBeTruthy();
    expect(beforeEachMatches!.length).toBeGreaterThanOrEqual(2);

    // Verify context sharing in rule scenarios
    expect(code).toContain("it('Create user', async (context) => {");
    expect(code).toContain(
      'const contextManager = context.contextManager || new ContextManager();',
    );
  });

  it('should generate fallback ContextManager when no Background exists', () => {
    const feature: Feature = {
      type: 'Feature',
      keyword: 'Feature',
      name: 'Simple Feature',
      description: '',
      location: { line: 1, column: 1 },
      scenarios: [
        {
          type: 'Scenario',
          keyword: 'Scenario',
          name: 'Simple test',
          description: '',
          location: { line: 3, column: 3 },
          isOutline: false,
          steps: [
            {
              type: 'Step',
              keyword: 'When',
              text: 'I do something',
              location: { line: 4, column: 5 },
            },
          ],
        },
      ],
      rules: [],
    };

    const code = generator.generate(feature);

    // Even without Background, Scenario should use context parameter
    expect(code).toContain("it('Simple test', async (context) => {");

    // Should create new ContextManager if not provided by Background
    expect(code).toContain(
      'const contextManager = context.contextManager || new ContextManager();',
    );
  });
});
