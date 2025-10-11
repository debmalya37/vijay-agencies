// app/checkout/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  CreditCard,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
  Building2,
  FileText,
  Lock,
  Check,
  AlertCircle,
  Loader2,
  Shield,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import Script from "next/script";

// Types
interface Address {
  _id?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  is_default: boolean;
  label?: string;
}

interface UserDetails {
  full_name: string;
  email: string;
  phone_number: string;
  company_name?: string;
  gst_number?: string;
  business_type?: string;
}

interface OrderSummary {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, getSubtotal, getItemCount, clearCart } = useCart();

  // Form states
  const [currentStep, setCurrentStep] = useState(1); // 1: Details, 2: Address, 3: Payment
  const [userDetails, setUserDetails] = useState<UserDetails>({
    full_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    gst_number: "",
    business_type: "",
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string>("");

  const [newAddress, setNewAddress] = useState<Address>({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    is_default: false,
    label: "Home",
  });

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate order summary
  const subtotal = Number(getSubtotal() || 0);
  const discountAmount = subtotal * discount;
  const deliveryFee = subtotal > 50000 ? 0 : 150;
  const total = subtotal + deliveryFee;

  const orderSummary: OrderSummary = {
    subtotal,
    discount: discountAmount,
    deliveryFee,
    total,
  };

  // Load user data and addresses on mount
  useEffect(() => {
    loadUserData();
    loadAddresses();
  }, []);

  const loadUserData = async () => {
    try {
      // Replace with actual API call to get current user
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const userData = await response.json();
        setUserDetails({
          full_name: userData.full_name || "",
          email: userData.email || "",
          phone_number: userData.phone_number || "",
          company_name: userData.company_name || "",
          gst_number: userData.gst_number || "",
          business_type: userData.business_type || "",
        });
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const loadAddresses = async () => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/user/addresses');
      if (response.ok) {
        const addressData = await response.json();
        setAddresses(addressData.addresses || []);
        
        // Select default address if available
        const defaultAddress = addressData.addresses?.find((addr: Address) => addr.is_default);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id || "");
        }
      }
    } catch (error) {
      console.error("Failed to load addresses:", error);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!userDetails.full_name.trim()) newErrors.full_name = "Full name is required";
      if (!userDetails.email.trim()) newErrors.email = "Email is required";
      if (!userDetails.phone_number.trim()) newErrors.phone_number = "Phone number is required";
      if (!/^\d{10}$/.test(userDetails.phone_number)) newErrors.phone_number = "Enter valid 10-digit phone number";
    }

    if (step === 2) {
      if (!selectedAddressId && addresses.length === 0) {
        newErrors.address = "Please add a delivery address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleAddAddress = async () => {
    const addressErrors: Record<string, string> = {};
    
    if (!newAddress.address_line1.trim()) addressErrors.address_line1 = "Address line 1 is required";
    if (!newAddress.city.trim()) addressErrors.city = "City is required";
    if (!newAddress.state.trim()) addressErrors.state = "State is required";
    if (!newAddress.pincode.trim()) addressErrors.pincode = "Pincode is required";
    if (!/^\d{6}$/.test(newAddress.pincode)) addressErrors.pincode = "Enter valid 6-digit pincode";

    if (Object.keys(addressErrors).length > 0) {
      setErrors(addressErrors);
      return;
    }

    try {
      setLoading(true);
      
      if (editingAddressId) {
        // Update existing address
        const response = await fetch(`/api/user/addresses/${editingAddressId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAddress),
        });

        if (response.ok) {
          const updatedAddress = await response.json();
          setAddresses(addresses.map(addr => 
            addr._id === editingAddressId ? updatedAddress : addr
          ));
          if (selectedAddressId === editingAddressId) {
            setSelectedAddressId(updatedAddress._id);
          }
        }
      } else {
        // Add new address
        const response = await fetch('/api/user/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAddress),
        });

        if (response.ok) {
          const savedAddress = await response.json();
          setAddresses([...addresses, savedAddress]);
          setSelectedAddressId(savedAddress._id);
        }
      }

      // Reset form
      setShowAddressForm(false);
      setEditingAddressId("");
      setNewAddress({
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        is_default: false,
        label: "Home",
      });
      setErrors({});
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setNewAddress(address);
    setEditingAddressId(address._id || "");
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAddresses(addresses.filter(addr => addr._id !== addressId));
        if (selectedAddressId === addressId) {
          setSelectedAddressId("");
        }
      }
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save20") {
      setDiscount(0.99);
    } else if (promoCode.toLowerCase() === "welcome10") {
      setDiscount(0.99);
    } else {
      setDiscount(0);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(3)) return;
  
    setLoading(true);
    try {
      const orderData = {
        userDetails,
        addressId: selectedAddressId,
        items: cartItems.map((item) => ({
          productId: item.productId,
          variantId: (item as any).variantId ?? null,
          quantity: item.quantity,
          price: (total),
        })),
        paymentMethod,
        orderSummary,
        promoCode: promoCode || undefined,
      };
  
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        alert(result.error || result.message || "Failed to place order");
        return;
      }
  
      // accept either name returned by backend
      const razorpayOrderId = result.razorpayOrderId ?? result.orderId ?? result.dbOrderId;
      const razorpayAmount = result.amount ?? result.orderAmount ?? Math.round(total * 100);
  
      if (paymentMethod === "online" && razorpayOrderId) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayAmount, // paise
          currency: "INR",
          name: "Vijay Agencies",
          description: "Order Payment",
          order_id: razorpayOrderId,
          handler: async (razResponse: any) => {
            const verifyResponse = await fetch("/api/orders/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: razResponse.razorpay_order_id,
                razorpay_payment_id: razResponse.razorpay_payment_id,
                razorpay_signature: razResponse.razorpay_signature,
                orderId: result.orderId ?? result.dbOrderId ?? razorpayOrderId,
              }),
            });
  
            if (verifyResponse.ok) {
              clearCart();
              router.push(`/orders/${result.orderId ?? result.dbOrderId ?? razorpayOrderId}?success=true`);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: userDetails.full_name,
            email: userDetails.email,
            contact: userDetails.phone_number,
          },
          theme: { color: "#3B82F6" },
        };
  
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } else {
        // COD or no razorpay order id returned
        clearCart();
        router.push(`/orders/${result.orderId ?? result.dbOrderId ?? ""}?success=true`);
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
          <button
            onClick={() => router.push('/Products')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
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
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Checkout</h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <span>{getItemCount()} items</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            
            {/* Progress Steps */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between overflow-x-auto">
                {[
                  { step: 1, title: "Details", icon: User },
                  { step: 2, title: "Address", icon: MapPin },
                  { step: 3, title: "Payment", icon: CreditCard },
                ].map(({ step, title, icon: Icon }, index) => (
                  <div key={step} className="flex items-center min-w-0">
                    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex-shrink-0 ${
                      step <= currentStep ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-400'
                    }`}>
                      {step < currentStep ? <Check className="w-3 h-3 sm:w-5 sm:h-5" /> : <Icon className="w-3 h-3 sm:w-5 sm:h-5" />}
                    </div>
                    <span className={`ml-2 text-xs sm:text-sm font-medium truncate ${
                      step <= currentStep ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {title}
                    </span>
                    {index < 2 && <div className={`ml-2 sm:ml-4 w-8 sm:w-16 h-0.5 flex-shrink-0 ${
                      step < currentStep ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: User Details */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">User Details</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={userDetails.full_name}
                      onChange={(e) => setUserDetails({...userDetails, full_name: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.full_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={userDetails.email}
                      onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={userDetails.phone_number}
                      onChange={(e) => setUserDetails({...userDetails, phone_number: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone_number ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter 10-digit phone number"
                    />
                    {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={userDetails.company_name}
                      onChange={(e) => setUserDetails({...userDetails, company_name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={userDetails.gst_number}
                      onChange={(e) => setUserDetails({...userDetails, gst_number: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter GST number"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type (Optional)
                    </label>
                    <select
                      title="Select Business Type"
                      value={userDetails.business_type}
                      onChange={(e) => setUserDetails({...userDetails, business_type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select business type</option>
                      <option value="Retail">Retail</option>
                      <option value="Wholesale">Wholesale</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Services">Services</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleNextStep}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue to Address
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Shipping Address</h2>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Address
                  </button>
                </div>

                {errors.address && <p className="text-red-500 text-sm mb-4">{errors.address}</p>}

                {/* Address List */}
                <div className="space-y-4 mb-6">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddressId === address._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddressId(address._id || "")}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-medium text-gray-900">{address.label}</span>
                            {address.is_default && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-700 space-y-1">
                            <p>{address.address_line1}{address.address_line2 && `, ${address.address_line2}`}</p>
                            <p>{address.city}, {address.state} - {address.pincode}</p>
                            <p>{address.country}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(address);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(address._id || "");
                            }}
                            className="p-2 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add/Edit Address Form */}
                {showAddressForm && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingAddressId ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          value={newAddress.address_line1}
                          onChange={(e) => setNewAddress({...newAddress, address_line1: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.address_line1 ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="House number, street name"
                        />
                        {errors.address_line1 && <p className="text-red-500 text-sm mt-1">{errors.address_line1}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 2 (Optional)
                        </label>
                        <input
                          type="text"
                          value={newAddress.address_line2}
                          onChange={(e) => setNewAddress({...newAddress, address_line2: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Apartment, suite, unit, building, floor, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter city"
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.state ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter state"
                        />
                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.pincode ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter 6-digit pincode"
                        />
                        {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Label
                        </label>
                        <select
                          title="Select Address Label"
                          value={newAddress.label}
                          onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        id="is_default"
                        checked={newAddress.is_default}
                        onChange={(e) => setNewAddress({...newAddress, is_default: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
                        Set as default address
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                      <button
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddressId("");
                          setNewAddress({
                            address_line1: "",
                            address_line2: "",
                            city: "",
                            state: "",
                            country: "India",
                            pincode: "",
                            is_default: false,
                            label: "Home",
                          });
                          setErrors({});
                        }}
                        className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddAddress}
                        disabled={loading}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editingAddressId ? 'Update Address' : 'Add Address'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="w-full sm:w-auto px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Back to Details
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!selectedAddressId}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Payment Method</h2>
                
                <div className="space-y-4 mb-6">
                  {/* Cash on Delivery */}
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <Truck className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Cash on Delivery</h3>
                          <p className="text-sm text-gray-600">Pay when your order is delivered</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        paymentMethod === 'cod'
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'cod' && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Razorpay Payment */}
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'online'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('online')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Pay Now</h3>
                          <p className="text-sm text-gray-600">Credit/Debit Card, UPI, Net Banking</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        paymentMethod === 'online'
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'online' && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg mb-6">
                  <Lock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Secure Payment</span>
                    <span className="ml-1">- Your payment information is encrypted and secure</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full sm:w-auto px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Back to Address
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                        <span className="font-bold">₹{total.toLocaleString()}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-24">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h3>

              {/* Cart Items */}
              <div className="space-y-3 sm:space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image || "https://via.placeholder.com/60"}
                      alt={item.title}
                      className="w-12 h-12 sm:w-15 sm:h-15 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{item.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-sm font-medium text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex-shrink-0"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Try: SAVE20 or WELCOME10</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({Math.round(discount * 100)}%)</span>
                    <span>-₹{Math.round(discountAmount).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-gray-900">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                {deliveryFee > 0 && subtotal < 50000 && (
                  <div className="text-xs text-gray-500">
                    Add ₹{(50000 - subtotal).toLocaleString()} more for free delivery
                  </div>
                )}

                <hr className="border-gray-200" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Order Info */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 flex-shrink-0" />
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span>100% secure payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span>GST invoice included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </div>
  );
}