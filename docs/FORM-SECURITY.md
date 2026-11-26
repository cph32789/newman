# Stopping bot spam on the contact form

**Goal:** the doctor and his wife should never be flooded by bot email.

A web page alone cannot fully stop spam bots. Anything running in the visitor's
browser can be skipped by a determined bot, so the real protection must also
run on a **server** when the form is submitted. We use layers: each one stops
a different kind of bot, and together they stop almost all of it.

## Layer status

| # | Layer | What it stops | Where | Status |
|---|---|---|---|---|
| 1 | **Email address never published** (no `mailto:`, not in page code or structured data) | Bots that scrape websites for addresses | Page | **Live** |
| 2 | **Honeypot field** (invisible; people never fill it) | Simple form-filling bots | Page + server | **Live** (server re-checks) |
| 3 | **Time trap** (needs several seconds of real activity) | Bots that submit instantly | Page + server | **Live** (server re-checks) |
| 4 | **Human-activity check** (real pointer/keyboard events) | Scripted submissions | Page + server | **Live** |
| 5 | **Link and junk filter** (web links, spam keywords) | Link/SEO/crypto spam, the most common kind | Page + server | **Live** |
| 6 | **Cooldown and hourly cap** per browser | Repeat sends | Page + server | **Live** |
| 7 | **Silent traps** (a bot that trips a trap sees a normal "thanks", nothing is sent) | Bots learning what to avoid | Page + server | **Live** |
| 8 | **Cloudflare Turnstile** (invisible human check, no puzzles for most people) | Sophisticated bots | Page + server | **Wired, needs your Cloudflare keys** |
| 9 | **Server-side verification** of every field and token | Bots that skip the page entirely | Server | **Starter code written, needs deploying** (`server/form-worker.js`) |
| 10 | **Rate limit per IP and per email** | Floods from one source | Server | In starter code |
| 11 | **Email never goes straight to a person's inbox**: submissions go to a protected inbox first, with a spam folder | Anything that slips through | Server / Admin | Planned (Admin "Inbox") |
| 12 | **Disposable / throw-away email block** | Burner addresses | Server | In starter code |
| 13 | **Sender authentication (SPF, DKIM, DMARC)** on the practice's email domain | Spoofing, and keeps real mail out of spam folders | DNS | Needs domain access |
| 14 | **Admin protections** (two-step sign-in, lockout after failed tries) | Attacks on the Admin area itself | Admin | Planned with Admin |

## Why not a visible CAPTCHA
Puzzles ("click the traffic lights") frustrate people, especially our audience.
Turnstile runs invisibly and only asks for a tap when it is unsure.

## What we need from the practice to finish it
1. **A free Cloudflare account** (hosts the form service and Turnstile). We
   will walk through it together.
2. **Where should requests go?** One private address, which we keep out of the
   website and never publish. We recommend a dedicated address such as
   `requests@` that is not the practice's main inbox.
3. **Privacy and HIPAA decision.** Email is not a secure place for health
   information. Recommended: the notification email contains only the person's
   name, phone, email and interest. The "goals" text stays in the protected
   inbox. If the practice wants goals in email, we need an email service that
   signs a HIPAA business-associate agreement (BAA).
4. **Access to the practice's email domain DNS** to add SPF, DKIM and DMARC.
5. **Who gets alerts** if spam suddenly spikes.

## How it works once connected
1. A visitor fills the form. The page sends the request to our form service
   (not to an email address) with the invisible Turnstile token.
2. The service checks: token valid, honeypot empty, real activity and timing,
   no links or spam words, not a disposable email, not over the rate limit.
3. Passing requests are stored in the protected inbox and a short
   notification is sent to the practice. Failing requests are dropped
   silently (or filed in a spam folder for review).
4. Admin shows the inbox, a spam folder, and lets the team block a sender.

## Settings (public values only; secrets stay on the server)
In `redesign-v1/data/site.js`:
```
form: { endpoint: '', turnstileSiteKey: '', minSeconds: 4, cooldownSeconds: 90, maxPerHour: 3 }
```
Leave `endpoint` empty and the form works as a **design preview** that sends nothing.

## Starter code
`server/form-worker.js` is a reference Cloudflare Worker implementing layers
9, 10 and 12 and delivery. **It has not been deployed or tested against live
services.** It needs the Cloudflare and email-service accounts above, and a
review before it handles real patient requests.
