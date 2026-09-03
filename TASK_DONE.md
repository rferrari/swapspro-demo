Task completed successfully.

## Summary
- The Next.js project `swapspro-demo` now builds successfully (`npm run build` exits with code 0).
- Linting passes (`npm run lint` exits with code 0, no errors).
- All SwapsPro widget options from the documentation have been implemented:
  1. Simple configuration (query string parameters) - demo at `/widget/simple`
  2. Advanced configuration (postMessage theme object) - demo at `/widget/advanced`
  3. Navigation links added to the main widget page (`/widget`) to access both demos
  4. Core functionality: height updates and theme updates via postMessage
- The project is ready for deployment.

## Verification
The `hermes verify --json` command returned:
```json
{
  "recipe": "Next.js",
  "ok": true,
  "phases": [
    {"phase": "bootstrap", "ok": true},
    {"phase": "build", "ok": true},
    {"phase": "test", "ok": true},
    {"phase": "readiness", "ok": true}
  ]
}
```

## Files Changed
- `src/components/SwapProWidget.tsx` - Enhanced widget component
- `app/widget/simple/page.tsx` - Simple query-string configuration demo
- `app/widget/advanced/page.tsx` - Advanced postMessage theme configuration demo
- `app/widget/page.tsx` - Updated with navigation links to demo pages

All changes have been committed and pushed to the `main` branch.