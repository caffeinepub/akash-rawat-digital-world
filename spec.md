# Akash Rawat - Digital World

## Current State
Backend has `bootstrapAdmin()` which auto-assigns the first logged-in user as admin and locks further assignments via `adminAssigned` flag. No token UI exists in the current AdminPanel. The `access-control.mo` still has an old `initialize()` function that accepted tokens (unused by main.mo). `backend.d.ts` has no reset function.

## Requested Changes (Diff)

### Add
- `resetAdminSystem()` backend function: callable only by current admin; clears all user roles and resets `adminAssigned` to false, allowing a fresh bootstrap.
- Reset button in AdminPanel for the logged-in admin to trigger a reset.
- Update `backend.d.ts` to include `resetAdminSystem(): Promise<void>`.

### Modify
- `main.mo`: add `resetAdminSystem()` function.
- `AdminPanel.tsx`: add a "Reset Admin System" button in the admin dashboard with confirmation.

### Remove
- Unused `initialize()` token function from `access-control.mo` (dead code cleanup).

## Implementation Plan
1. Add `resetAdminSystem()` to `main.mo` that checks admin, clears userRoles, resets adminAssigned.
2. Remove dead `initialize()` from `access-control.mo`; add `resetState()` helper.
3. Update `backend.d.ts` to add `resetAdminSystem`.
4. Add reset button with confirmation dialog in `AdminPanel.tsx`.
