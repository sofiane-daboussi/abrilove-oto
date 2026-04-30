// ============================================================
// ABRILOVE WEBHOOK WORKER
// Route:
//   POST /stripe → traitement des events Stripe
// KV: ABRILOVE_PAID
// D1: DB (table: subscriptions)
// Secrets: STRIPE_WEBHOOK_SECRET, STRIPE_SECRET_KEY
// ============================================================

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  return bytes;
}

async function upsertSubscription(env, email, data) {
  const now = Date.now();
  await env.DB.prepare(`
    INSERT INTO subscriptions (email, status, customer_id, subscription_id, current_period_end, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      status = excluded.status,
      customer_id = excluded.customer_id,
      subscription_id = excluded.subscription_id,
      current_period_end = excluded.current_period_end,
      updated_at = excluded.updated_at
  `).bind(email, data.status, data.customerId || null, data.subscriptionId || null, data.currentPeriodEnd || null, now).run();
  const existingUser = await env.ABRILOVE_PAID.get(`user:${email}`);
  const userData = existingUser ? JSON.parse(existingUser) : {};
  userData.paid = data;
  await env.ABRILOVE_PAID.put(`user:${email}`, JSON.stringify(userData));
}

async function getEmailFromCustomer(env, customerId) {
  const res = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
  });
  const customer = await res.json();
  return customer.email || null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (request.method === 'POST' && url.pathname === '/stripe') {
      const body = await request.text();
      const sig  = request.headers.get('stripe-signature') || '';
      const encoder   = new TextEncoder();
      const keyData   = encoder.encode(env.STRIPE_WEBHOOK_SECRET);
      const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
      const parts   = sig.split(',').reduce((acc, part) => { const [k,v] = part.split('='); acc[k]=v; return acc; }, {});
      const payload = `${parts.t}.${body}`;
      const valid   = await crypto.subtle.verify('HMAC', cryptoKey, hexToBytes(parts.v1||''), encoder.encode(payload));
      if (!valid) return new Response('Invalid signature', { status: 400 });

      const event = JSON.parse(body);
      const obj   = event.data?.object;

      // ✅ PREMIER PAIEMENT — KV + D1 + Brevo liste 36
        if (
  (event.type === 'checkout.session.completed' && obj.payment_status === 'paid' && obj.mode === 'subscription') ||
  (event.type === 'customer.subscription.created' && obj.status === 'active')
) {
        let email = obj.customer_email || obj.customer_details?.email;
        if (!email && obj.customer) email = await getEmailFromCustomer(env, obj.customer);
        if (email) {
          await upsertSubscription(env, email, {
            status: 'active',
            customerId: obj.customer,
            subscriptionId: obj.subscription || obj.id,
            currentPeriodEnd: obj.current_period_end || null,
          });
          await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'api-key': env.BREVO_API_KEY },
            body: JSON.stringify({ email, listIds: [36], unlinkListIds: [38], updateEnabled: true }),
          });
        }
      }

      // 🔄 RENOUVELLEMENT — KV + D1 uniquement, pas Brevo
      if (event.type === 'invoice.payment_succeeded') {
        let email = obj.customer_email || obj.customer_details?.email;
        if (!email && obj.customer) email = await getEmailFromCustomer(env, obj.customer);
        if (email) {
          await upsertSubscription(env, email, {
            status: 'active',
            customerId: obj.customer,
            subscriptionId: obj.subscription || obj.id,
            currentPeriodEnd: obj.current_period_end || null,
          });
        }
      }

      // ⚠️ ANNULATION PRÉVUE
      if (event.type === 'customer.subscription.updated' && obj.cancel_at_period_end === true) {
        const email = await getEmailFromCustomer(env, obj.customer);
        if (email) {
          await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'api-key': env.BREVO_API_KEY },
            body: JSON.stringify({ email, attributes: { DESABONNEMENT_PREVU: 'oui' }, listIds: [39], updateEnabled: true }),
          });
        }
      }

      // ❌ ANNULATION DÉFINITIVE
      if (event.type === 'customer.subscription.deleted') {
        const email = await getEmailFromCustomer(env, obj.customer);
        if (email) {
          await upsertSubscription(env, email, {
            status: 'cancelled',
            customerId: obj.customer,
            subscriptionId: obj.id,
            currentPeriodEnd: obj.current_period_end || null,
          });
          fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'api-key': env.BREVO_API_KEY },
            body: JSON.stringify({ email, listIds: [38], unlinkListIds: [36], updateEnabled: true }),
          }).catch(() => {});
        }
      }

      // 💳 PAIEMENT ÉCHOUÉ
      if (event.type === 'invoice.payment_failed') {
        const email = await getEmailFromCustomer(env, obj.customer);
        if (email) {
          await upsertSubscription(env, email, {
            status: 'past_due',
            customerId: obj.customer,
            subscriptionId: obj.subscription || obj.id,
            currentPeriodEnd: obj.current_period_end || null,
          });
        }
      }

      return new Response('ok', { status: 200 });
    }

    return new Response('Not found', { status: 404 });
  },
};
