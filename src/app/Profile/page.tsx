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
  Settings, 
  Phone, 
  Mail, 
  MapPin, 
  Edit3,
  Save,
  X,
  Camera,
  Bell,
  Shield,
  ChevronRight,
  Building2,
  LogOut,
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Home
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
  email: string;
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

const profileSections = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'business', label: 'Business Info', icon: Building2 },
  { id: 'security', label: 'Security', icon: Shield }
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

  // Show loading spinner while checking authentication or loading data
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  // Don't render if no session
  if (!session || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-slate-600 mb-4">Unable to load profile data</div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {userData.full_name?.charAt(0) || userData.username?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
                  <p className="text-sm text-slate-600 hidden sm:block">{userData.email}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => router.push('/orders')}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">My Orders</span>
                <span className="sm:hidden">Orders</span>
              </button>
              
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Profile Overview Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">
                    {userData.full_name?.charAt(0) || userData.username?.charAt(0) || 'U'}
                  </span>
                </div>
                {editMode && (
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                  {userData.full_name || userData.username}
                </h2>
                <p className="text-slate-600 mb-2">{userData.email}</p>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2">
                    {userData.isverified ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="text-sm text-slate-600">
                      {userData.isverified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                  
                  {userData.business_type && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600 capitalize">{userData.business_type}</span>
                    </div>
                  )}
                  
                  {userData.addresses?.[0]?.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {userData.addresses[0].city}, {userData.addresses[0].country}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {editMode ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">0</p>
                <p className="text-sm text-slate-600">Orders</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">0</p>
                <p className="text-sm text-slate-600">Cart Items</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">0</p>
                <p className="text-sm text-slate-600">Wishlist</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">0</p>
                <p className="text-sm text-slate-600">Reviews</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Profile Sections */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Section Navigation */}
          <div className="border-b border-slate-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              {profileSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeSection === section.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section Content */}
          <div className="p-6 sm:p-8">
            {activeSection === 'personal' && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6">Personal Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData?.username || ''}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                        {userData.username}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData?.full_name || ''}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                        {userData.full_name || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <div className="px-4 py-3 bg-slate-100 rounded-lg border border-slate-200 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {userData.email}
                      </div>
                      <span className="text-xs text-slate-500">(Cannot be changed)</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    {editMode ? (
                      <input
                        type="tel"
                        value={formData?.phone_number || ''}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {userData.phone_number || 'Not provided'}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                    {editMode ? (
                      <input
                        type="number"
                        value={formData?.age || ''}
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        min="1"
                        max="120"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                        {userData.age || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                    {editMode ? (
                      <select
                      title='gender'
                        value={formData?.gender || ''}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 capitalize">
                        {userData.gender || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'address' && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6">Address Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Address Line 1</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData?.addresses?.[0]?.address_line1 || ''}
                        onChange={(e) => handleAddressChange('address_line1', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Street address, building number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                        {userData.addresses?.[0]?.address_line1 || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Address Line 2</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData?.addresses?.[0]?.address_line2 || ''}
                        onChange={(e) => handleAddressChange('address_line2', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Apartment, suite, unit (optional)"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                        {userData.addresses?.[0]?.address_line2 || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData?.addresses?.[0]?.city || ''}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                        {userData.addresses?.[0]?.city || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData?.addresses?.[0]?.state || ''}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                        {userData.addresses?.[0]?.state || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData?.addresses?.[0]?.country || ''}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                        {userData.addresses?.[0]?.country || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">PIN Code</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData?.addresses?.[0]?.pincode || ''}
                        onChange={(e) => handleAddressChange('pincode', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                        {userData.addresses?.[0]?.pincode || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'business' && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6">Business Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData?.company_name || ''}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter company name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                        {userData.company_name || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">GST Number</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData?.gst_number || ''}
                        onChange={(e) => handleInputChange('gst_number', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter GST number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                        {userData.gst_number || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Business Type</label>
                    {editMode ? (
                      <select
                      title='business_type'
                        value={formData?.business_type || ''}
                        onChange={(e) => handleInputChange('business_type', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select Business Type</option>
                        <option value="manufacturer">Manufacturer</option>
                        <option value="distributor">Distributor</option>
                        <option value="retailer">Retailer</option>
                        <option value="wholesaler">Wholesaler</option>
                        <option value="services">Services</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 capitalize">
                        {userData.business_type || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6">Security Settings</h3>
                
                <div className="space-y-6">
                  {/* Account Verification Status */}
                  <div className="p-4 sm:p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {userData.isverified ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-amber-500" />
                        )}
                        <div>
                          <h4 className="font-medium text-slate-900">Account Verification</h4>
                          <p className="text-sm text-slate-600">
                            {userData.isverified 
                              ? 'Your account is verified and secure' 
                              : 'Your account needs verification'}
                          </p>
                        </div>
                      </div>
                      {!userData.isverified && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Verify Now
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Admin Approval Status */}
                  <div className="p-4 sm:p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {userData.admin_approval ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-amber-500" />
                        )}
                        <div>
                          <h4 className="font-medium text-slate-900">Admin Approval</h4>
                          <p className="text-sm text-slate-600">
                            {userData.admin_approval 
                              ? 'Your account has admin approval' 
                              : 'Pending admin approval'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Change Password */}
                  <div className="p-4 sm:p-6 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-1">Password</h4>
                        <p className="text-sm text-slate-600">
                          Update your password to keep your account secure
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm">
                        Change Password
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="p-4 sm:p-6 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-1">Two-Factor Authentication</h4>
                        <p className="text-sm text-slate-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm">
                        Setup 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => router.push('/orders')}
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900">My Orders</p>
                  <p className="text-sm text-slate-600">View order history</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>

            <button 
              onClick={() => router.push('/cart')}
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900">Shopping Cart</p>
                  <p className="text-sm text-slate-600">View cart items</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>

            <button 
              onClick={() => router.push('/products')}
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900">Wishlist</p>
                  <p className="text-sm text-slate-600">Saved products</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>

            <button className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Settings className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900">Settings</p>
                  <p className="text-sm text-slate-600">Account settings</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
<div className="mt-10 border border-red-200 bg-red-50 rounded-xl p-6">
  <h3 className="text-lg font-semibold text-red-700 mb-2">
    Delete Account
  </h3>
  <p className="text-sm text-red-600 mb-4">
    Once you delete your account, all your data will be permanently removed. This action cannot be undone.
  </p>

  <button
    onClick={async () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      );

      if (!confirmDelete) return;

      try {
        const res = await fetch("/api/user/delete", {
          method: "DELETE",
        });

        const data = await res.json();

        if (data.ok) {
          alert("Account deleted successfully");
          window.location.href = "/";
        } else {
          alert(data.error || "Failed to delete account");
        }
      } catch (err) {
        alert("Something went wrong");
      }
    }}
    className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
  >
    Delete My Account
  </button>
</div>
      </div>
    </div>
  );
}