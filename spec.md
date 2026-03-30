# Akash Rawat - Digital World

## Current State
Full portfolio site with contact form that saves leads (name, phone, message, timestamp) to ICP backend. Backend has `getAllLeads()` (admin-only), `isCallerAdmin()`, and full authorization/role-based access control via the `authorization` component. No admin panel UI exists yet.

## Requested Changes (Diff)

### Add
- Admin panel page accessible at `/admin` route (or toggled via a hidden link)
- Login flow using ICP Internet Identity (via `useAuthClient` from authorization hooks)
- Once logged in as admin: display a table of all submitted leads (name, phone, message, timestamp)
- Logout button
- Empty state when no leads exist
- Loading state while fetching leads

### Modify
- App.tsx: add routing so `/admin` renders the AdminPanel component while `/` renders the existing portfolio

### Remove
- Nothing

## Implementation Plan
1. Create `src/frontend/src/AdminPanel.tsx` — admin panel component with login, lead table, logout
2. Wire `useAuthClient` from authorization hooks for login/logout
3. Call `actor.getAllLeads()` after confirming caller is admin via `actor.isCallerAdmin()`
4. Display leads in a clean table sorted newest first (reverse by timestamp)
5. Update `App.tsx` to use `window.location.pathname` to conditionally render AdminPanel vs main portfolio (no router library needed)
6. Add a small discreet "Admin" link in the footer
