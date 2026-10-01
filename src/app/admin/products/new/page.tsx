import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return <div><h2 className="text-xl">Add Product</h2><div className="mt-6"><ProductForm categories={categories} /></div></div>;
}