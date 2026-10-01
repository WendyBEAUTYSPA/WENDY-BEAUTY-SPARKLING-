import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/utils";
import DeleteProductButton from "./DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: { category: { select: { name: true } } } });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl">Products ({products.length})</h2>
        <Link href="/admin/products/new" className="rounded-full bg-goldSoft px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#241305]">+ Add Product</Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-panel text-xs uppercase tracking-wide text-inkInverseSoft">
            <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 text-inkInverseSoft">{p.category.name}</td>
                <td className="px-4 py-3">{formatNaira(p.price)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.66rem] uppercase tracking-wide">{p.status}</span></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-xs font-bold uppercase tracking-wide text-goldSoft">Edit</Link>
                    <DeleteProductButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {products.length === 0 && <p className="mt-6 text-inkInverseSoft">No products yet — run <code>npm run db:seed</code> or add one above.</p>}
    </div>
  );
}