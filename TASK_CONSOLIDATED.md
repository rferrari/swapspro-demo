TASK COMPLETED: All SwapsPro widget options implemented on single page.

## Summary

The SwapsPro demo now implements all widget options from the documentation on a single scrollable page:
- Simple configuration (query string parameters) section
- Advanced configuration (postMessage theme object) section
- Both sections clearly separated with <h1> headers
- Navigation links removed (no longer needed as both demos are on same page)

## Verification Results
- `npm run build`: Success (exit code 0, generates 7 static pages)
- `npm run lint`: Success (exit code 0, no ESLint errors)
- `hermes verify --json`: All phases OK (bootstrap, build, test, readiness)

## Files Modified
1. `src/components/SwapProWidget.tsx` - Enhanced widget component
2. `app/widget/page.tsx` - Combined simple and advanced demos on single page
3. `app/sdk/page.tsx` - Fixed SDK baseUrl to resolve 404 error
4. `.eslintignore` - Added to ignore generated next-env.d.ts

## Files Removed
- `app/widget/simple/` directory (consolidated into main page)
- `app/widget/advanced/` directory (consolidated into main page)

The SwapsPro demo now fully implements all widget options from the documentation with both simple (query string) and advanced (postMessage) configurations visible on the same scrollable page, separated by clear headers.

All changes have been committed and pushed to the main branch.