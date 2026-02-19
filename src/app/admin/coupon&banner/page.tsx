"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, Eye, EyeOff, Calendar, Percent, DollarSign } from 'lucide-react';
import { LayoutTemplate, Palette, Type } from 'lucide-react';
interface Coupon {
  _id: string;
  code: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
}

interface Banner {
  _id: string;
  title: string;
  description?: string;
  button_text?: string;
  bg_color?: string;
  image_position?: 'left' | 'right';
  image_url: string;
  link_url?: string;
  created_at: string;
}

// Update BannerForm Interface
interface BannerForm {
  title: string;
  description: string;
  button_text: string;
  bg_color: string;
  image_position: 'left' | 'right';
  link_url: string;
}

interface CouponForm {
  code: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number;
  usage_limit: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}



export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'coupons' | 'banners'>('coupons');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  const [couponForm, setCouponForm] = useState<CouponForm>({
    code: '',
    title: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_order_amount: 0,
    max_discount_amount: 0,
    usage_limit: 1,
    valid_from: '',
    valid_until: '',
    is_active: true
  });

 const [bannerForm, setBannerForm] = useState<BannerForm>({
    title: '',
    description: '',
    button_text: 'Shop Now',
    bg_color: '#EF4F5F',
    image_position: 'right',
    link_url: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCoupons();
    fetchBanners();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/admin/coupons');
      const data = await response.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      const data = await response.json();
      if (data.success) {
        setBanners(data.banners || []);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    }
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCoupon ? `/api/admin/coupons/${editingCoupon._id}` : '/api/admin/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponForm)
      });

      if (response.ok) {
        fetchCoupons();
        setShowCouponModal(false);
        resetCouponForm();
        setEditingCoupon(null);
      }
    } catch (error) {
      console.error('Failed to save coupon:', error);
    }
    setLoading(false);
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select an image');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    
    formData.append('title', bannerForm.title);
    formData.append('description', bannerForm.description);
    formData.append('button_text', bannerForm.button_text);
    formData.append('bg_color', bannerForm.bg_color);
    formData.append('image_position', bannerForm.image_position);
    formData.append('link_url', bannerForm.link_url);
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        fetchBanners();
        setShowBannerModal(false);
        resetBannerForm();
        setSelectedFile(null);
        alert('Banner created successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create banner');
      }
    } catch (error) {
      console.error('Failed to save banner:', error);
      alert('Failed to create banner');
    }
    setLoading(false);
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCoupons();
      }
    } catch (error) {
      console.error('Failed to delete coupon:', error);
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchBanners();
        alert('Banner deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete banner');
      }
    } catch (error) {
      console.error('Failed to delete banner:', error);
      alert('Failed to delete banner');
    }
  };

  const resetCouponForm = () => {
    setCouponForm({
      code: '',
      title: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_amount: 0,
      max_discount_amount: 0,
      usage_limit: 1,
      valid_from: '',
      valid_until: '',
      is_active: true
    });
  };

 const resetBannerForm = () => {
    setBannerForm({
      title: '',
      description: '',
      button_text: 'Shop Now',
      bg_color: '#EF4F5F',
      image_position: 'right',
      link_url: ''
    });
  };

  const editCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      title: coupon.title,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount || 0,
      max_discount_amount: coupon.max_discount_amount || 0,
      usage_limit: coupon.usage_limit || 1,
      valid_from: coupon.valid_from.split('T')[0],
      valid_until: coupon.valid_until.split('T')[0],
      is_active: coupon.is_active
    });
    setShowCouponModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('coupons')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'coupons'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Coupon Management
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'banners'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Banner Ads
            </button>
          </nav>
        </div>

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Coupon Codes</h2>
              <button
                onClick={() => setShowCouponModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Add Coupon
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{coupon.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          {coupon.discount_type === 'percentage' ? <Percent size={16} /> : <DollarSign size={16} />}
                          {coupon.discount_value}
                          {coupon.discount_type === 'percentage' ? '%' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {coupon.used_count}/{coupon.usage_limit || '∞'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(coupon.valid_until).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {coupon.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => editCoupon(coupon)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteCoupon(coupon._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Banners Tab */}
        {activeTab === 'banners' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Banner Advertisements</h2>
              <button
                onClick={() => setShowBannerModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Add Banner
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <div key={banner._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{banner.title}</h3>
                    {banner.link_url && (
                      <p className="text-sm text-blue-600 mb-2 truncate">{banner.link_url}</p>
                    )}
                    <div className="text-xs text-gray-500 mb-3">
                      <p>Created: {new Date(banner.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => deleteBanner(banner._id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {banners.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No banners found</p>
                <p className="text-gray-400">Create your first banner to get started</p>
              </div>
            )}
          </div>
        )}

        {/* Coupon Modal */}
        {showCouponModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
              </h3>
              
              <form onSubmit={handleCouponSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                    <input title="demo"
                      type="text"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input title="demo"
                      type="text"
                      value={couponForm.title}
                      onChange={(e) => setCouponForm({...couponForm, title: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea title="demo"
                      value={couponForm.description}
                      onChange={(e) => setCouponForm({...couponForm, description: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                    <select title="demo"
                      value={couponForm.discount_type}
                      onChange={(e) => setCouponForm({...couponForm, discount_type: e.target.value as 'percentage' | 'fixed'})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                    <input title="demo"
                      type="number"
                      value={couponForm.discount_value}
                      onChange={(e) => setCouponForm({...couponForm, discount_value: Number(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
                    <input title="demo"
                      type="number"
                      value={couponForm.min_order_amount}
                      onChange={(e) => setCouponForm({...couponForm, min_order_amount: Number(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  {couponForm.discount_type === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount Amount</label>
                      <input title="demo"
                        type="number"
                        value={couponForm.max_discount_amount}
                        onChange={(e) => setCouponForm({...couponForm, max_discount_amount: Number(e.target.value)})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                    <input title="demo"
                      type="number"
                      value={couponForm.usage_limit}
                      onChange={(e) => setCouponForm({...couponForm, usage_limit: Number(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                    <input title="demo"
                      type="date"
                      value={couponForm.valid_from}
                      onChange={(e) => setCouponForm({...couponForm, valid_from: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                    <input title="demo"
                      type="date"
                      value={couponForm.valid_until}
                      onChange={(e) => setCouponForm({...couponForm, valid_until: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={couponForm.is_active}
                        onChange={(e) => setCouponForm({...couponForm, is_active: e.target.checked})}
                        className="mr-2"
                      />
                      Active
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCouponModal(false);
                      resetCouponForm();
                      setEditingCoupon(null);
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingCoupon ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Banner Modal */}
        {/* Banner Modal */}
        {showBannerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Add New Hero Banner</h3>
              
              <form onSubmit={handleBannerSubmit} className="space-y-4">
                
                {/* Title & Description */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Headline Title</label>
                    <input
                      type="text"
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Big Sales Every Friday"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={bannerForm.description}
                      onChange={(e) => setBannerForm({...bannerForm, description: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Don't miss out on our fresh products..."
                      rows={2}
                    />
                  </div>
                </div>

                {/* Styling Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={bannerForm.button_text}
                      onChange={(e) => setBannerForm({...bannerForm, button_text: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Shop Now"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bannerForm.bg_color}
                        onChange={(e) => setBannerForm({...bannerForm, bg_color: e.target.value})}
                        className="h-10 w-10 p-0 border-0 rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-500">{bannerForm.bg_color}</span>
                    </div>
                  </div>
                </div>

                {/* Layout & Link */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image Position</label>
                    <select
                    title='image_position'
                      value={bannerForm.image_position}
                      onChange={(e) => setBannerForm({...bannerForm, image_position: e.target.value as 'left' | 'right'})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="right">Image on Right</option>
                      <option value="left">Image on Left</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                    <input
                      type="url"
                      value={bannerForm.link_url}
                      onChange={(e) => setBannerForm({...bannerForm, link_url: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Product Image (Transparent BG recommended)</label>
                   <input
                     type="file"
                     accept="image/*"
                     onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                     className="w-full p-2 border border-gray-300 rounded-md"
                     required
                   />
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBannerModal(false);
                      resetBannerForm();
                      setSelectedFile(null);
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Banner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}