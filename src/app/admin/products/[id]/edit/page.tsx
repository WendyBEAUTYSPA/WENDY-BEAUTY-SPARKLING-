import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "../../ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id }, include: { images: { orderBy: { sortOrder: "asc" } } } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } })
  ]);
  if (!product) notFound();
  return (
    <div>
      <h2 className="text-xl">Edit Product</h2>
      <div className="mt-6">
        <ProductForm categories={categories} productId={product.id} initial={{
          name: product.name, description: product.description, price: product.price, oldPrice: product.oldPrice,
          negotiable: product.negotiable, stock: product.stock, status: product.status, tag: product.tag, sku: product.sku,
          categoryId: product.categoryId, images: product.images.map((img) => img.url)
        }} />
      </div>
    </div>
  );
}