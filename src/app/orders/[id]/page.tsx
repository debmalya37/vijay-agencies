// app/orders/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Calendar,
  ArrowLeft,
  Download,
  Phone,
  Mail,
  Copy,
  ExternalLink
} from "lucide-react";
import InvoicePDF from "@/components/InvoicePDF";

interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  title?: string;
  image?: string;
}

interface OrderDetails {
  _id: string;
  userId: string;
  items: OrderItem[];
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "failed";
  createdAt: string;
  updatedAt: string;
}

export default function OrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchOrderDetails();
  }, [params.id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
      } else if (response.status === 404) {
        setError("Order not found");
      } else if (response.status === 401) {
        router.push('/login?redirect=/orders/' + params.id);
        return;
      } else {
        setError("Failed to load order details");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(params.id);
    // You could add a toast notification here
  };

 

// async function handleDownload(order: any) {
//   const { pdf} = await import('@react-pdf/renderer');
  
//   const blob = await pdf(<InvoicePDF order={order} />).toBlob();
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `Invoice_${order.invoiceNo}.pdf`;
//   a.click();
//   URL.revokeObjectURL(url);
// }

const handleDownloadInvoice = async () => {
  try {
    const res = await fetch(`/api/invoice/${params.id}`, {
      method: "GET",
    });

    if (!res.ok) throw new Error("Failed to download invoice");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${params.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Invoice download error:", err);
  }
};
// const handleDownloadInvoice = async () => {
//   if (!order) return;
//   const { pdf} = await import('@react-pdf/renderer');
//   const blob = await pdf(<InvoicePDF order={order} />).toBlob();

//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `invoice-${order._id}.pdf`;
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
//   window.URL.revokeObjectURL(url);
// };

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ExternalLink className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error}</h2>
          <p className="text-gray-600 mb-6">Please check the order ID and try again</p>
          <button
            onClick={() => router.push('/orders')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Order Details</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Banner */}
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h3 className="text-green-800 font-medium">Order Placed Successfully!</h3>
                <p className="text-green-700 text-sm mt-1">
                  Your order has been confirmed and is being processed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Order #{params.id.slice(-8).toUpperCase()}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Placed on {order ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : ''}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${order ? getStatusColor(order.status) : 'bg-gray-100 text-gray-800'}`}>
                {order ? getStatusText(order.status) : 'Unknown'}
              </span>
              <button
                onClick={copyOrderId}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Copy Order ID"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
  onClick={handleDownloadInvoice}
  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
>
  <Download className="w-4 h-4" />
  Download Invoice
</button>

            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Payment Method</p>
              <p className="font-medium">
                {order?.razorpayPaymentId ? 'Online Payment' : 'Cash on Delivery'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total Amount</p>
              <p className="font-medium">₹{((order?.amount ?? 0) / 100).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Order ID</p>
              <p className="font-medium text-xs">{order?.razorpayOrderId || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
          
          {order?.items && order.items.length > 0 ? (
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.image || "https://via.placeholder.com/60"}
                    alt={item.title || "Product"}
                    className="w-15 h-15 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {item.title || `Product ${item.productId.slice(-8)}`}
                    </h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{item.price.toLocaleString()} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No items found</p>
          )}
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
          
          <div className="space-y-4">
            {[
              { status: 'confirmed', icon: CheckCircle, title: 'Order Confirmed', desc: 'Your order has been confirmed' },
              { status: 'shipped', icon: Truck, title: 'Shipped', desc: 'Your order is on the way' },
              { status: 'delivered', icon: Package, title: 'Delivered', desc: 'Order delivered successfully' },
            ].map((step, index) => {
              const Icon = step.icon;
              const isCompleted = order && ['confirmed', 'shipped', 'delivered'].indexOf(order.status) >= index;
              const isCurrent = order?.status === step.status;
              
              return (
                <div key={step.status} className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isCompleted ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className={`text-sm ${
                      isCompleted ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.desc}
                    </p>
                  </div>
                  {isCurrent && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/orders')}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Orders
          </button>
          <button
            onClick={() => router.push('/products')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <div className="flex items-center gap-2 text-blue-800">
              <Phone className="w-4 h-4" />
              <span>+91 1234567890</span>
            </div>
            <div className="flex items-center gap-2 text-blue-800">
              <Mail className="w-4 h-4" />
              <span>support@company.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}