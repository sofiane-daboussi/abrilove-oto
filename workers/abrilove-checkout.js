// ============================================================
// ABRILOVE CHECKOUT WORKER — Deferred Intent
// Routes:
//   POST /create-subscription  → crée customer + abonnement + retourne client_secret
//   POST /activate-subscription → enregistre accès KV + D1 après paiement
//   POST /check-paid-stripe    → vérifie abonnement Stripe + écrit KV + D1
// KV: ABRILOVE_PAID
// D1: DB (table: subscriptions)
// Secrets: STRIPE_SECRET_KEY, BREVO_API_KEY
// ============================================================

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    function json(data, status = 200) {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    async function upsertSubscription(email, status, customerId, subscriptionId, currentPeriodEnd) {
      await env.DB.prepare(`
        INSERT INTO subscriptions (email, status, customer_id, subscription_id, current_period_end, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
          status = excluded.status,
          customer_id = excluded.customer_id,
          subscription_id = excluded.subscription_id,
          current_period_end = excluded.current_period_end,
          updated_at = excluded.updated_at
      `).bind(email, status, customerId || null, subscriptionId || null, currentPeriodEnd || null, Date.now()).run();
    }

    const url = new URL(request.url);

    // POST /create-subscription
    if (request.method === 'POST' && url.pathname === '/create-subscription') {
      const body = await request.json().catch(() => ({}));
      const email = body.email || '';

      if (!email) return json({ error: 'Email requis.' }, 400);

      const customerRes = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + env.STRIPE_SECRET_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'email=' + encodeURIComponent(email),
      });
      const customer = await customerRes.json();
      if (customer.error) return json({ error: customer.error.message }, 400);

      const existingSub = await env.DB.prepare(
  "SELECT email FROM subscriptions WHERE email = ? AND status = 'active'"
).bind(email).first();

const subParams = new URLSearchParams();
subParams.append('customer', customer.id);
subParams.append('items[0][price]', 'price_1TFyxKI8ilInoMaXNdg6XQsR');
if (!existingSub) {
  subParams.append('discounts[0][coupon]', 'OP5Nwe0N');
}
subParams.append('payment_behavior', 'default_incomplete');
subParams.append('payment_settings[save_default_payment_method]', 'on_subscription');
subParams.append('expand[0]', 'latest_invoice.confirmation_secret');
subParams.append('expand[1]', 'pending_setup_intent');

      const subRes = await fetch('https://api.stripe.com/v1/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + env.STRIPE_SECRET_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: subParams.toString(),
      });
      const sub = await subRes.json();
      if (sub.error) return json({ error: sub.error.message }, 400);

      let clientSecret = null;
      if (sub.pending_setup_intent && sub.pending_setup_intent.client_secret) {
        clientSecret = sub.pending_setup_intent.client_secret;
      } else if (sub.latest_invoice && sub.latest_invoice.confirmation_secret && sub.latest_invoice.confirmation_secret.client_secret) {
        clientSecret = sub.latest_invoice.confirmation_secret.client_secret;
      }

      if (!clientSecret) return json({ error: 'Paiement non initialisé.' }, 400);

      return json({
        clientSecret: clientSecret,
        subscriptionId: sub.id,
        customerId: customer.id,
      });
    }

    // POST /activate-subscription
    if (request.method === 'POST' && url.pathname === '/activate-subscription') {
      const body = await request.json().catch(() => ({}));
      const { email, subscriptionId } = body;
      if (!email || !subscriptionId) return json({ ok: false }, 400);

      const subRes = await fetch('https://api.stripe.com/v1/subscriptions/' + subscriptionId, {
        headers: { 'Authorization': 'Bearer ' + env.STRIPE_SECRET_KEY },
      });
      const sub = await subRes.json();

      const existingUserA = await env.ABRILOVE_PAID.get(`user:${email}`);
      const userDataA = existingUserA ? JSON.parse(existingUserA) : {};
      userDataA.paid = { status: 'active', customerId: sub.customer || '', subscriptionId: subscriptionId, currentPeriodEnd: sub.current_period_end || null };
      await env.ABRILOVE_PAID.put(`user:${email}`, JSON.stringify(userDataA));
      await upsertSubscription(email, 'active', sub.customer || '', subscriptionId, sub.current_period_end || null);

      fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': env.BREVO_API_KEY },
        body: JSON.stringify({
          email: email,
          attributes: { ABONNE_ABRI: true },
          listIds: [36],
          unlinkListIds: [35],
          updateEnabled: true,
        }),
      }).catch(() => {});

      return json({ ok: true });
    }

    // POST /check-paid-stripe
    if (request.method === 'POST' && url.pathname === '/check-paid-stripe') {
      const { email } = await request.json().catch(() => ({}));
      if (!email) return json({ paid: false }, 400);

      const searchRes = await fetch('https://api.stripe.com/v1/customers/search?query=email%3A%22' + encodeURIComponent(email) + '%22', {
        headers: { 'Authorization': 'Bearer ' + env.STRIPE_SECRET_KEY },
      });
      const searchData = await searchRes.json();
      const customer = searchData.data && searchData.data[0];
      if (!customer) return json({ paid: false });

      const subRes = await fetch('https://api.stripe.com/v1/subscriptions?customer=' + customer.id + '&status=active', {
        headers: { 'Authorization': 'Bearer ' + env.STRIPE_SECRET_KEY },
      });
      const subData = await subRes.json();

      if (subData.data && subData.data.length > 0) {
        const sub = subData.data[0];
        const existingUserB = await env.ABRILOVE_PAID.get(`user:${email}`);
          const userDataB = existingUserB ? JSON.parse(existingUserB) : {};
          userDataB.paid = { status: 'active', customerId: customer.id, subscriptionId: sub.id, currentPeriodEnd: sub.current_period_end || null };
          await env.ABRILOVE_PAID.put(`user:${email}`, JSON.stringify(userDataB));
        await upsertSubscription(email, 'active', customer.id, sub.id, sub.current_period_end || null);
        return json({ paid: true });
      }

      return json({ paid: false });
    }

    return json({ error: 'Route inconnue' }, 404);
  },
};
