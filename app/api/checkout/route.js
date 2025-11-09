import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });

export async function POST(req) {
  const { items } = await req.json(); // items: [{ variantId, qty }]

  const variantIds = (items || []).map(i => i.variantId);
  const variants = await prisma.variant.findMany({ where: { id: { in: variantIds } }, include: { product: true } });

  const line_items = (items || []).map(i => {
    const v = variants.find(x => x.id === i.variantId);
    if (!v) throw new Error("Variant not found");
    return {
      quantity: i.qty,
      price_data: {
        currency: "usd",
        unit_amount: v.priceCents,
        product_data: { name: `${v.product.title} — ${v.size} / ${v.color}` },
      },
    };
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${process.env.NEXTAUTH_URL}/orders?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart?canceled=1`,
  });

  return new Response(JSON.stringify({ url: session.url }), { headers: { "Content-Type": "application/json" } });
}
