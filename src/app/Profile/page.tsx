"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Package, 
  ShoppingCart, 
  Heart, 
  FileText, 
  Users, 
  Settings, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Bell,
  Shield,
  CreditCard,
  Truck,
  BarChart3,
  ChevronRight,
  Building2,
  LogOut,
  Loader2
} from 'lucide-react';

// Interface matching your User model
interface IAddress {
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

interface IUserData {
  _id: string;
  usermail: string;
  username: string;
  phone_number?: string;
  full_name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  isverified: boolean;
  verification_method?: string;
  admin_approval: boolean;
  addresses: IAddress[];
  pincode?: string;
  company_name?: string;
  gst_number?: string;
  business_type?: string;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, active: false },
  { id: 'orders', label: 'Orders', icon: Package, active: false },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart, active: false },
  { id: 'finance', label: 'Finance Docs', icon: FileText, active: false },
  { id: 'reports', label: 'Reports', icon: FileText, active: false },
  { id: 'vendor', label: 'Vendor Management', icon: Users, active: false },
  { id: 'promotions', label: 'Promotions', icon: Bell, active: false },
  { id: 'riders', label: "Rider's Management", icon: Truck, active: false },
  { id: 'pages', label: 'Pages', icon: FileText, active: false },
  { id: 'contact', label: 'Contact', icon: Phone, active: false },
  { id: 'about', label: 'About', icon: Shield, active: false }
];

const profileSections = [
  { id: 'personal', label: 'Personal Information', active: true },
  { id: 'address', label: 'Address' },
  { id: 'business', label: 'Business Information' },
  { id: 'security', label: 'Security Settings' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'billing', label: 'Billing & Payment' }
];

export default function UserProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [formData, setFormData] = useState<IUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Function to fetch user data from API
  const fetchUserData = async () => {
    if (!session) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.ok && data.user) {
        setUserData(data.user);
        setFormData(data.user);
      } else {
        setError(data.error || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  const handleInputChange = (field: keyof IUserData, value: any) => {
    if (!formData) return;
    
    setFormData(prev => ({
      ...prev!,
      [field]: value
    }));
  };

  const handleAddressChange = (field: keyof IAddress, value: string) => {
    if (!formData || !formData.addresses?.[0]) return;
    
    setFormData(prev => ({
      ...prev!,
      addresses: prev!.addresses.map((addr, index) => 
        index === 0 ? { ...addr, [field]: value } : addr
      )
    }));
  };

  const handleSave = async () => {
    if (!formData) return;
    
    setSaving(true);
    setError('');
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.ok && data.user) {
        setUserData(data.user);
        setFormData(data.user);
        setEditMode(false);
      } else {
        setError(data.error || 'Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Failed to update user data');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setEditMode(false);
    setError('');
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  const formatDate = (dateString?: string) => {
    return new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Show loading spinner while checking authentication or loading data
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  // Don't render if no session
  if (!session || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4">Unable to load profile data</div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex text-black">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-800">metacery</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {userData.full_name?.charAt(0) || userData.username?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userData.full_name || userData.username}
              </p>
              <p className="text-xs text-gray-500 truncate">{userData.usermail}</p>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search"
                  className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                </div>
              </div>
              <span className="text-sm text-gray-600">
                {formatDate()}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                
                <div className="flex items-center gap-3">
                  {editMode ? (
                    <>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {userData.full_name?.charAt(0) || userData.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                  {editMode && (
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600">
                      <Camera className="w-3 h-3" />
                    </button>
                  )}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {userData.full_name || userData.username}
                  </h2>
                  <p className="text-gray-600 mb-1">
                    {userData.admin_approval ? 'Admin' : 'User'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {userData.addresses?.[0]?.city}, {userData.addresses?.[0]?.country}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full ${userData.isverified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span>{userData.isverified ? 'Verified Account' : 'Unverified Account'}</span>
                    </div>
                    {userData.business_type && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span className="capitalize">{userData.business_type}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Sections */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Section Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {profileSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeSection === section.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Section Content */}
              <div className="p-6">
                {activeSection === 'personal' && (
                  <div className='text-black'>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData?.username || ''}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.username}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData?.full_name || ''}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.full_name || 'Not provided'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        {editMode ? (
                          <input
                            type="number"
                            value={formData?.age || ''}
                            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.age || 'Not provided'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-600">
                          {userData.usermail}
                          <span className="text-xs ml-2">(Cannot be changed)</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        {editMode ? (
                          <input
                            type="tel"
                            value={formData?.phone_number || ''}
                            onChange={(e) => handleInputChange('phone_number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.phone_number || 'Not provided'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        {editMode ? (
                          <select
                            value={formData?.gender || ''}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg capitalize">
                            {userData.gender || 'Not provided'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'address' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Address Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData?.addresses?.[0]?.address_line1 || ''}
                            onChange={(e) => handleAddressChange('address_line1', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.addresses?.[0]?.address_line1 || 'Not provided'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData?.addresses?.[0]?.address_line2 || ''}
                            onChange={(e) => handleAddressChange('address_line2', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.addresses?.[0]?.address_line2 || 'Not provided'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData?.addresses?.[0]?.city || ''}
                            onChange={(e) => handleAddressChange('city', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.addresses?.[0]?.city || 'Not provided'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData?.addresses?.[0]?.state || ''}
                            onChange={(e) => handleAddressChange('state', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.addresses?.[0]?.state || 'Not provided'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData?.addresses?.[0]?.country || ''}
                            onChange={(e) => handleAddressChange('country', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.addresses?.[0]?.country || 'Not provided'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                        {editMode ? (
                          <select
                            value={formData.business_type || ''}
                            onChange={(e) => handleInputChange('business_type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="manufacturer">Manufacturer</option>
                            <option value="distributor">Distributor</option>
                            <option value="retailer">Retailer</option>
                            <option value="wholesaler">Wholesaler</option>
                          </select>
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg capitalize">
                            {userData.business_type || 'Distributor'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}