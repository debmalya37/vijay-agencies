// src/app/admin/products/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Variant {
  color?: string;
  size?: string;
  shape?: string;
  stock: number;
  images: string[];
}

export default function NewProductPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    original_price: 0,
    discounted_price: 0,
    stocks: 0,
    is_in_stock: true,
    categories: [''],
    images: [''],
    variants: [] as Variant[],
    min_order_quantity: 1,
    seller_id: '',
  });
  const router = useRouter();

  const handleChange = (key: string, value: any) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleArrayChange = (key: 'categories' | 'images', idx: number, value: string) =>
    setForm(f => {
      const arr = [...f[key]];
      arr[idx] = value;
      return { ...f, [key]: arr };
    });

  const addArrayField = (key: 'categories' | 'images') =>
    setForm(f => ({ ...f, [key]: [...f[key], ''] }));

  // --- Variant handlers ---
  const addVariant = () =>
    setForm(f => ({
      ...f,
      variants: [...f.variants, { color: '', size: '', shape: '', stock: 0, images: [''] }],
    }));

  const updateVariant = (idx: number, field: keyof Variant, value: any) =>
    setForm(f => {
      const vs = [...f.variants];
      (vs[idx] as any)[field] = value;
      return { ...f, variants: vs };
    });

  const addVariantImage = (idx: number) =>
    setForm(f => {
      const vs = [...f.variants];
      vs[idx].images.push('');
      return { ...f, variants: vs };
    });

  const updateVariantImage = (vidx: number, iidx: number, url: string) =>
    setForm(f => {
      const vs = [...f.variants];
      vs[vidx].images[iidx] = url;
      return { ...f, variants: vs };
    });

  const removeVariant = (idx: number) =>
    setForm(f => ({
      ...f,
      variants: f.variants.filter((_, i) => i !== idx),
    }));

  const submit = async () => {
    const payload = {
      title: form.title,
      description: form.description,
      original_price: form.original_price,
      discounted_price: form.discounted_price,
      stocks: form.stocks,
      is_in_stock: form.is_in_stock,
      categories: form.categories.filter(c => c.trim()),
      images: form.images.filter(i => i.trim()),
      variants: form.variants.map(v => ({
        ...v,
        images: v.images.filter(u => u.trim()),
        stock: Number(v.stock),
      })),
      min_order_quantity: form.min_order_quantity,
      seller_id: form.seller_id || undefined,
    };

    try {
      await axios.post('/api/admin/products', payload);
      router.push('/admin/products');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <div className="space-y-6 max-w-3xl">
        {/* Basic fields */}
        {[
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'original_price', label: 'Original Price', type: 'number' },
          { key: 'discounted_price', label: 'Discounted Price', type: 'number' },
          { key: 'stocks', label: 'Stock Quantity', type: 'number' },
        ].map(fld => (
          <div key={fld.key}>
            <label className="block mb-1">{fld.label}</label>
            {fld.type === 'textarea' ? (
              <textarea
                value={(form as any)[fld.key]}
                onChange={e => handleChange(fld.key, e.target.value)}
                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                rows={3}
              />
            ) : (
              <input
                type={fld.type}
                value={(form as any)[fld.key]}
                onChange={e =>
                  handleChange(
                    fld.key,
                    fld.type === 'number' ? Number(e.target.value) : e.target.value
                  )
                }
                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
              />
            )}
          </div>
        ))}

        {/* In stock */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.is_in_stock}
            onChange={e => handleChange('is_in_stock', e.target.checked)}
            className="h-4 w-4 bg-gray-700"
          />
          <label>In Stock</label>
        </div>

        {/* Categories */}
        <section>
          <h2 className="font-semibold mb-2">Categories</h2>
          {form.categories.map((c, i) => (
            <div key={i} className="flex mb-2 space-x-2">
              <input
                value={c}
                onChange={e => handleArrayChange('categories', i, e.target.value)}
                className="flex-1 p-2 bg-gray-800 rounded border border-gray-700"
                placeholder="Category"
              />
            </div>
          ))}
          <button
            onClick={() => addArrayField('categories')}
            className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500"
          >
            + Add Category
          </button>
        </section>

        {/* Images */}
        <section>
          <h2 className="font-semibold mb-2">Image URLs</h2>
          {form.images.map((u, i) => (
            <div key={i} className="flex mb-2 space-x-2">
              <input
                value={u}
                onChange={e => handleArrayChange('images', i, e.target.value)}
                className="flex-1 p-2 bg-gray-800 rounded border border-gray-700"
                placeholder="https://..."
              />
            </div>
          ))}
          <button
            onClick={() => addArrayField('images')}
            className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500"
          >
            + Add Image
          </button>
        </section>

        {/* Variants */}
        <section>
          <h2 className="font-semibold mb-2">Variants</h2>
          {form.variants.map((v, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded mb-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Variant #{i + 1}</span>
                <button
                  onClick={() => removeVariant(i)}
                  className="text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(['color', 'size', 'shape'] as Array<keyof Variant>).map(k => (
                  <input
                    key={k}
                    placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
                    value={(v[k] as string) || ''}
                    onChange={e => updateVariant(i, k, e.target.value)}
                    className="p-2 bg-gray-700 rounded border border-gray-600"
                  />
                ))}
                <input
                  type="number"
                  placeholder="Stock"
                  value={v.stock || ""}
                  onChange={e => updateVariant(i, 'stock', Number(e.target.value))}
                  className="p-2 bg-gray-700 rounded border border-gray-600"
                />
              </div>
              <div>
                <h4 className="font-medium mb-1">Variant Images</h4>
                {v.images.map((img, j) => (
                  <input
                    key={j}
                    placeholder="https://..."
                    value={img}
                    onChange={e => updateVariantImage(i, j, e.target.value)}
                    className="w-full mb-2 p-2 bg-gray-700 rounded border border-gray-600"
                  />
                ))}
                <button
                  onClick={() => addVariantImage(i)}
                  className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-500 text-sm"
                >
                  + Add Image
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addVariant}
            className="px-3 py-1 bg-green-600 rounded hover:bg-green-500"
          >
            + Add Variant
          </button>
        </section>

        {/* Other fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Min Order Qty</label>
            <input
              type="number"
              value={form.min_order_quantity}
              onChange={e => handleChange('min_order_quantity', Number(e.target.value))}
              className="w-full p-2 bg-gray-800 rounded border border-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1">Seller ID (optional)</label>
            <input
              type="text"
              value={form.seller_id}
              onChange={e => handleChange('seller_id', e.target.value)}
              className="w-full p-2 bg-gray-800 rounded border border-gray-700"
            />
          </div>
        </div>

        <button
          onClick={submit}
          className="w-full py-3 bg-green-600 rounded hover:bg-green-500 font-bold"
        >
          Save Product
        </button>
      </div>
    </div>
  );
}
