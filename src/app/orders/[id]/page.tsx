// app/orders/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Package,
  Truck,
  ArrowLeft,
  Download,
  Phone,
  Mail,
  Copy,
  ExternalLink
} from "lucide-react";

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

interface PopulatedOrderItem {
  productId: {
    _id: string;
    title: string;
    image?: string;
    images?: string[];
    hsn?: string;
    gst?: number;
  };
  variantId: string;
  quantity: number;
  price: number;
}

interface PopulatedOrder extends Omit<OrderDetails, 'items' | 'userId'> {
  items: PopulatedOrderItem[];
  userId: {
    _id: string;
    full_name?: string;
    username?: string;
    gst_number?: string;
    addresses?: Array<{
      address_line1?: string;
      address_line2?: string;
      city?: string;
      state?: string;
      country?: string;
      pincode?: string;
      is_default?: boolean;
    }>;
  };
}

export default function OrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [populatedOrder, setPopulatedOrder] = useState<PopulatedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchOrderDetails = async () => {
    try {
      // Fetch basic order details
      const response = await fetch(`/api/orders/${params.id}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
        
        // Fetch populated order for PDF generation
        const populatedResponse = await fetch(`/api/orders/${params.id}/populated`, {
          credentials: 'include',
        });
        
        if (populatedResponse.ok) {
          const populatedData = await populatedResponse.json();
          setPopulatedOrder(populatedData);
        }
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

  const handleDownloadInvoice = async () => {
    if (!populatedOrder) {
      alert('Order data not available. Please refresh the page.');
      return;
    }

    setDownloadingInvoice(true);
    
    try {
      // Dynamically import PDF components
      const { pdf } = await import('@react-pdf/renderer');
      const { default: InvoicePDFDocument } = await import('@/components/InvoicePDFDocument');

      // Prepare invoice data
      const buyer = populatedOrder.userId;
      const defaultAddress = buyer?.addresses?.find((a) => a.is_default) || buyer?.addresses?.[0];

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
          address: addressParts.length > 0 ? addressParts.join(', ') : "Address not provided",
          gstin: buyer?.gst_number || "",
          state: defaultAddress?.state || "Rajasthan",
        },
        items: populatedOrder.items.map((item) => ({
          description: item.productId?.title || "Product",
          hsn: item.productId?.hsn || "00000000",
          quantity: item.quantity,
          rate: item.price,
          gst: item.productId?.gst || 18,
        })),
      };

      // Generate PDF blob
      const blob = await pdf(<InvoicePDFDocument invoiceData={invoiceData} />).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${invoiceData.invoiceNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setDownloadingInvoice(false);
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
  };

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
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-4">
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

          {/* Download Invoice Button */}
          <div className="pt-4 border-t border-gray-200">
  <div className="relative group">
    <button
      onClick={handleDownloadInvoice}
      disabled={
        downloadingInvoice ||
        !populatedOrder ||
        !order ||
        ["pending", "failed", "cancelled"].includes(order.status)
      }
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg transition-colors w-full sm:w-auto 
        ${
          ["confirmed", "shipped", "delivered"].includes(order?.status || "")
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
    >
      <Download className="w-4 h-4" />
      {downloadingInvoice
        ? "Generating PDF..."
        : ["pending", "failed", "cancelled"].includes(order?.status || "")
        ? "Invoice Unavailable"
        : "Download Invoice"}
    </button>

    {["pending", "failed", "cancelled"].includes(order?.status || "") && (
      <span className="absolute left-0 top-full mt-2 w-max bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Invoice available once the order is confirmed.
      </span>
    )}
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
                    src={item.image || "https://www.vijayagenciesjpr.com/X.JPEG.jpg"}
                    alt={item.title || "Product"}
                    className="w-6 h-6 object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://www.vijayagenciesjpr.com/X.JPEG.jpg";
                    }}
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
              <span>+919414073671</span>
            </div>
            <div className="flex items-center gap-2 text-blue-800">
              <Mail className="w-4 h-4" />
              <span>support@vijayagenciesjpr.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}