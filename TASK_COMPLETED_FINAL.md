TASK COMPLETED: All SwapsPro widget options implemented and verified.

## Summary of Changes

### Widget Implementation
- Enhanced `src/components/SwapProWidget.tsx` to support:
  1. Simple configuration (query string parameters): appearance, accent, radius, background, width, font, chrome, sell, buy, amount, proAddress
  2. Advanced configuration (postMessage theme object): full theme object with colors, fontFamily, and shape
  3. Height update handling via `swapspro:height` messages
  4. Theme updates via `swapspro:style` postMessage

### Demonstration Pages
- Created `/app/widget/simple/page.tsx` - Simple query-string configuration demo
- Created `/app/widget/advanced/page.tsx` - Advanced postMessage theme configuration demo
- Updated `/app/widget/page.tsx` to include navigation links to both demos

### SDK Fix
- Fixed `/app/sdk/page.tsx`: Corrected baseUrl from "https://www.swaps.pro/api/sdk/v1" to "https://www.swaps.pro" to resolve 404 error

### Verification
- `npm run build`: Success (exit code 0, generates 9 static pages)
- `npm run lint`: Success (exit code 0, no ESLint errors)
- `hermes verify --json`: All phases OK (bootstrap, build, test, readiness)

### Files Modified
1. src/components/SwapProWidget.tsx
2. app/widget/simple/page.tsx
3. app/widget/advanced/page.tsx
4. app/widget/page.tsx
5. app/sdk/page.tsx
6. .eslintignore (added to ignore generated next-env.d.ts)

The SwapsPro demo now fully implements all widget options from the documentation with working examples and navigation between them. The SDK demo also works correctly.

All changes have been committed and pushed to the main branch.