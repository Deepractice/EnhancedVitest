---
"@deepracticex/vitest-cucumber": patch
---

Fix {string} parameter matching to support apostrophes and contractions

The {string} Cucumber expression pattern was using `[^"']` which excludes apostrophes/single quotes from the matched content. This caused step definitions to fail when feature files contained contractions like "What's", "don't", "can't" or possessives like "user's".

**Before** (broken):
```gherkin
When I send message "What's the weather?"  # ❌ No step definition found
```

**After** (fixed):
```gherkin
When I send message "What's the weather?"  # ✅ Matches When("I send message {string}", ...)
```

**Technical details**:
- Changed regex from `["']([^"']*)["\']` to `"([^"]*)"|'([^']*)'`
- Now uses separate patterns for double and single quoted strings
- Double-quoted strings can contain apostrophes: `"What's up?"`
- Single-quoted strings can contain double quotes: `'He said "hello"'`
- Creates two capture groups but only one matches (undefined is filtered in StepExecutor)

**Fixes matching for**:
- Contractions: don't, can't, won't, it's, what's, that's
- Possessives: user's, system's, agent's
- Mixed quotes: single quotes inside double quotes and vice versa
