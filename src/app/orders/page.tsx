// app/orders/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  AlertCircle,
  ArrowLeft,
  Eye
} from "lucide-react";

interface OrderItem {
    productId: string | { _id: string; title?: string };
  variantId: string;
  quantity: number;
  price: number;
  title?: string;
  image?: string;
}

interface Order {
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

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/user', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else if (response.status === 401) {
        router.push('/login?redirect=/orders');
        return;
      } else {
        setError("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <Package className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error}</h2>
          <button
            onClick={fetchOrders}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
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
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">My Orders</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">When you place orders, they will appear here.</p>
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </span>
                    <button
                      onClick={() => router.push(`/orders/${order._id}`)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-600">Items</p>
                    <p className="font-medium">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-medium">₹{(order.amount / 100).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment</p>
                    <p className="font-medium">
                      {order.razorpayPaymentId ? 'Paid Online' : 'Cash on Delivery'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order ID</p>
                    <p className="font-medium text-xs">{order.razorpayOrderId}</p>
                  </div>
                </div>

                {/* Order Items Preview */}
                {order.items.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-3 overflow-x-auto">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 min-w-0">
                          <img
                            src={item.image || "https://via.placeholder.com/40"}
                            alt={item.title || "Product"}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="min-w-0">
                          <p className="text-xs text-gray-800 truncate">
  {item.title || `Product ${typeof item.productId === 'string' ? item.productId.slice(-8) : item.productId?._id?.slice(-8) || '???'}`}
</p>

                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2 min-w-max">
                          <span className="text-xs text-gray-600">
                            +{order.items.length - 3} more
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => router.push(`/orders/${order._id}`)}
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}