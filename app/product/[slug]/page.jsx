import prisma from "@/lib/prisma";

export default async function ProductPage({ params }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug }, include: { variants: true, images: true } });
  if (!product) return <div style={{ padding: 24 }}>Not found</div>;

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.images?.[0]?.url || "/images/placeholder.jpg"} alt={product.images?.[0]?.alt || product.title} style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 12 }}/>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 16 }}>{product.title}</h1>
      <p style={{ color: "#555", marginTop: 8 }}>{product.description}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, marginTop: 16 }}>
        {product.variants.map(v => (
          <div key={v.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, fontSize: 14 }}>
            {v.size} / {v.color} — ${(v.priceCents/100).toFixed(2)} (Stock: {v.stockQty})
          </div>
        ))}
      </div>
    </main>
  );
}
