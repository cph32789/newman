/**
 * Contact-form service for Newman Plastic Surgery (Cloudflare Worker).
 *
 * STATUS: REFERENCE CODE. Not deployed and not tested against live services.
 * It needs a Cloudflare account, a Turnstile widget, a KV namespace and an
 * email service key. Review it before it handles real patient requests.
 * See docs/FORM-SECURITY.md for the plan and what the practice must decide.
 *
 * Secrets (set in Cloudflare, never in this repo or on the website):
 *   TURNSTILE_SECRET   Cloudflare Turnstile secret key
 *   RESEND_KEY         email service API key (or swap sendMail for another provider)
 *   MAIL_TO            the private address that receives notifications (NEVER published)
 *   MAIL_FROM          a verified sender on the practice's domain (SPF/DKIM/DMARC set up)
 * Plain settings:
 *   ALLOW_ORIGIN       e.g. https://cph32789.github.io  (the website's origin)
 *   INCLUDE_GOALS      "true" only if the email service has a HIPAA BAA; default: false
 * KV namespace binding: RL   (rate limits and the protected inbox)
 */

const MAX_BODY = 8 * 1024;
const BLOCKED_DOMAINS = new Set(['mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com', 'trashmail.com', 'yopmail.com', 'sharklasers.com', 'getnada.com', 'dispostable.com']);
const SPAM_WORDS = /(viagra|cialis|crypto|bitcoin|casino|seo services|backlinks|loan offer|click here|whatsapp|telegram|forex|guest post)/i;
const URLS = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|ru|xyz|top|click|info|biz)\b)/i;

const json = (obj, status, origin) => new Response(JSON.stringify(obj), {
  status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin' }
});

export default {
  async fetch(req, env) {
    const origin = env.ALLOW_ORIGIN;
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' } });
    if (req.method !== 'POST') return json({ ok: false }, 405, origin);
    if (req.headers.get('Origin') !== origin) return json({ ok: false }, 403, origin);          // only our website

    const raw = await req.text();
    if (raw.length > MAX_BODY) return json({ ok: false }, 413, origin);
    let body; try { body = JSON.parse(raw); } catch { return json({ ok: false }, 400, origin); }
    const d = body.data || {};
    const ip = req.headers.get('CF-Connecting-IP') || 'unknown';

    // Silent traps: a bot gets the same "ok" as a person, and nothing is sent.
    const silent = () => json({ ok: true }, 200, origin);
    if (body.hp) return silent();                                          // honeypot filled
    if (!(body.elapsed >= 4) || !(body.signals >= 4)) return silent();      // too fast / no human activity

    // Field validation
    const str = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
    const first = str(d.first, 80), last = str(d.last, 80), email = str(d.email, 254), phone = str(d.phone, 40), interest = str(d.interest, 60), goals = str(d.goals, 2000);
    if (!first || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ ok: false }, 422, origin);
    const domain = email.split('@')[1].toLowerCase();
    if (BLOCKED_DOMAINS.has(domain)) return silent();                       // throw-away address
    if (URLS.test([first, last, goals].join(' ')) || SPAM_WORDS.test([first, last, goals].join(' '))) return silent();

    // Human check (Cloudflare Turnstile)
    const ts = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: String(body.turnstile || ''), remoteip: ip })
    }).then(r => r.json()).catch(() => ({ success: false }));
    if (!ts.success) return silent();

    // Rate limits: per IP (5 / hour) and per email (3 / day)
    const bump = async (key, limit, ttl) => {
      const n = parseInt((await env.RL.get(key)) || '0', 10) + 1;
      await env.RL.put(key, String(n), { expirationTtl: ttl });
      return n > limit;
    };
    if (await bump('ip:' + ip, 5, 3600)) return silent();
    if (await bump('em:' + email.toLowerCase(), 3, 86400)) return silent();

    // Protected inbox (kept 30 days). Admin reads this; it is not public.
    const id = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    await env.RL.put('inbox:' + id, JSON.stringify({ first, last, email, phone, interest, goals, saved: Array.isArray(body.saved) ? body.saved.slice(0, 20) : [], ip, at: new Date().toISOString() }), { expirationTtl: 2592000 });

    // Notification email. By default it contains NO health details.
    const lines = [`New consultation request`, `Name: ${first} ${last}`.trim(), `Email: ${email}`, phone && `Phone: ${phone}`, interest && `Interested in: ${interest}`];
    if (env.INCLUDE_GOALS === 'true' && goals) lines.push(`Goals: ${goals}`); else if (goals) lines.push('(They added a message. View it in the protected inbox.)');
    await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { 'Authorization': 'Bearer ' + env.RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.MAIL_FROM, to: [env.MAIL_TO], reply_to: email, subject: 'New consultation request', text: lines.filter(Boolean).join('\n') })
    }).catch(() => {});
    return json({ ok: true }, 200, origin);
  }
};
