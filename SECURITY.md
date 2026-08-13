# Security Policy

## Reporting a vulnerability

If you discover a security issue affecting Ask AI Legal, please report it responsibly:

- **Email:** security@askailegal.com (or support@askailegal.com if the security address is not yet active)
- **Do not** open a public GitHub issue for undisclosed vulnerabilities.

We aim to acknowledge reports within **3 business days** and will coordinate disclosure timing with you.

## Scope

In scope:

- askailegal.com and associated Vercel deployments
- Convex backend (`*.convex.site`, `*.convex.cloud`)
- Webhooks (Stripe, Cal.com, Resend inbound)
- Ops dashboard token authentication
- Counsel review access controls

Out of scope:

- Third-party services (Stripe, Cal.com, Resend, Clerk) — report to those vendors directly
- Social engineering or physical attacks

## Production security requirements

Before production traffic, configure these Convex environment variables:

```bash
npx convex env set CALCOM_WEBHOOK_SECRET "<long-random-secret>"
npx convex env set RESEND_INBOUND_WEBHOOK_SECRET "<long-random-secret>"
npx convex env set COUNSEL_EMAILS "counsel@askailegal.com,partner@example.com"
npx convex env set OPS_ACCESS_TOKEN "$(openssl rand -hex 32)"
```

Webhooks **reject** requests when their secrets are unset. Counsel review routes require an authenticated user whose email appears in `COUNSEL_EMAILS`.

## Supported versions

| Component | Supported |
|-----------|-----------|
| Production (`main` branch) | Yes |
| Older deployments | No |

## Secret rotation

Rotate `OPS_ACCESS_TOKEN`, webhook secrets, and API keys if:

- A team member with access leaves
- A secret may have been exposed (logs, chat, public repo history)
- You suspect unauthorized ops or webhook activity

After rotation, update Convex env vars and redeploy. Revoke old Stripe webhook endpoints if compromised.

## Repository visibility

This codebase may contain integration patterns and non-secret configuration. Keep production secrets only in Convex / Vercel environment settings — never commit them to git.
