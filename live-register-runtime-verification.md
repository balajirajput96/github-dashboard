# Live Register Runtime Verification

## 15 Aug 2026

The deployed cockpit's protected route was opened in a fresh browser context. It correctly rendered the private access gate and redirected the sign-in action to the Manus OAuth endpoint for the active application. This confirms that unauthenticated access remains gated.

The visible `Snapshot fallback` label in a prior preview is not, by itself, evidence that the protected `cockpit.portfolio` procedure failed: the preview capture can occur while the authenticated query is still resolving.

Managed preview verification completed after the pending-state clarification. The authenticated cockpit shell rendered the account chip and the top-bar label **Live public register · Just now**, rather than the access gate or snapshot fallback. The same capture showed the protected Overview workspace with live-state styling. Independently, the authenticated tRPC caller smoke test stubs a successful GitHub public response and asserts that `cockpit.portfolio` returns normalized live data; the full test suite and production build passed afterwards.
