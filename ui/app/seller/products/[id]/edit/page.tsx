'use client';

import { useEffect, useState } from "react";
import {ProductService} from "@/services/productService";
import categoryService from "@/services/categoryService";
import { useParams, useRouter } from "next/navigation";
import { CategoryDto } from "@/types/product";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [form, setForm] = useState({
    name: "",
    price: 0,
    stockQuantity: 0,
    categoryId: ""
  });

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    ProductService.getProductById(id).then(res => {
      const p = res.data.data;
      setForm({
        name: p.name,
        price: p.price,
        stockQuantity: p.stockQuantity,
        categoryId: p.categoryId
      });
    });

    categoryService.getAll().then(res => setCategories(res.data.data || []));
  }, [id]);

  const submit = async (e: any) => {
    e.preventDefault();
    if (!file) return alert("Choose product image");

    await productService.update(id, {
      name: form.name,
      price: form.price,
      stockQuantity: form.stockQuantity,
      categoryId: form.categoryId,
      productImage: file
    });

    router.push(`/seller/products/${id}`);
  };

  return (
    <form onSubmit={submit}>
      <h1>Edit Product</h1>

      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

      <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />

      <input type="number" value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: Number(e.target.value) })} />

      <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
        <option value="">Select Category</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} />

      <button type="submit">Save Changes</button>
    </form>
  );
}
