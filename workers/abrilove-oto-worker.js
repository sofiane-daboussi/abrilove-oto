var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// oto-worker-clean.js
var ALLOWED_ORIGINS = ["https://abrilove.fr"];
var PRICE_IDS = {
  accro: "price_1Syc1DI8ilInoMaXjHSwGhQE",
  cerebrale: "price_1Syc0CI8ilInoMaXm6oM0m1C",
  reveuse: "price_1SybvJI8ilInoMaXKaWX4Ek0",
  louve: "price_1Sybz1I8ilInoMaXykfkZikR",
  applis: "price_1TNrJBI8ilInoMaX4KIkTsqY"
};
var BUMP_AMOUNT = 900;
var BUMP2_AMOUNT = 900;
function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
__name(corsHeaders, "corsHeaders");
async function stripePost(path, params, stripeKey) {
  const body = new URLSearchParams(params).toString();
  const res = await fetch(`https://api.stripe.com${path}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
  return res.json();
}
__name(stripePost, "stripePost");
var oto_worker_clean_default = {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/create-payment-intent") {
      try {
        const { profil, email, bump, bump2 } = await request.json();
        const priceId = PRICE_IDS[profil];
        if (!priceId) {
          return new Response(JSON.stringify({ error: "Profil invalide" }), {
            status: 400,
            headers: { ...headers, "Content-Type": "application/json" }
          });
        }
        const priceRes = await fetch(`https://api.stripe.com/v1/prices/${priceId}`, {
          headers: { "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}` }
        });
        const price = await priceRes.json();
        const amount = price.unit_amount + (bump ? BUMP_AMOUNT : 0) + (bump2 ? BUMP2_AMOUNT : 0);
        const params = {
          amount,
          currency: price.currency,
          "automatic_payment_methods[enabled]": "true",
          "metadata[profil]": profil,
          "metadata[price_id]": priceId,
          "metadata[bump]": bump ? "applis" : "",
          "metadata[bump2]": bump2 ? "ghosting" : ""
        };
        if (email) params.receipt_email = email;
        const intent = await stripePost("/v1/payment_intents", params, env.STRIPE_SECRET_KEY);
        if (intent.error) {
          return new Response(JSON.stringify({ error: intent.error.message }), {
            status: 400,
            headers: { ...headers, "Content-Type": "application/json" }
          });
        }
        return new Response(JSON.stringify({ clientSecret: intent.client_secret }), {
          status: 200,
          headers: { ...headers, "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { ...headers, "Content-Type": "application/json" }
        });
      }
    }
    if (request.method === "POST" && url.pathname === "/stripe-webhook") {
      try {
        const body = await request.text();
        const sig = request.headers.get("stripe-signature");
        const event = await verifyStripeWebhook(body, sig, env.STRIPE_WEBHOOK_SECRET_OTO);
        if (event.type === "payment_intent.succeeded") {
          const intent = event.data.object;
          const profil = intent.metadata?.profil;
          const bump = intent.metadata?.bump;
          const bump2 = intent.metadata?.bump2;
          const email = intent.receipt_email;
          const brevoLists = {
            accro: 26,
            cerebrale: 28,
            reveuse: 27,
            louve: 29
          };
          const listId = brevoLists[profil];
          if (email && listId) {
            await fetch("https://api.brevo.com/v3/contacts", {
              method: "POST",
              headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "api-key": env.BREVO_API_KEY
              },
              body: JSON.stringify({
                email,
                attributes: { PROFIL_ATTACHEMENT: profil },
                listIds: [listId],
                updateEnabled: true
              })
            });
          }
          if (email && bump === "applis") {
            await fetch("https://api.brevo.com/v3/contacts", {
              method: "POST",
              headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "api-key": env.BREVO_API_KEY
              },
              body: JSON.stringify({
                email,
                listIds: [17],
                updateEnabled: true
              })
            });
          }
          if (email && bump2 === "ghosting") {
            await fetch("https://api.brevo.com/v3/contacts", {
              method: "POST",
              headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "api-key": env.BREVO_API_KEY
              },
              body: JSON.stringify({
                email,
                listIds: [18],
                updateEnabled: true
              })
            });
          }
        }
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { ...headers, "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" }
        });
      }
    }
    if (request.method === "POST" && url.pathname === "/api/contact") {
      try {
        const { name, email, message } = await request.json();
        if (!name || !email || !message) {
          return new Response(JSON.stringify({ error: "Champs manquants" }), {
            status: 400,
            headers: { ...headers, "Content-Type": "application/json" }
          });
        }
        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: { "accept": "application/json", "content-type": "application/json", "api-key": env.BREVO_API_KEY },
          body: JSON.stringify({
            sender: { email: "noreply@abrilove.fr", name: "Contact Abrilove" },
            to: [{ email: "bonjour@abrilove.fr" }],
            replyTo: { email, name },
            subject: `\u2709\uFE0F Message de ${name}`,
            htmlContent: `<p><strong>De :</strong> ${name} &lt;${email}&gt;</p><p><strong>Message :</strong></p><p>${message.replace(/\n/g, "<br>")}</p>`
          })
        });
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { ...headers, "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { ...headers, "Content-Type": "application/json" }
        });
      }
    }
    if (request.method === "POST" && url.pathname === "/api/newsletter") {
      try {
        const { email } = await request.json();
        if (!email) {
          return new Response(JSON.stringify({ error: "Email requis" }), {
            status: 400,
            headers: { ...headers, "Content-Type": "application/json" }
          });
        }
        const res = await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: { "accept": "application/json", "content-type": "application/json", "api-key": env.BREVO_API_KEY },
          body: JSON.stringify({ email, listIds: [21], updateEnabled: true })
        });
        const ok = res.status >= 200 && res.status < 300;
        return new Response(JSON.stringify({ ok }), {
          status: ok ? 200 : 500,
          headers: { ...headers, "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { ...headers, "Content-Type": "application/json" }
        });
      }
    }
    return new Response("Not found", { status: 404, headers });
  }
};
async function verifyStripeWebhook(payload, sig, secret) {
  const encoder = new TextEncoder();
  const parts = sig.split(",");
  const timestamp = parts.find((p) => p.startsWith("t=")).split("=")[1];
  const v1 = parts.find((p) => p.startsWith("v1=")).split("=")[1];
  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
  const expected = Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
  if (expected !== v1) throw new Error("Signature invalide");
  return JSON.parse(payload);
}
__name(verifyStripeWebhook, "verifyStripeWebhook");
export {
  oto_worker_clean_default as default
};
//# sourceMappingURL=oto-worker-clean.js.map

