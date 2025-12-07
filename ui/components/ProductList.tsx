"use client";

import React, { useEffect, useState } from "react";
import { Product, warehouseApi } from "../lib/warehouseApi";
import StockModal from "./StockModal";
import StockHistory from "./StockHistory";
import ProductForm from "./ProductForm";
import Modal from "./Modal";
import toast from "react-hot-toast";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mode, setMode] = useState<
    "add" | "remove" | "history" | "create" | "edit" | null
  >(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await warehouseApi.getProducts();
      setProducts(data);
    } catch {
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(p: Product) {
    if (!confirm(`Delete product '${p.name}'?`)) return;

    setBusyId(p.id);
    try {
      await warehouseApi.deleteProduct(p.id);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
      toast.success("Product deleted");
    } catch (err: any) {
      toast.error(err?.response?.data || "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {/* Top Bar */}
      <div className="flex justify-between mb-4">
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md w-64 text-amber-50"
        />

        <button
          onClick={() => setMode("create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Create Product
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading &&
        filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white border rounded-md p-4 mb-3 shadow-sm flex justify-between items-center"
          >
            <div>
              <div className="font-semibold text-lg">{p.name}</div>
              <div className="text-sm text-gray-500">{p.sku}</div>
              <div className="text-gray-600">Price: {p.price}</div>
              <div className="font-medium text-gray-700">
                Stock: {p.currentQuantity}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedProduct(p);
                  setMode("add");
                }}
                className="btn-secondary"
              >
                Add
              </button>

              <button
                onClick={() => {
                  setSelectedProduct(p);
                  setMode("remove");
                }}
                className="btn-secondary"
              >
                Remove
              </button>

              <button
                onClick={() => {
                  setSelectedProduct(p);
                  setMode("history");
                }}
                className="btn-secondary"
              >
                History
              </button>

              <button
                onClick={() => {
                  setSelectedProduct(p);
                  setMode("edit");
                }}
                className="btn-secondary"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(p)}
                disabled={busyId === p.id}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 disabled:bg-red-300"
              >
                {busyId === p.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}

      {mode === "create" && (
        <Modal onClose={() => setMode(null)}>
          <ProductForm
            onCancel={() => setMode(null)}
            onSaved={(prod) => {
              setMode(null);
              setProducts((prev) => [prod, ...prev]);
              toast.success("Product created");
            }}
          />
        </Modal>
      )}

      {/* Edit Product */}
      {selectedProduct && mode === "edit" && (
        <Modal
          onClose={() => {
            setSelectedProduct(null);
            setMode(null);
          }}
        >
          <ProductForm
            initial={selectedProduct}
            onCancel={() => {
              setSelectedProduct(null);
              setMode(null);
            }}
            onSaved={(updated) => {
              setProducts((prev) =>
                prev.map((x) => (x.id === updated.id ? updated : x))
              );
              setSelectedProduct(null);
              setMode(null);
              toast.success("Product updated");
            }}
          />
        </Modal>
      )}

      {/* Stock Modals */}
      {selectedProduct &&
        (mode === "add" || mode === "remove" || mode === "history") && (
          <Modal
            onClose={() => {
              setSelectedProduct(null);
              setMode(null);
            }}
          >
            {mode === "history" ? (
              <StockHistory
                product={selectedProduct}
                onClose={() => {
                  setSelectedProduct(null);
                  setMode(null);
                }}
              />
            ) : (
              <StockModal
                mode={mode as "add" | "remove"}
                product={selectedProduct}
                onClose={() => {
                  setSelectedProduct(null);
                  setMode(null);
                  loadProducts();
                }}
              />
            )}
          </Modal>
        )}
    </div>
  );
}