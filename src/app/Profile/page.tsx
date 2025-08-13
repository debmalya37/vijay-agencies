"use client";

import React, { useState, useEffect } from 'react';
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
  Building2
} from 'lucide-react';

// Mock user data based on your User model
const mockUserData = {
  _id: '67584a1b2c3d4e5f6789abcd',
  usermail: 'natasha@fusion.com',
  username: 'natasha_khaleira',
  full_name: 'Natasha Khaleira',
  phone_number: '(+62) 821 2554-5646',
  age: 28,
  gender: 'female',
  isverified: true,
  verification_method: 'email',
  admin_approval: true,
  addresses: [
    {
      _id: 'addr1',
      address_line1: '123 Business District',
      address_line2: 'Suite 456',
      city: 'Leeds, East London',
      state: 'England',
      country: 'United Kingdom',
      pincode: 'BT1 1DLA',
      is_default: true,
      label: 'Business Address'
    }
  ],
  pincode: 'BT1 1DLA',
  company_name: 'Fusion Technologies Ltd',
  gst_number: 'GB123456789',
  business_type: 'distributor'
};

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
  const [activeSection, setActiveSection] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(mockUserData);
  const [formData, setFormData] = useState(mockUserData);
  const [loading, setLoading] = useState(false);

  // Function to fetch user data from API (placeholder)
  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/user', {
      //   headers: {
      //     'Authorization': `Bearer ${sessionToken}`
      //   }
      // });
      // const data = await response.json();
      // setUserData(data);
      // setFormData(data);
      
      // For now, using mock data
      setUserData(mockUserData);
      setFormData(mockUserData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.map((addr, index) => 
        index === 0 ? { ...addr, [field]: value } : addr
      )
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/user', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${sessionToken}`
      //   },
      //   body: JSON.stringify(formData)
      // });
      // const updatedData = await response.json();
      
      // For now, just update local state
      setUserData(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setEditMode(false);
  };

  const formatDate = (dateString) => {
    return new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-orange-500 text-white p-3 rounded-lg text-center">
            <User className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xs font-medium">Need help with orders?</div>
          </div>
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
              <span className="text-sm text-gray-600">Tuesday, 18 July</span>
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
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save'}
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

              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {userData.full_name?.charAt(0) || 'N'}
                    </span>
                  </div>
                  {editMode && (
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600">
                      <Camera className="w-3 h-3" />
                    </button>
                  )}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{userData.full_name}</h2>
                  <p className="text-gray-600 mb-1">Admin</p>
                  <p className="text-gray-500 text-sm">{userData.addresses?.[0]?.city}, {userData.addresses?.[0]?.country}</p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Verified Account</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span>{userData.business_type || 'Business User'}</span>
                    </div>
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
                      <div className='text-black'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData.full_name?.split(' ')[0] || ''}
                            onChange={(e) => {
                              const lastName = formData.full_name?.split(' ').slice(1).join(' ') || '';
                              handleInputChange('full_name', `${e.target.value} ${lastName}`.trim());
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.full_name?.split(' ')[0] || 'Natasha'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData.full_name?.split(' ').slice(1).join(' ') || ''}
                            onChange={(e) => {
                              const firstName = formData.full_name?.split(' ')[0] || '';
                              handleInputChange('full_name', `${firstName} ${e.target.value}`.trim());
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.full_name?.split(' ').slice(1).join(' ') || 'Khaleira'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        {editMode ? (
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            19-10-1995
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        {editMode ? (
                          <input
                            type="email"
                            value={formData.usermail}
                            onChange={(e) => handleInputChange('usermail', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.usermail}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        {editMode ? (
                          <input
                            type="tel"
                            value={formData.phone_number}
                            onChange={(e) => handleInputChange('phone_number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.phone_number}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        {editMode ? (
                          <select
                            value={formData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg capitalize">
                            {userData.gender}
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData.addresses?.[0]?.country || ''}
                            onChange={(e) => handleAddressChange('country', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.addresses?.[0]?.country || 'United Kingdom'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData.addresses?.[0]?.city || ''}
                            onChange={(e) => handleAddressChange('city', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.addresses?.[0]?.city || 'Leeds, East London'}
                          </div>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData.addresses?.[0]?.pincode || ''}
                            onChange={(e) => handleAddressChange('pincode', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.addresses?.[0]?.pincode || 'BT1 1DLA'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'business' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Business Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData.company_name || ''}
                            onChange={(e) => handleInputChange('company_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.company_name || 'Fusion Technologies Ltd'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData.gst_number || ''}
                            onChange={(e) => handleInputChange('gst_number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            {userData.gst_number || 'GB123456789'}
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