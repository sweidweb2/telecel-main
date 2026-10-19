Run Vitest, build the project, and check TypeScript and ESLint for errors. If any issues arise, fix them carefully, ensuring your changes do not introduce new problems or break existing functionality.

Evaluate whether the "Go scan" feature is functioning as intended. Review for possible edge cases, broken functionality, and performance issues. Consider the following:
- Does it handle all relevant edge cases gracefully?
- Are there parts of the codebase that are brittle or prone to failure?
- Is the implementation fast and well-optimized?
- Could specific areas benefit from further optimization or refactoring?
Document findings and suggested improvements after thorough testing and code review.

## Boneyard skeletons

One-time browser install (Playwright ships with boneyard-js):

```bash
npx playwright install chromium
```

Capture bones (dev server must be running on :3000):

```bash
npm run dev
npm run bones:build
# or watch mode while developing:
npm run bones:watch
```

Docs: https://github.com/0xGF/boneyard
