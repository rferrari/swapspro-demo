TASK COMPLETED: All SwapsPro widget options implemented on a single page.

## Summary of Work

### Widget Implementation
- Combined simple and advanced widget demos into one page (`/app/widget/page.tsx`)
- Simple section: Query string parameters (appearance, accent, radius, background, width, font, chrome, sell, buy, amount, proAddress)
- Advanced section: PostMessage theme object (colors, fontFamily, shape)
- Both sections use the enhanced `SwapsProWidget` component from `src/components/SwapProWidget.tsx`

### Changes Made
1. **Modified**:
   - `src/components/SwapProWidget.tsx` - Supports both configuration methods
   - `app/widget/page.tsx` - Now contains both simple and advanced demos in one scrollable page
   - `app/sdk/page.tsx` - Fixed SDK baseUrl to resolve 404 error
   - `.eslintignore` - Added to ignore generated next-env.d.ts

2. **Removed**:
   - `app/widget/simple/` directory
   - `app/widget/advanced/` directory

### Verification
- `npm run build`: Success (exit code 0, generates 7 static pages)
- `npm run lint`: Success (exit code 0, no ESLint errors)
- `hermes verify --json`: All phases OK (bootstrap, build, test, readiness)

### User Experience
Users can now:
- See the simple widget configuration (query string) at the top
- Scroll down to see the advanced widget configuration (postMessage theme object)
- Both sections have clear headers explaining what they demonstrate
- No need to navigate between pages - everything is on one scrollable page

The SwapsPro demo now fully implements all widget options from the documentation with both configuration methods visible on the same page, separated by clear headers.

All changes have been committed and pushed to the main branch.