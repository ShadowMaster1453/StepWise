import Stripe from "stripe";
import prisma from "@/lib/prisma";

export const runtime = "nodejs"; // ensure Node runtime

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const buf = Buffer.from(await req.arrayBuffer());

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const amount = session.amount_total || 0;
    const providerRef = session.id;

    // DEMO: create a simple paid order for admin user
    await prisma.payment.create({
      data: {
        provider: "stripe",
        providerRef,
        amountCents: amount,
        status: "paid",
        order: { create: { user: { connect: { id: (await prisma.user.findFirst({ where: { role: "ADMIN" } })).id } }, status: "PAID", totalCents: amount } }
      }
    });
  }

  return new Response(JSON.stringify({ received: true }), { headers: { "Content-Type": "application/json" } });
}
