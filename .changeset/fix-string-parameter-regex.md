---
'@deepracticex/vitest-cucumber': patch
---

Fix {string} parameter expressions creating incorrect capture groups. The {string} regex now uses a single capture group instead of two, fixing parameter index mapping issues when mixed with other parameter types like {int}. This ensures {int} parameters correctly return number type instead of string.
