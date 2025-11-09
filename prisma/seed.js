import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  const adminEmail = "admin@stepwise.dev";
  const adminPass = "admin123";
  const hash = await bcrypt.hash(adminPass + (process.env.PASSWORD_PEPPER || ""), 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash: hash, role: "ADMIN" },
  });

  const products = [
    {
      slug: "runner-pro",
      title: "Runner Pro",
      description: "Lightweight running shoe for daily miles.",
      basePriceCents: 9900,
      images: {
        create: [{ url: "/images/runner-pro-1.jpg", alt: "Runner Pro - main", sortOrder: 0 }],
      },
      variants: {
        create: [
          { size: "US 8", color: "Black", sku: "RP-BLK-8", priceCents: 9900, stockQty: 5 },
          { size: "US 9", color: "Black", sku: "RP-BLK-9", priceCents: 9900, stockQty: 5 },
          { size: "US 10", color: "Blue", sku: "RP-BLU-10", priceCents: 9900, stockQty: 3 },
        ],
      },
    },
    {
      slug: "city-sneak",
      title: "City Sneak",
      description: "Minimal sneaker for everyday wear.",
      basePriceCents: 8500,
      images: { create: [{ url: "/images/city-sneak-1.jpg", alt: "City Sneak - main", sortOrder: 0 }] },
      variants: {
        create: [
          { size: "US 7", color: "White", sku: "CS-WHT-7", priceCents: 8500, stockQty: 4 },
          { size: "US 8", color: "White", sku: "CS-WHT-8", priceCents: 8500, stockQty: 4 },
          { size: "US 9", color: "Black", sku: "CS-BLK-9", priceCents: 8500, stockQty: 2 },
        ],
      },
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", percentOff: 10 },
  });
}

main().finally(async () => prisma.$disconnect());
