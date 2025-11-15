"use client";
import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash, Image as ImgIcon, Package } from "lucide-react";
import Image from "next/image";

interface Product {
  _id: string;
  title: string;
  images?: string[];
}

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  is_active: boolean;
  product_ids: Product[];
}

export default function BrandManagement() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    is_active: true,
    product_ids: [] as string[],
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState("");

  useEffect(() => {
    fetchBrands();
    fetchProducts();
  }, []);

  const fetchBrands = async () => {
    const res = await fetch("/api/admin/brands", { cache: "no-store" });
    const data = await res.json();
  
    if (data?.success) {
      setBrands(data.brands);
    } else {
      setBrands([]);
    }
  };


  const fetchProducts = async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();

    Object.entries(formData).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach(item => fd.append("product_ids[]", item));
      } else {
        fd.append(k, String(v));
      }
    });

    if (logoFile) fd.append("logo", logoFile);

    const url = editingBrand
      ? `/api/admin/brands/${editingBrand._id}`
      : `/api/admin/brands`;

    const method = editingBrand ? "PUT" : "POST";

    const res = await fetch(url, { method, body: fd });
    setLoading(false);

    if (!res.ok) {
      alert("Error saving brand");
      return;
    }

    resetForm();
    fetchBrands();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      is_active: true,
      product_ids: [],
    });
    setLogoFile(null);
    setPreviewLogo("");
    setEditingBrand(null);
  };

  const editBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description ?? "",
      is_active: brand.is_active,
      product_ids: brand.product_ids?.map(p => p._id) || [],
    });
    setPreviewLogo(brand.logo ?? "");
    setShowModal(true);
  };

  const deleteBrand = async (id: string) => {
    if (!confirm("Delete this brand?")) return;
    await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
    fetchBrands();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setLogoFile(f);
      setPreviewLogo(URL.createObjectURL(f));
    }
  };

  const toggleProductSelect = (id: string) => {
    setFormData(prev => {
      const exists = prev.product_ids.includes(id);
      return {
        ...prev,
        product_ids: exists
          ? prev.product_ids.filter(p => p !== id)
          : [...prev.product_ids, id],
      };
    });
  };

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Brand Management</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
           onClick={() => { resetForm(); setShowModal(true); }}
        >
          <Plus size={18} /> Add Brand
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="p-3 text-left">Brand</th>
              <th className="p-3 text-left">Products</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands &&  brands.map((b:any) => (
              <tr key={b._id} className="border-b">
                <td className="p-3 flex items-center gap-3">
                  {b.logo ? (
                    <Image width={b.logo.width} height={b.logo.height} alt="image" src={b.logo} className="w-10 h-10 rounded object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <ImgIcon size={16} />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-xs text-gray-500">/{b.slug}</p>
                  </div>
                </td>
                <td className="p-3 text-sm">
                  {b.product_ids?.length} products
                </td>
                <td className="p-3">
                  {b.is_active ? (
                    <span className="text-green-600 text-sm font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 text-sm font-medium">Inactive</span>
                  )}
                </td>
                <td className="p-3 flex gap-3 text-blue-600">
                  <button onClick={() => editBrand(b)}>
                    <Edit size={18} />
                  </button>
                  <button onClick={() => deleteBrand(b._id)} className="text-red-600">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-2xl">
            <h2 className="font-semibold text-lg mb-4">
              {editingBrand ? "Edit Brand" : "Add Brand"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full border p-2 rounded"
                placeholder="Brand name"
                value={formData.name}
                onChange={e =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: generateSlug(e.target.value),
                  })
                }
              />

              <textarea
                className="w-full border p-2 rounded"
                placeholder="Description"
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              {/* Logo Upload */}
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {previewLogo && (
                <img src={previewLogo} className="w-24 h-24 object-cover rounded" />
              )}

              {/* Products multi-select */}
              <div>
                <p className="font-medium mb-2 text-sm">Select Products</p>
                <div className="border rounded p-2 h-40 overflow-y-auto grid grid-cols-2 gap-2">
                  {products.map(p => {
                    const checked = formData.product_ids.includes(p._id);
                    return (
                      <label key={p._id} className="text-sm flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleProductSelect(p._id)}
                        />
                        {p.images?.[0] ? (
                          <img src={p.images[0]} className="w-8 h-8 rounded object-cover" />
                        ) : (
                          <Package size={14} className="text-gray-500" />
                        )}
                        <span>{p.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Saving..." : "Save Brand"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="ml-2 px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
