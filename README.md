# DNEG: Invitation-Based Membership Platform

A full-stack MERN application where membership is **invitation-only**. Visitors need a valid invitation code to apply, applicants wait in an admin-managed waiting list, and member-only features unlock only after an administrator approves the application.

> A valid invitation allows a person to **apply**. It never guarantees membership.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [How It Works](#how-it-works)
4. [Project Structure](#project-structure)
5. [Getting Started (Local)](#getting-started-local)
6. [Environment Variables](#environment-variables)
7. [API Reference](#api-reference)
8. [Deployment (Render + Vercel)](#deployment-render--vercel)
9. [Security Design](#security-design)
10. [Testing Checklist](#testing-checklist)
11. [Troubleshooting](#troubleshooting)
12. [Business Decisions and Limitations](#business-decisions-and-limitations)

---

## Features

**Public**
- Public pages are accessible without login.
- Registration requires a valid invitation code. Without one, an **Invitation Required** screen is shown.

**Registration and Application**
- Invitation validation checks: code exists, active, not expired, not revoked, remaining capacity.
- Account, application and invitation redemption are created in a single **MongoDB transaction**.
- Applicant profile: full name, email, phone, designation, company, industry, experience, location.
- Applicants can view their own application status, notifications and withdraw their application.

**Admin**
- Dashboard: total applicants, pending, under review, approved users, rejected.
- Application management: search, filter by status/priority, sort (newest, oldest, priority).
- Applicant details: profile, invitation code, inviter, review history (audit trail), internal admin notes.
- Actions: set priority (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), mark under review, approve, reject (with optional reason).
- Invitation management: generate codes with usage cap and expiry, revoke, view used/remaining capacity and redemption history.
- Member management: set each member's invitation quota, suspend and reactivate members.

**Members**
- Dashboard with membership status, invitation quota summary (total, generated, remaining) and invitation generation (max redemptions, expiry).
- In-app notifications with mark-as-read.

**Platform**
- Backend enforces every permission. The frontend guards are only for user experience.
- Audit log for all sensitive actions.
- Rate limiting on login, registration and invitation validation.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router, Axios, Tailwind CSS |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT in HttpOnly cookies, bcrypt password hashing |
| Security | Helmet, CORS, CSRF header and origin check, express-rate-limit |

---

## How It Works

### Account and Application Statuses

| Account status | Meaning |
|---|---|
| `INVITE_REQUIRED` | Access requested but no valid invitation redeemed |
| `PENDING_APPROVAL` | Valid invitation redeemed, waiting for admin decision |
| `ACTIVE` | Approved, member-only features enabled |
| `REJECTED` | Application rejected, member access blocked |
| `SUSPENDED` | Temporarily blocked (cannot log in) |
| `DISABLED` | Disabled by platform policy (cannot log in) |

| Application status | Meaning |
|---|---|
| `PENDING` | Awaiting review |
| `UNDER_REVIEW` | Admin is reviewing |
| `APPROVED` / `REJECTED` | Final decisions (only from `PENDING` or `UNDER_REVIEW`) |
| `WITHDRAWN` | Applicant withdrew |

Only an account with status `ACTIVE` and role `USER` receives member-only access.

### Flow

```
Visitor -> /register -> enter invitation code
                         |
          invalid / expired / revoked / exhausted -> rejected
                         |
                       valid
                         v
        Fill profile -> [transaction: create user + application
                         + record redemption + audit log]
                         v
        Account: PENDING_APPROVAL | Application: PENDING
                         v
        Admin reviews -> Under Review / Approve / Reject
                         v
        Approve -> Account ACTIVE -> member dashboard + invitations
```

### Invitation Quota vs. Invitation Max Uses

These are two separate concepts:

- **`maxUses`**: how many people can redeem **one** invitation code.
- **`invitationQuota`**: how many invitation codes a **member** may generate.

Quota is enforced on the backend with an atomic conditional update inside a transaction, so concurrent requests cannot exceed it. Revoking an invitation does **not** restore quota.

---

## Project Structure

```
.
├── backend
│   ├── server.js
│   └── src
│       ├── app.js
│       ├── config/          # MongoDB connection
│       ├── controller/      # auth, admin, invitation, user controllers
│       ├── middleware/      # auth, admin, active-member, CSRF, rate limits, errors
│       ├── models/          # User, Application, Invitation, AuditLog, Notification
│       ├── routes/          # auth, admin, invitation, user routes
│       └── utils/           # invitation code generator, token helpers
└── frontend
    ├── vercel.json
    └── src
        ├── components/      # auth, admin, member, home components
        ├── context/         # AuthContext
        ├── pages/           # Home, Login, Register, Dashboard, PendingApproval, admin pages
        └── services/        # Axios instance
```

### Frontend Routes

| Route | Access |
|---|---|
| `/`, `/login`, `/register` | Public |
| `/pending-approval` | Logged-in applicants (pending, rejected) |
| `/dashboard` | Active members only |
| `/admin`, `/admin/applications/:id`, `/admin/invitations`, `/admin/members` | Admins only |

---

## Getting Started (Local)

**Prerequisites:** Node.js 20+, a MongoDB Atlas cluster (transactions need a replica set, which Atlas provides).

```bash
# 1. Backend
cd backend
cp .env.example .env        # then fill in the values
npm install
npm run dev                 # http://localhost:3000

# 2. Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

### Creating the First Admin

The platform is invitation-only, so the very first admin has to be bootstrapped manually in MongoDB Atlas:

1. In Atlas, open the `invitations` collection and insert a document:
   ```json
   { "code": "INV-BOOTSTRAP", "maxUses": 1, "usedCount": 0, "status": "ACTIVE" }
   ```
2. Register on `/register` using the code `INV-BOOTSTRAP`.
3. In the `users` collection, edit your user: set `role` to `"ADMIN"` and `accountStatus` to `"ACTIVE"`.
4. Log in. You are now redirected to `/admin`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Long random secret for signing tokens | `openssl rand -hex 32` |
| `NODE_ENV` | `development` locally, `production` when deployed | `development` |
| `CLIENT_URL` | Exact frontend origin, **no trailing slash** | `http://localhost:5173` |
| `PORT` | Server port (Render sets this automatically) | `3000` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend base URL, **no trailing slash** | `http://localhost:3000` |

Never commit `.env` files.

---

## API Reference

All state-changing requests (`POST`, `PATCH`, `PUT`, `DELETE`) must include the headers `Origin: <CLIENT_URL>` and `X-CSRF-Protection: 1`. The frontend Axios instance adds the CSRF header automatically.

### Auth: `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public, rate-limited | Redeem invitation, create account and application |
| POST | `/login` | Public, rate-limited | Log in (blocked for `SUSPENDED` / `DISABLED`) |
| POST | `/logout` | Authenticated | Log out and invalidate token |
| GET | `/me` | Authenticated | Current user, status and quota |

### Invitations: `/api/invitations`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/validate` | Public, rate-limited | Check a code without consuming it |
| POST | `/member` | Active member | Generate a code using the member's quota |
| POST | `/` | Admin | Generate a code (no quota) |

### User: `/api/users`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/application` | Authenticated | Own application status |
| PATCH | `/application/withdraw` | Authenticated | Withdraw own application |
| GET | `/notifications` | Authenticated | Own notifications |
| PATCH | `/notifications/:id/read` | Authenticated | Mark a notification as read |
| GET | `/invitations` | Active member | Invitations generated by this member |

### Admin: `/api/admin` (admin only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List applications (`search`, `status`, `priority`, `sort=newest\|oldest\|priority`) |
| GET | `/stats` | Dashboard counts |
| GET | `/audit-logs` | All audit logs |
| GET | `/applications/:id` | Application details and review history |
| PATCH | `/applications/:id/priority` | Set priority |
| PATCH | `/applications/:id/review` | Mark under review |
| PATCH | `/applications/:id/approve` | Approve |
| PATCH | `/applications/:id/reject` | Reject (optional `rejectionReason`) |
| PATCH | `/applications/:id/notes` | Save internal admin notes |
| GET | `/members` | Active and suspended members with quota |
| PATCH | `/members/:memberId/quota` | Update a member's invitation quota |
| PATCH | `/members/:memberId/status` | Suspend (`SUSPENDED`) or reactivate (`ACTIVE`) |
| GET | `/invitations` | All invitations |
| POST | `/invitations` | Create invitation |
| GET | `/invitations/:id/redemptions` | Redemption history |
| PATCH | `/invitations/:id/revoke` | Revoke invitation |

Health check: `GET /health`

---

## Deployment (Render + Vercel)

Deploy in this order: **Atlas, then Render (backend), then Vercel (frontend), then update Render with the frontend URL.**

### 0. Code changes needed before deploying

**a) `backend/package.json`**: add a `start` script (Render runs this):

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

**b) `backend/src/app.js`**: trust Render's proxy, right after `const app = express();`:

```js
app.set("trust proxy", 1);
```

Without this, the rate limiter sees every user as the same IP.

**c) `frontend/vercel.json`**: so refreshing a route like `/admin` does not 404:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Push the project to GitHub (make sure `.env` is not committed).

### 1. MongoDB Atlas

1. Create a database user (username and password).
2. **Network Access**: add `0.0.0.0/0`. Render free instances use changing IPs.
3. Copy the connection string and set the database name in it.

### 2. Backend on Render

1. **New, Web Service**, connect your GitHub repo.
2. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. **Environment Variables:**

   | Key | Value |
   |---|---|
   | `MONGODB_URI` | your Atlas connection string |
   | `JWT_SECRET` | a long random string |
   | `NODE_ENV` | `production` |
   | `CLIENT_URL` | temporary placeholder, updated in step 4 |

   Do not set `PORT`; Render provides it.
4. Deploy and open `https://<your-service>.onrender.com/health`. You should see `Server is healthy`.

### 3. Frontend on Vercel

1. **Add New Project**, import the same repo.
2. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (Build: `npm run build`, Output: `dist`)
3. **Environment Variable:** `VITE_API_URL` = `https://<your-service>.onrender.com` (no trailing slash).
4. Deploy. Vite reads the variable at build time, so after changing it you must **redeploy**.

### 4. Connect them

Go back to Render, set `CLIENT_URL` to your exact Vercel URL, for example `https://your-app.vercel.app` (no trailing slash, `https`), and let it redeploy.

`CLIENT_URL` is used for both CORS and the CSRF origin check, so it must match the browser's origin exactly.

### 5. Create the first admin

Follow [Creating the First Admin](#creating-the-first-admin) using your Atlas collections.

### Deployment Notes

- **Cold starts:** Render's free tier sleeps after inactivity, so the first request can take 30 to 60 seconds. Open `/health` before a demo to wake it.
- **Cross-site cookies:** the frontend (`vercel.app`) and backend (`onrender.com`) are different sites, so login uses `SameSite=None; Secure` cookies. This works in Chrome, Edge and Firefox with default settings. **Safari and browsers that block third-party cookies will fail to keep the session.** The permanent fix is to serve both from one custom domain (for example `app.example.com` and `api.example.com`).
- Never reuse the local `.env` secrets in production. Generate a new `JWT_SECRET`.

---

## Security Design

- **Backend-enforced authorization.** Every protected route runs `authMiddleware`. Admin routes add `adminMiddleware`. Member routes add `activeMemberMiddleware` (role `USER` and status `ACTIVE`).
- **Account status checked on every request.** A suspended or disabled user's old token stops working immediately.
- **Atomic invitation redemption.** `usedCount` is incremented with a conditional update inside a transaction, so two requests cannot consume the last slot.
- **Atomic quota enforcement.** Member invitation generation reserves quota, creates the invitation and writes the audit log in one transaction.
- **Status guards.** Applications can only be approved or rejected from `PENDING` or `UNDER_REVIEW`.
- **Cookies and CSRF.** HttpOnly JWT cookie, `X-CSRF-Protection` header and `Origin` check on state-changing requests.
- **Brute-force protection.** Rate limits on login, registration and invitation validation.
- **Other.** Helmet headers, bcrypt password hashing, random unguessable invitation codes (`crypto`), escaped search input to prevent regex injection, and audit logs for admin and invitation actions.

---

## Testing Checklist

For Postman, send `Origin: <CLIENT_URL>` and `X-CSRF-Protection: 1` on write requests.

| # | Test | Expected |
|---|---|---|
| 1 | Open `/register` without a code | "Invitation Required" screen |
| 2 | Use invalid, revoked, expired and exhausted codes | Each rejected |
| 3 | Register with a valid code | Account `PENDING_APPROVAL`, application `PENDING`, redirected to `/pending-approval` |
| 4 | Pending user opens `/dashboard` or calls `POST /api/invitations/member` | Redirected / `403` |
| 5 | Normal user calls any `/api/admin/*` route | `403` |
| 6 | Admin approves a pending application | Account `ACTIVE`, notification created |
| 7 | Approve the same application again, or approve a rejected one | `400` |
| 8 | Reject with a reason | Applicant sees the reason |
| 9 | New member quota is `0` | Generate button disabled, API returns `403` |
| 10 | Admin sets quota to `2` | Member can create 2 invitations, the 3rd returns `403` |
| 11 | Member creates an invitation with `maxUses = 5` | Quota decreases by exactly 1 |
| 12 | Quota `1`, send 5 parallel member-invitation requests | Exactly 1 succeeds |
| 13 | Two users register with the last slot of a code | Exactly 1 succeeds |
| 14 | Revoke an invitation | Quota not restored, code can no longer be used |
| 15 | Suspend a member | Old session returns `403`, login blocked; reactivate restores access |
| 16 | Call `/api/invitations/validate` 21 times quickly | Rate limit message |
| 17 | Registering the same email twice | Rejected, no duplicate user or extra redemption |
| 18 | Admin changes priority, adds notes | Saved and visible in review history |

---

## Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| `403 CSRF protection: Request blocked` | `CLIENT_URL` does not exactly match the browser origin (trailing slash, `http` vs `https`, wrong domain) |
| CORS error in browser | Same as above, or `CLIENT_URL` not set on Render |
| Login succeeds but user is logged out on refresh | Cookie blocked. Check `NODE_ENV=production` on Render, use HTTPS, and avoid Safari or blocked third-party cookies |
| `404` when refreshing `/admin` on Vercel | `frontend/vercel.json` rewrite missing |
| Frontend calls `localhost` in production | `VITE_API_URL` not set on Vercel, or you did not redeploy after setting it |
| Backend cannot connect to database | Atlas Network Access does not allow `0.0.0.0/0`, or wrong `MONGODB_URI` |
| First request very slow | Render free tier cold start |
| Rate-limit `X-Forwarded-For` error in Render logs | Add `app.set("trust proxy", 1)` in `app.js` |
| Cookie not set during local development | Use `NODE_ENV=development` locally |

---

## Business Decisions and Limitations

**Decisions made (change if the business requires otherwise):**
- `SUSPENDED` and `DISABLED` users cannot log in.
- A member's default invitation quota is `0`; an admin assigns it after approval.
- Withdrawing an application keeps the account in `PENDING_APPROVAL`.
- Revoking an invitation does not restore the creator's quota.
- No-invite visitors only see the "Invitation Required" screen (no restricted account is created).

**Not implemented (out of MVP scope):**
- Email or phone verification
- Refresh-token rotation
- Pagination, and filters by date, inviter or designation
- Email or push delivery of notifications (in-app only)
- Bulk approve, automated scoring, appeals or reapplication policy
- Hashed invitation codes and admin MFA
- Public content API endpoint (public pages are static)
