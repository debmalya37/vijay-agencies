// src/app/admin/orders/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';

interface OrderItem {
  product_id: { title: string };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user_id: { username: string; usermail: string };
  total_amount: number;
  created_at: string;
  status: string;
  product_details: OrderItem[];
  address_id: {
    address_line1: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
}

const demoOrders: Order[] = [
  {
    _id: 'ORD12345',
    user_id: { username: 'john_doe', usermail: 'john@example.com' },
    total_amount: 1499,
    created_at: '2025-07-28T10:30:00Z',
    status: 'pending',
    product_details: [
      { product_id: { title: 'Premium Leather Wallet' }, quantity: 1, price: 799 },
      { product_id: { title: 'Stainless Water Bottle' }, quantity: 2, price: 350 },
    ],
    address_id: {
      address_line1: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400001',
    },
  },
  {
    _id: 'ORD67890',
    user_id: { username: 'jane_smith', usermail: 'jane@example.com' },
    total_amount: 2599,
    created_at: '2025-07-29T14:45:00Z',
    status: 'shipped',
    product_details: [
      { product_id: { title: 'Wireless Earbuds' }, quantity: 1, price: 1999 },
      { product_id: { title: 'City Backpack' }, quantity: 1, price: 600 },
    ],
    address_id: {
      address_line1: '456 Park Ave',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      pincode: '110001',
    },
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selected, setSelected] = useState<Order | null>(null);
  const perPage = 10;

  useEffect(() => {
    axios.get('/api/admin/orders')
      .then(res => {
        if (res.data.length) {
          setOrders(res.data);
        }
      })
      .catch(() => {
        // keep demo orders on error
      });
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    return { total, pending, shipped, delivered, cancelled };
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = filterStatus === 'all' || o.status === filterStatus;
      const matchSearch =
        o._id.includes(search) ||
        o.user_id.usermail.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [orders, filterStatus, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const updateStatus = async (id: string, status: string) => {
    await axios.patch('/api/admin/orders', { id, status });
    setOrders(o => o.map(x => (x._id === id ? { ...x, status } : x)));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {Object.entries(stats).map(([key, val]) => (
          <div key={key} className="bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm uppercase">{key.replace('_', ' ')}</p>
            <p className="text-2xl font-semibold">{val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <label className="text-sm">Status:</label>
          <select
            className="bg-gray-800 border border-gray-700 p-2 rounded"
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search by ID or email..."
          className="bg-gray-800 border border-gray-700 p-2 rounded w-full md:w-1/3"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-800 rounded shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-700">
              {['Order ID', 'Customer', 'Amount', 'Date', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-sm font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map(o => (
              <tr key={o._id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="px-4 py-2 truncate max-w-xs">{o._id}</td>
                <td className="px-4 py-2">
                  {o.user_id.username}
                  <br/>
                  <span className="text-xs text-gray-400">{o.user_id.usermail}</span>
                </td>
                <td className="px-4 py-2">₹{o.total_amount.toLocaleString()}</td>
                <td className="px-4 py-2">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <select
                    value={o.status}
                    onChange={e => updateStatus(o._id, e.target.value)}
                    className="bg-gray-800 border border-gray-600 p-1 rounded"
                  >
                    {['pending','shipped','delivered','cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelected(o)}
                    className="px-3 py-1 bg-green-600 rounded hover:bg-green-500 text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Details Modal */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <Dialog.Panel className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
          <Dialog.Title className="text-xl font-semibold mb-4">Order Details</Dialog.Title>
          {selected && (
            <div className="space-y-4">
              <p><strong>Order ID:</strong> {selected._id}</p>
              <p>
                <strong>Customer:</strong> {selected.user_id.username} ({selected.user_id.usermail})
              </p>
              <p>
                <strong>Address:</strong>{' '}
                {`${selected.address_id.address_line1}, ${selected.address_id.city}, ${selected.address_id.state}, ${selected.address_id.country} - ${selected.address_id.pincode}`}
              </p>
              <p>
                <strong>Ordered on:</strong>{' '}
                {new Date(selected.created_at).toLocaleString()}
              </p>
              <p><strong>Total:</strong> ₹{selected.total_amount.toLocaleString()}</p>

              <div>
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {selected.product_details.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{item.product_id.title} x {item.quantity}</span>
                      <span>₹{item.price.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-500"
              >
                Close
              </button>
            </div>
          )}
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
