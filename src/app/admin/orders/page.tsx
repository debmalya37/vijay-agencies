// src/app/admin/orders/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { pdf } from "@react-pdf/renderer";
import { Button } from '@/components/ui/button';
import React from "react";
import dynamic from "next/dynamic";


// ✅ Dynamically import @react-pdf/renderer only on client side


// ✅ Dynamically import your InvoicePDFDocument
const InvoicePDFDocument = dynamic(() => import("@/components/InvoicePDFDocument"), {
  ssr: false,
});
type OrderItem = {
  // server may return either productId populated or just an id
  productId?: { _id?: string; title?: string } | string;
  product?: { _id?: string; title?: string };
  quantity: number;
  price: number;
  // variant id optionally
  variantId?: string;
};

type ApiOrder = {
  _id: string;
  userId?: { username?: string; email?: string } | string;
  user?: { username?: string; email?: string };
  amount?: number; // often stored in paise on your server; we'll detect/display accordingly
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: OrderItem[];
  // optional address fields if your server stored them
  address?: {
    address_line1?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  } | null;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selected, setSelected] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const perPage = 10;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axios.get('/api/admin/orders')
      .then(res => {
        if (!cancelled) {
          // Expecting array of orders
          const data = Array.isArray(res.data) ? res.data : (res.data.orders || []);
          setOrders(data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch admin orders', err);
        // Keep empty list on error
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const confirmed = orders.filter(o => o.status === 'confirmed').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    return { total, pending, confirmed, shipped, delivered, cancelled };
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter(o => {
      const matchStatus = filterStatus === 'all' || (o.status ?? '').toLowerCase() === filterStatus.toLowerCase();
      const idMatches = o._id?.toLowerCase().includes(q);
      const userObj = (o.user ?? o.userId) as any;
      const emailMatches = !!userObj?.email && userObj.email.toLowerCase().includes(q);
      return matchStatus && (q.length === 0 || idMatches || emailMatches);
    });
  }, [orders, filterStatus, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  // Utility: display amount in rupees. If server stores paise (common), convert to rupees.
  const formatAmount = (amount?: number) => {
    if (amount == null) return '—';
    // Heuristic: treat as paise if amount >= 1000
    // (this is conservative; adjust if you always return paise)
    const rupees = amount > 1000 ? amount / 100 : amount;
    return `₹${Number(rupees).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const getPaymentMethod = (o: ApiOrder) => {
    if (o.razorpayPaymentId) return 'Online (Razorpay)';
    if (o.razorpayOrderId) return 'Online (Razorpay - unpaid)';
    // fallback: if amount present and no razorpay fields, assume COD
    return 'Cash on Delivery';
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      // Try PATCH to a RESTful endpoint; adjust if your backend expects different path/body
      await axios.patch('/api/admin/orders', { id, status });

      // optimistic UI update
      setOrders(prev => prev.map(o => (o._id === id ? { ...o, status } : o)));
    } catch (err) {
      console.error('Failed to update order status', err);
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };
 // 🔹 Function to handle invoice download for each order
 const handleDownloadInvoice = async (order:any) => {
  try {
    setDownloadingId(order._id);
    const { pdf, Font } = await import('@react-pdf/renderer');

    const buyer = order.userId;
    const defaultAddress =
      buyer?.addresses?.find((a:any) => a.is_default) || buyer?.addresses?.[0];

    const addressParts = [];
    if (defaultAddress?.address_line1) addressParts.push(defaultAddress.address_line1);
    if (defaultAddress?.address_line2) addressParts.push(defaultAddress.address_line2);
    if (defaultAddress?.city) addressParts.push(defaultAddress.city);
    if (defaultAddress?.state) addressParts.push(defaultAddress.state);
    if (defaultAddress?.country) addressParts.push(defaultAddress.country);
    if (defaultAddress?.pincode) addressParts.push(`Pincode: ${defaultAddress.pincode}`);

    const invoiceData = {
      invoiceNo: `VA/25-26/${order._id.toString().slice(-6).toUpperCase()}`,
      date: new Date(order.createdAt),
      buyer: {
        name: buyer?.full_name || buyer?.username || "Customer",
        address: addressParts.length > 0 ? addressParts.join(", ") : "Address not provided",
        gstin: buyer?.gst_number || "",
        state: defaultAddress?.state || "Rajasthan",
      },
      items: order.items.map((item:any) => ({
        description: item.productId?.title || "Product",
        hsn: item.productId?.hsn || "00000000",
        quantity: item.quantity,
        rate: item.price,
        gst: item.productId?.gst || 18,
      })),
    };

    // ✅ Dynamically get the pdf() function
    // const pdf = (await PDFRenderer) as any;

    const blob = await pdf(<InvoicePDFDocument invoiceData={invoiceData} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_${invoiceData.invoiceNo}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ Error generating invoice:", error);
    alert("Failed to generate invoice. Please try again.");
  } finally {
    setDownloadingId(null);
  }
};
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm uppercase">Total</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm uppercase">Pending</p>
          <p className="text-2xl font-semibold">{stats.pending}</p>
        </div>
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm uppercase">Confirmed</p>
          <p className="text-2xl font-semibold">{stats.confirmed}</p>
        </div>
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm uppercase">Shipped</p>
          <p className="text-2xl font-semibold">{stats.shipped}</p>
        </div>
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm uppercase">Delivered</p>
          <p className="text-2xl font-semibold">{stats.delivered}</p>
        </div>
        <div className="col-span-1 bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm uppercase">Cancelled</p>
          <p className="text-2xl font-semibold">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <label className="text-sm">Status:</label>
          <select
            title="Filter by status"
            className="bg-gray-800 border border-gray-700 p-2 rounded"
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="failed">Failed</option>
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
              <th className="px-4 py-3 text-left text-sm font-medium">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Payment</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Invoice</th>

            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="p-6 text-center">Loading orders...</td>
              </tr>
            )}

            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center">No orders found</td>
              </tr>
            )}

            {!loading && paginated.map(o => {
              const user = (o.user ?? o.userId) as any;
              const date = o.createdAt ?? o.updatedAt ?? '';
              return (
                <tr key={o._id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-2 truncate max-w-xs">{o._id}</td>
                  <td className="px-4 py-2">
                    <div className="font-medium">{user?.username ?? '—'}</div>
                    <div className="text-xs text-gray-400">{user?.email ?? '—'}</div>
                  </td>
                  <td className="px-4 py-2">{formatAmount(o.amount)}</td>
                  <td className="px-4 py-2">{date ? new Date(date).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-2">{getPaymentMethod(o)}</td>
                  <td className="px-4 py-2">
                    <select
                      title="Update order status"
                      value={o.status ?? 'pending'}
                      onChange={e => updateStatus(o._id, e.target.value)}
                      className="bg-gray-800 border border-gray-600 p-1 rounded"
                      disabled={updatingId === o._id}
                    >
                      {['pending','confirmed','shipped','delivered','cancelled','failed'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(o)}
                        className="px-3 py-1 bg-green-600 rounded hover:bg-green-500 text-sm"
                      >
                        View
                      </button>
                    </div>
                  </td>
                  <td className="border px-3 py-2 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={downloadingId === o._id}
                  onClick={() => handleDownloadInvoice(o)}
                  className='text-black'
                >
                  {downloadingId === o._id ? "Generating..." : "Download"}
                </Button>
              </td>
                </tr>
              );
            })}
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
        className="fixed inset-0 flex items-center justify-center bg-black text-white bg-opacity-50 z-50"
      >
        <Dialog.Panel className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
          <Dialog.Title className="text-xl font-semibold mb-4">Order Details</Dialog.Title>
          {selected && (
            <div className="space-y-4">
              <p><strong>Order ID:</strong> {selected._id}</p>
              <p>
                <strong>Customer:</strong> {(selected.user ?? selected.userId) ? `${(selected.user ?? selected.userId as any).username ?? '—'} (${(selected.user ?? selected.userId as any).email ?? '—'})` : '—'}
              </p>
              {selected.address && (
                <p>
                  <strong>Address:</strong>{' '}
                  {`${selected.address.address_line1 ?? ''}, ${selected.address.city ?? ''}, ${selected.address.state ?? ''}, ${selected.address.country ?? ''} - ${selected.address.pincode ?? ''}`}
                </p>
              )}
              <p>
                <strong>Ordered on:</strong>{' '}
                {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '—'}
              </p>
              <p><strong>Total:</strong> {formatAmount(selected.amount)}</p>

              <div>
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {(selected.items ?? []).map((item, idx) => {
                    const product = typeof item.productId === 'object' ? item.productId : (item.product ?? undefined);
                    const title = product?.title ?? (typeof item.productId === 'string' ? item.productId : 'Unknown product');
                    return (
                      <li key={idx} className="flex justify-between">
                        <span>{title} x {item.quantity}</span>
                        <span>{`₹${Number(item.price).toLocaleString()}`}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
