// src/app/admin/orders/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import React from "react";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

type OrderItem = {
  productId?: { _id?: string; title?: string } | string;
  product?: { _id?: string; title?: string };
  quantity: number;
  price: number;
  variantId?: string;
};

type ApiOrder = {
  _id: string;
  userId?: { username?: string; email?: string } | string;
  user?: { username?: string; email?: string };
  amount?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: OrderItem[];
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
  
  // New states for date filtering and bulk download
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [bulkDownloading, setBulkDownloading] = useState<boolean>(false);

  const perPage = 10;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axios.get('/api/admin/orders')
      .then(res => {
        if (!cancelled) {
          const data = Array.isArray(res.data) ? res.data : (res.data.orders || []);
          setOrders(data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch admin orders', err);
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

  // Enhanced filtering with date range
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter(o => {
      // Status filter
      const matchStatus = filterStatus === 'all' || (o.status ?? '').toLowerCase() === filterStatus.toLowerCase();
      
      // Search filter
      const idMatches = o._id?.toLowerCase().includes(q);
      const userObj = (o.user ?? o.userId) as any;
      const emailMatches = !!userObj?.email && userObj.email.toLowerCase().includes(q);
      const searchMatch = q.length === 0 || idMatches || emailMatches;

      // Date filters
      const orderDate = o.createdAt ? new Date(o.createdAt) : null;
      
      // Month filter
      let monthMatch = true;
      if (selectedMonth && orderDate) {
        const [year, month] = selectedMonth.split('-');
        monthMatch = orderDate.getFullYear() === parseInt(year) && 
                     orderDate.getMonth() === parseInt(month) - 1;
      }

      // Date range filter
      let dateRangeMatch = true;
      if (startDate && endDate && orderDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateRangeMatch = orderDate >= start && orderDate <= end;
      }

      return matchStatus && searchMatch && monthMatch && dateRangeMatch;
    });
  }, [orders, filterStatus, search, selectedMonth, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const formatAmount = (amount?: number) => {
    if (amount == null) return '—';
    const rupees = amount > 1000 ? amount / 100 : amount;
    return `₹${Number(rupees).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const getPaymentMethod = (o: ApiOrder) => {
    if (o.razorpayPaymentId) return 'Online (Razorpay)';
    if (o.razorpayOrderId) return 'Online (Razorpay - unpaid)';
    return 'Cash on Delivery';
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      await axios.patch('/api/admin/orders', { id, status });
      setOrders(prev => prev.map(o => (o._id === id ? { ...o, status } : o)));
    } catch (err) {
      console.error('Failed to update order status', err);
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Toggle individual order selection
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Toggle all orders on current page
  const toggleAllOrders = () => {
    const currentPageIds = paginated.map(o => o._id);
    const allSelected = currentPageIds.every(id => selectedOrders.has(id));
    
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        currentPageIds.forEach(id => newSet.delete(id));
      } else {
        currentPageIds.forEach(id => newSet.add(id));
      }
      return newSet;
    });
  };

  // Generate invoice PDF blob
  const generateInvoicePDF = async (order: ApiOrder) => {
    console.log('Fetching populated order data for:', order._id);
    const response = await axios.get(`/api/orders/${order._id}/populated`, {
      withCredentials: true,
    });

    if (!response.data) {
      throw new Error('No order data received');
    }

    const populatedOrder = response.data;

    if (!populatedOrder.items || populatedOrder.items.length === 0) {
      throw new Error('Order has no items');
    }

    if (!populatedOrder.userId) {
      throw new Error('Order has no user data');
    }

    const buyer = populatedOrder.userId;
    const defaultAddress = buyer?.addresses?.find((a: any) => a.is_default) || buyer?.addresses?.[0];

    const addressParts = [];
    if (defaultAddress?.address_line1) addressParts.push(defaultAddress.address_line1);
    if (defaultAddress?.address_line2) addressParts.push(defaultAddress.address_line2);
    if (defaultAddress?.city) addressParts.push(defaultAddress.city);
    if (defaultAddress?.state) addressParts.push(defaultAddress.state);
    if (defaultAddress?.country) addressParts.push(defaultAddress.country);
    if (defaultAddress?.pincode) addressParts.push(`Pincode: ${defaultAddress.pincode}`);

    const invoiceData = {
      invoiceNo: `VA/25-26/${populatedOrder._id.toString().slice(-6).toUpperCase()}`,
      date: new Date(populatedOrder.createdAt),
      buyer: {
        name: buyer?.full_name || buyer?.username || "Customer",
        address: addressParts.length > 0 ? addressParts.join(", ") : "Address not provided",
        gstin: buyer?.gst_number || "",
        state: defaultAddress?.state || "Rajasthan",
      },
      items: populatedOrder.items
        .filter((item: any) => item && item.productId)
        .map((item: any) => ({
          description: item.productId?.title || "Product",
          hsn: item.productId?.hsn || "00000000",
          quantity: item.quantity || 1,
          rate: item.price || 0,
          gst: item.productId?.gst || 18,
        })),
    };

    if (invoiceData.items.length === 0) {
      throw new Error('No valid items for invoice');
    }

    const { pdf } = await import('@react-pdf/renderer');
    const { default: InvoicePDFDocument } = await import('@/components/InvoicePDFDocument');

    const blob = await pdf(<InvoicePDFDocument invoiceData={invoiceData} />).toBlob();
    
    return { blob, invoiceNo: invoiceData.invoiceNo };
  };
  const handleDownloadInvoice = async (order: ApiOrder) => {
    try {
      setDownloadingId(order._id);

      // 1. Fetch populated order data
      console.log('Fetching populated order data for:', order._id);
      const response = await axios.get(`/api/orders/${order._id}/populated`, {
        withCredentials: true,
      });

      if (!response.data) {
        throw new Error('No order data received');
      }

      const populatedOrder = response.data;
      console.log('Populated order:', populatedOrder);

      // 2. Validate populated order has required data
      if (!populatedOrder.items || populatedOrder.items.length === 0) {
        throw new Error('Order has no items');
      }

      if (!populatedOrder.userId) {
        throw new Error('Order has no user data');
      }

      // 3. Prepare invoice data
      const buyer = populatedOrder.userId;
      const defaultAddress = buyer?.addresses?.find((a: any) => a.is_default) || buyer?.addresses?.[0];

      const addressParts = [];
      if (defaultAddress?.address_line1) addressParts.push(defaultAddress.address_line1);
      if (defaultAddress?.address_line2) addressParts.push(defaultAddress.address_line2);
      if (defaultAddress?.city) addressParts.push(defaultAddress.city);
      if (defaultAddress?.state) addressParts.push(defaultAddress.state);
      if (defaultAddress?.country) addressParts.push(defaultAddress.country);
      if (defaultAddress?.pincode) addressParts.push(`Pincode: ${defaultAddress.pincode}`);

      const invoiceData = {
        invoiceNo: `VA/25-26/${populatedOrder._id.toString().slice(-6).toUpperCase()}`,
        date: new Date(populatedOrder.createdAt),
        buyer: {
          name: buyer?.full_name || buyer?.username || "Customer",
          address: addressParts.length > 0 ? addressParts.join(", ") : "Address not provided",
          gstin: buyer?.gst_number || "",
          state: defaultAddress?.state || "Rajasthan",
        },
        items: populatedOrder.items
          .filter((item: any) => item && item.productId)
          .map((item: any) => ({
            description: item.productId?.title || "Product",
            hsn: item.productId?.hsn || "00000000",
            quantity: item.quantity || 1,
            rate: item.price || 0,
            gst: item.productId?.gst || 18,
          })),
      };

      console.log('Invoice data prepared:', invoiceData);

      // 4. Validate invoice data
      if (invoiceData.items.length === 0) {
        throw new Error('No valid items for invoice');
      }

      // 5. Dynamically import PDF components
      const { pdf } = await import('@react-pdf/renderer');
      const { default: InvoicePDFDocument } = await import('@/components/InvoicePDFDocument');

      // 6. Generate PDF
      console.log('Generating PDF...');
      const blob = await pdf(<InvoicePDFDocument invoiceData={invoiceData} />).toBlob();
      
      // 7. Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${invoiceData.invoiceNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('✅ Invoice downloaded successfully');
    } catch (error: any) {
      console.error("❌ Error generating invoice:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      alert(`Failed to generate invoice: ${error.message || 'Unknown error'}`);
    } finally {
      setDownloadingId(null);
    }
  };
  

  // Bulk invoice download
  const handleBulkDownload = async () => {
    if (selectedOrders.size === 0) {
      alert('Please select at least one order');
      return;
    }

    try {
      setBulkDownloading(true);
      const zip = new JSZip();
      const ordersToDownload = orders.filter(o => selectedOrders.has(o._id));
      
      let successCount = 0;
      let failCount = 0;

      for (const order of ordersToDownload) {
        try {
          console.log(`Generating invoice ${successCount + 1}/${ordersToDownload.length}`);
          const { blob, invoiceNo } = await generateInvoicePDF(order);
          zip.file(`Invoice_${invoiceNo}.pdf`, blob);
          successCount++;
        } catch (error) {
          console.error(`Failed to generate invoice for order ${order._id}:`, error);
          failCount++;
        }
      }

      if (successCount > 0) {
        console.log('Creating ZIP file...');
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const timestamp = new Date().toISOString().split('T')[0];
        saveAs(zipBlob, `Invoices_${timestamp}.zip`);
        
        alert(`Successfully downloaded ${successCount} invoices${failCount > 0 ? `. ${failCount} failed.` : ''}`);
        setSelectedOrders(new Set());
      } else {
        alert('Failed to generate any invoices');
      }
    } catch (error: any) {
      console.error('Bulk download error:', error);
      alert(`Failed to create invoice package: ${error.message}`);
    } finally {
      setBulkDownloading(false);
    }
  };

  // Clear date filters
  const clearDateFilters = () => {
    setSelectedMonth('');
    setStartDate('');
    setEndDate('');
    setPage(1);
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

      {/* Enhanced Filters */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Status:</label>
            <select
              title="Filter by status"
              className="bg-gray-700 border border-gray-600 p-2 rounded"
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

          {/* Search */}
          <input
            type="text"
            placeholder="Search by ID or email..."
            className="bg-gray-700 border border-gray-600 p-2 rounded flex-1"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Date Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Month Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Filter by Month:</label>
            <input
              type="month"
              className="bg-gray-700 border border-gray-600 p-2 rounded"
              value={selectedMonth}
              onChange={e => {
                setSelectedMonth(e.target.value);
                setStartDate('');
                setEndDate('');
                setPage(1);
              }}
            />
          </div>

          {/* Start Date */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Start Date:</label>
            <input
              type="date"
              className="bg-gray-700 border border-gray-600 p-2 rounded"
              value={startDate}
              onChange={e => {
                setStartDate(e.target.value);
                setSelectedMonth('');
                setPage(1);
              }}
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">End Date:</label>
            <input
              type="date"
              className="bg-gray-700 border border-gray-600 p-2 rounded"
              value={endDate}
              onChange={e => {
                setEndDate(e.target.value);
                setSelectedMonth('');
                setPage(1);
              }}
            />
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={clearDateFilters}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium"
            >
              Clear Date Filters
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {selectedOrders.size} order{selectedOrders.size !== 1 ? 's' : ''} selected
            </span>
            {selectedOrders.size > 0 && (
              <button
                onClick={() => setSelectedOrders(new Set())}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Clear Selection
              </button>
            )}
          </div>
          <button
            onClick={handleBulkDownload}
            disabled={selectedOrders.size === 0 || bulkDownloading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-medium"
          >
            {bulkDownloading ? 'Generating ZIP...' : `Download ${selectedOrders.size} Invoice${selectedOrders.size !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>

      {/* Filtered Results Info */}
      <div className="mb-4 text-sm text-gray-400">
        Showing {filtered.length} order{filtered.length !== 1 ? 's' : ''} 
        {(selectedMonth || startDate || endDate) && ' (filtered by date)'}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-800 rounded shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={paginated.length > 0 && paginated.every(o => selectedOrders.has(o._id))}
                  onChange={toggleAllOrders}
                  className="w-4 h-4 rounded border-gray-600"
                />
              </th>
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
                <td colSpan={9} className="p-6 text-center">Loading orders...</td>
              </tr>
            )}

            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center">No orders found</td>
              </tr>
            )}

            {!loading && paginated.map(o => {
              const user = (o.user ?? o.userId) as any;
              const date = o.createdAt ?? o.updatedAt ?? '';
              return (
                <tr key={o._id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedOrders.has(o._id)}
                      onChange={() => toggleOrderSelection(o._id)}
                      className="w-4 h-4 rounded border-gray-600"
                    />
                  </td>
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
                    <button
                      onClick={() => setSelected(o)}
                      className="px-3 py-1 bg-green-600 rounded hover:bg-green-500 text-sm"
                    >
                      View
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
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