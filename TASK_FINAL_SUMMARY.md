TASK COMPLETED: All SwapsPro widget options implemented and verified.

## Summary

The SwapsPro demo now fully implements all widget options from the documentation:
- Simple configuration (query string parameters) at `/widget/simple`
- Advanced configuration (postMessage theme object) at `/widget/advanced`
- Navigation links on the main widget page (`/widget`) to both demos
- SDK demo fixed (corrected baseUrl to resolve 404 error)

All changes have been verified with:
- `npm run build`: Success (exit code 0, generates 9 static pages)
- `npm run lint`: Success (exit code 0, no ESLint errors)
- `hermes verify --json`: All phases OK (bootstrap, build, test, readiness)

## Files Modified
1. `src/components/SwapProWidget.tsx` - Enhanced widget component
2. `app/widget/simple/page.tsx` - Simple query-string configuration demo
3. `app/widget/advanced/page.tsx` - Advanced postMessage theme configuration demo
4. `app/widget/page.tsx` - Updated with navigation links to demo pages
5. `app/sdk/page.tsx` - Fixed SDK baseUrl to resolve 404 error
6. `.eslintignore` - Added to ignore generated next-env.d.ts

The project is ready for deployment.