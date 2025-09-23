'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

type Variant = { _id: string; color?: string; size?: string; shape?: string; stock: number; images: string[]; };
type Review  = { _id: string; user_id: string; rating: number; comment: string; created_at: string; };

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch single product
  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(res => { setForm(res.data); })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6 bg-gray-900 text-gray-100">Loading...</div>;
  if (error)   return <div className="p-6 bg-red-800 text-white">{error}</div>;
  if (!form)   return <div className="p-6 bg-gray-900 text-gray-100">No product</div>;

  // Handlers
  const handle = (k: string, v: any) => setForm((f:any)=>({ ...f, [k]: v }));
  const handleArray = (k: 'categories'|'images'|'variants', idx: number, v: any) => {
    const arr = [...form[k]]; arr[idx] = v; handle(k, arr);
  };
  const addField = (k: 'categories'|'images'|'variants') =>
    handle(k, [...form[k], k==='variants'?{ color:'',size:'',shape:'',stock:0,images:[''] }:'']);

  // Submit
  const save = async () => {
    try {
      await axios.patch(`/api/products/${id}`, form);
      router.push('/admin/products');
    } catch {
      setError('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <div className="space-y-6 max-w-3xl">
        {/* Basic fields */}
        {[
          { key:'title', label:'Title', type:'text' },
          { key:'description', label:'Description', type:'textarea' },
          { key:'original_price', label:'Original Price', type:'number' },
          { key:'discounted_price', label:'Discounted Price', type:'number' },
          { key:'stocks', label:'Stock Qty', type:'number' },
        ].map(f => (
          <div key={f.key}>
            <label className="block mb-1">{f.label}</label>
            {f.type==='textarea' ? (
              <textarea
                value={form[f.key] || ''}
                onChange={e => handle(f.key, e.target.value)}
                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                rows={3}
              />
            ) : (
              <input
                type={f.type}
                value={form[f.key] || ''}
                onChange={e => handle(f.key, f.type==='number'?+e.target.value:e.target.value)}
                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
              />
            )}
          </div>
        ))}

        {/* In Stock */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.is_in_stock}
            onChange={e => handle('is_in_stock', e.target.checked)}
            className="h-4 w-4 bg-gray-700"
          />
          <label>In Stock</label>
        </div>

        {/* Categories */}
        <section>
          <h2 className="font-semibold mb-2">Categories</h2>
          {form.categories?.map((c:string,i:number)=>(
            <div key={i} className="flex space-x-2 mb-2">
              <input
                value={c}
                onChange={e=>handleArray('categories',i,e.target.value)}
                className="flex-1 p-2 bg-gray-800 rounded border"
              />
            </div>
          ))}
          <button onClick={()=>addField('categories')}
            className="px-3 py-1 bg-blue-600 rounded">+ Category</button>
        </section>

        {/* Images */}
        <section>
          <h2 className="font-semibold mb-2">Image URLs</h2>
          {form.images?.map((u:string,i:number)=>(
            <div key={i} className="flex space-x-2 mb-2">
              <input
                value={u}
                onChange={e=>handleArray('images',i,e.target.value)}
                className="flex-1 p-2 bg-gray-800 rounded border"
              />
            </div>
          ))}
          <button onClick={()=>addField('images')}
            className="px-3 py-1 bg-blue-600 rounded">+ Image</button>
        </section>

        {/* Variants */}
        <section>
          <h2 className="font-semibold mb-2">Variants</h2>
          {form.variants?.map((v:Variant,i:number)=>(
            <div key={i} className="grid grid-cols-5 gap-2 mb-2">
              {['color','size','shape'].map(k=>(
                <input
                  key={k}
                  placeholder={k}
                  value={v[k as keyof Variant]||''}
                  onChange={e=>handleArray('variants',i,{...v,[k]:e.target.value})}
                  className="p-2 bg-gray-800 rounded border"
                />
              ))}
              <input
                type="number"
                placeholder="stock"
                value={v.stock}
                onChange={e=>handleArray('variants',i,{...v,stock:+e.target.value})}
                className="p-2 bg-gray-800 rounded border"
              />
            </div>
          ))}
          <button onClick={()=>addField('variants')}
            className="px-3 py-1 bg-blue-600 rounded">+ Variant</button>
        </section>

        {/* Reviews (read‑only) */}
        <section>
          <h2 className="font-semibold mb-2">Reviews</h2>
          {form.reviews?.map((r:Review)=>(
            <div key={r._id} className="bg-gray-800 p-3 rounded mb-2">
              <p><strong>Rating:</strong> {r.rating}/5</p>
              <p><strong>By:</strong> {r.user_id}</p>
              <p className="italic">“{r.comment}”</p>
              <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </section>

        {/* Other fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Min Order Quantity</label>
            <input
              type="number"
              value={form.min_order_quantity || ''}
              onChange={e=>handle('min_order_quantity',+e.target.value)}
              className="w-full p-2 bg-gray-800 rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Seller ID</label>
            <input
              type="text"
              value={form.seller_id||''}
              onChange={e=>handle('seller_id',e.target.value)}
              className="w-full p-2 bg-gray-800 rounded border"
            />
          </div>
        </div>

        {error && <div className="text-red-400">{error}</div>}
        <button
          onClick={save}
          className="w-full py-3 bg-green-600 rounded hover:bg-green-500 font-bold"
        >Update Product</button>
      </div>
    </div>
  );
}
