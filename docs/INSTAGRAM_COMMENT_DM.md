# Instagram comment-to-DM (free, official API)

When someone comments **SERVED** on an @askailegal post, they get one private DM with the free checklist, and a short public reply ("Sent! Check your DMs") appears under their comment.

- Code: `app/api/instagram/webhook/route.ts`, `lib/instagram/keywords.ts` (the words and messages), `lib/instagram/graph.ts`
- Webhook address: `https://askailegal.com/api/instagram/webhook`
- Checklist the DM links to: `public/checklists/first-48-hours-after-youre-served.pdf`
- Instagram rules: one private reply per comment, sent within 7 days of the comment. You can message the person again only after they reply.

## One-time setup (owner)

1. **Instagram account**: @askailegal must be a Professional account (Business or Creator).
2. **Create the Meta app**: go to developers.facebook.com → My Apps → Create app → choose the use case **"Manage messaging & content on Instagram"** (Instagram API with Instagram Login).
3. **Add the account**: in the app, open *Instagram → API setup with Instagram login*, press **Add account**, and sign in as @askailegal. Copy the **Instagram user ID** and generate an **access token**.
4. **Permissions**: the app needs `instagram_business_basic`, `instagram_business_manage_comments`, and `instagram_business_manage_messages`. Because the app is only used on your own account, standard access is enough (no App Review needed while it stays on your account).
5. **Vercel environment variables** (Project → Settings → Environment Variables, Production):
   - `IG_VERIFY_TOKEN`: any long secret phrase you make up
   - `IG_APP_SECRET`: *Instagram app secret* from the app's API setup page
   - `IG_ACCESS_TOKEN`: the access token from step 3
   - `IG_USER_ID`: the Instagram user ID from step 3

   Then redeploy so the site picks them up.
6. **Connect the webhook**: in the app's Instagram API setup, *Configure webhooks* → Callback URL `https://askailegal.com/api/instagram/webhook`, Verify token = the same `IG_VERIFY_TOKEN` → **Verify and save**. Then subscribe to the **comments** field.
7. **Test**: from a different Instagram account, comment `SERVED` on any @askailegal post. The DM should arrive within a few seconds. Vercel → Logs shows `instagram auto-dm: sent SERVED`.

## Adding another keyword

Add an entry to `COMMENT_KEYWORDS` in `lib/instagram/keywords.ts` (word, DM text, public reply) and deploy. Do not add "General information, not legal advice" to these messages; the website already covers it.

## Notes

- The access token expires after about 60 days. Refresh it in the Meta app (or generate a new one) and update `IG_ACCESS_TOKEN` in Vercel.
- If DMs stop, check Vercel logs for `not sent:` lines; they include Instagram's error message.
