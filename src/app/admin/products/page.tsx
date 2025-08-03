'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface Product {
  _id: string;
  title: string;
  description?: string;
  original_price: number;
  discounted_price?: number;
  is_in_stock: boolean;
  stocks: number;
  categories: string[];
  images: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    axios.get<Product[]>('/api/admin/products').then(res => setProducts(res.data));
  }, []);

  // derive stats
  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter(p => p.is_in_stock).length;
    const outStock = total - inStock;
    const lowStock = products.filter(p => p.stocks < 5).length;
    return { total, inStock, outStock, lowStock };
  }, [products]);

  // filter & search
  const filtered = useMemo(() => {
    return products.filter(p => {
      const bySearch = p.title.toLowerCase().includes(search.toLowerCase());
      const byCat = filterCat === 'all' || p.categories.includes(filterCat);
      return bySearch && byCat;
    });
  }, [products, search, filterCat]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  // delete product
  const remove = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await axios.delete('/api/admin/products/' + id);
    setProducts(ps => ps.filter(p => p._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Link href="/admin/products/new" className="px-4 py-2 bg-green-600 rounded hover:bg-green-500">
          + Add New
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded shadow">
          <p className="text-sm uppercase">Total</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <p className="text-sm uppercase">In Stock</p>
          <p className="text-2xl font-semibold">{stats.inStock}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <p className="text-sm uppercase">Out of Stock</p>
          <p className="text-2xl font-semibold">{stats.outStock}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <p className="text-sm uppercase">Low Stock (&lt;5)</p>
          <p className="text-2xl font-semibold">{stats.lowStock}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Search by title…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full md:w-1/3 p-2 bg-gray-800 rounded border border-gray-700 focus:outline-none"
        />
        <select
          value={filterCat}
          onChange={e => { setFilterCat(e.target.value); setPage(1); }}
          className="p-2 bg-gray-800 rounded border border-gray-700"
        >
          <option value="all">All Categories</option>
          {/* hardcode or fetch your category list */}
          <option value="electronics">Electronics</option>
          <option value="apparel">Apparel</option>
          <option value="home">Home</option>
        </select>
      </div>

      {/* Product List */}
      <div className="overflow-x-auto bg-gray-800 rounded shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-700">
              {['Title','Price','Stock','Categories','Status','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-sm font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map(p => (
              <tr key={p._id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="px-4 py-2">{p.title}</td>
                <td className="px-4 py-2">₹{p.discounted_price ?? p.original_price}</td>
                <td className="px-4 py-2">{p.stocks}</td>
                <td className="px-4 py-2">{p.categories.join(', ')}</td>
                <td className="px-4 py-2">{p.is_in_stock ? '🟢' : '🔴'}</td>
                <td className="px-4 py-2 space-x-2">
                  <Link
                    href={`/admin/products/${p._id}`}
                    className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-500 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => remove(p._id)}
                    className="px-2 py-1 bg-red-600 rounded hover:bg-red-500 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
