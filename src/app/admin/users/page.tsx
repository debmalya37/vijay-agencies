// src/app/admin/users/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Mail,
  Phone,
  MapPin,
  Building2,
  Package,
  Calendar,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck
} from 'lucide-react'

interface IAddress {
  _id: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  is_default: boolean;
  label?: string;
}

interface IUser {
  _id: string;
  email: string;
  username: string;
  role: "user" | "admin";
  phone_number?: string;
  full_name?: string;
  isverified: boolean;
  verification_method?: string;
  addresses: IAddress[];
  company_name?: string;
  gst_number?: string;
  business_type?: string;
  purchase_history: string[];
  createdAt: string;
  updatedAt: string;
}

interface IOrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
}

interface IOrder {
  _id: string;
  userId: string;
  items: IOrderItem[];
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "failed";
  createdAt: string;
  updatedAt: string;
}

// Demo data
const demoUsers: IUser[] = [
  {
    _id: 'USR001',
    email: 'alice.johnson@techcorp.com',
    username: 'alice_johnson',
    role: 'user',
    phone_number: '+91 9876543210',
    full_name: 'Alice Johnson',
    isverified: true,
    verification_method: 'email',
    addresses: [
      {
        _id: 'ADD001',
        address_line1: '123 Business Park',
        address_line2: 'Tower A, Floor 5',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        pincode: '400001',
        is_default: true,
        label: 'Office'
      }
    ],
    company_name: 'TechCorp Solutions',
    gst_number: '27AAACT1234K1Z2',
    business_type: 'manufacturer',
    purchase_history: ['ORD001', 'ORD002'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-10T14:20:00Z'
  },
  {
    _id: 'USR002',
    email: 'bob.smith@distributors.in',
    username: 'bob_smith',
    role: 'user',
    phone_number: '+91 9876543211',
    full_name: 'Bob Smith',
    isverified: false,
    addresses: [
      {
        _id: 'ADD002',
        address_line1: '456 Industrial Area',
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        pincode: '110001',
        is_default: true,
        label: 'Warehouse'
      }
    ],
    company_name: 'Smith Distributors',
    gst_number: '07BBSCD5678L3Z4',
    business_type: 'distributor',
    purchase_history: ['ORD003'],
    createdAt: '2024-02-20T09:15:00Z',
    updatedAt: '2024-03-08T11:45:00Z'
  },
  {
    _id: 'USR003',
    email: 'carol.davis@retail.com',
    username: 'carol_davis',
    role: 'user',
    phone_number: '+91 9876543212',
    full_name: 'Carol Davis',
    isverified: true,
    verification_method: 'phone',
    addresses: [
      {
        _id: 'ADD003',
        address_line1: '789 Market Street',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        pincode: '560001',
        is_default: true,
        label: 'Store'
      }
    ],
    company_name: 'Davis Retail Chain',
    business_type: 'retailer',
    purchase_history: [],
    createdAt: '2024-03-01T16:45:00Z',
    updatedAt: '2024-03-09T08:30:00Z'
  }
];

const demoOrders: IOrder[] = [
  {
    _id: 'ORD001',
    userId: 'USR001',
    items: [
      { productId: 'PROD001', variantId: 'VAR001', quantity: 50, price: 2500 },
      { productId: 'PROD002', variantId: 'VAR002', quantity: 25, price: 1800 }
    ],
    razorpayOrderId: 'order_abc123',
    razorpayPaymentId: 'pay_xyz789',
    amount: 170000,
    status: 'delivered',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-25T14:20:00Z'
  },
  {
    _id: 'ORD002',
    userId: 'USR001',
    items: [
      { productId: 'PROD003', variantId: 'VAR003', quantity: 100, price: 850 }
    ],
    razorpayOrderId: 'order_def456',
    amount: 85000,
    status: 'shipped',
    createdAt: '2024-03-05T15:20:00Z',
    updatedAt: '2024-03-08T12:10:00Z'
  },
  {
    _id: 'ORD003',
    userId: 'USR002',
    items: [
      { productId: 'PROD001', variantId: 'VAR001', quantity: 30, price: 2500 }
    ],
    razorpayOrderId: 'order_ghi789',
    amount: 75000,
    status: 'pending',
    createdAt: '2024-03-10T09:45:00Z',
    updatedAt: '2024-03-10T09:45:00Z'
  }
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>(demoUsers);
  const [orders, setOrders] = useState<IOrder[]>(demoOrders);
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'verified' | 'unverified' | 'business'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'orders'>('name');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const perPage = 10;

  // Fetch users and orders
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, ordersRes] = await Promise.all([
          axios.get('/api/admin/users'),
          axios.get('/api/admin/orders')
        ]);
        
        if (usersRes.data.length) setUsers(usersRes.data);
        if (ordersRes.data.length) setOrders(ordersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const total = users.length;
    const verified = users.filter(u => u.isverified).length;
    const businesses = users.filter(u => u.company_name).length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    
    return { total, verified, businesses, totalOrders, totalRevenue };
  }, [users, orders]);

  // Filter and sort users
  const filtered = useMemo(() => {
    let result = users.filter(u => {
      const matchesSearch = 
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.company_name?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = 
        filterBy === 'all' ||
        (filterBy === 'verified' && u.isverified) ||
        (filterBy === 'unverified' && !u.isverified) ||
        (filterBy === 'business' && u.company_name);

      return matchesSearch && matchesFilter;
    });

    // Sort users
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.full_name || a.username).localeCompare(b.full_name || b.username);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'orders':
          return b.purchase_history.length - a.purchase_history.length;
        default:
          return 0;
      }
    });

    return result;
  }, [users, search, filterBy, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'confirmed': return 'text-purple-600 bg-purple-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'failed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'confirmed': return CheckCircle;
      case 'pending': return Clock;
      case 'cancelled': return XCircle;
      case 'failed': return AlertCircle;
      default: return Clock;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount / 100);
  };

  const handleUserClick = (user: IUser) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleViewOrders = (user: IUser) => {
    setSelectedUser(user);
    setShowOrdersModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 text-sm mt-1">Manage and monitor user accounts</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Businesses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.businesses}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, company..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
              title='Filter By'
                value={filterBy}
                onChange={e => { setFilterBy(e.target.value as any); setPage(1); }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
                <option value="business">Business Accounts</option>
              </select>
              
              <select
              title='Sort By'
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
                <option value="orders">Sort by Orders</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
                        <span className="text-gray-500">Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <UserX className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No users found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map(user => {
                    const userOrders = getUserOrders(user._id);
                    return (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                  {(user.full_name || user.username).charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.full_name || user.username}
                              </div>
                              <div className="text-sm text-gray-500">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          {user.phone_number && (
                            <div className="text-sm text-gray-500">{user.phone_number}</div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.company_name ? (
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.company_name}</div>
                              <div className="text-sm text-gray-500 capitalize">{user.business_type}</div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">No company</span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.isverified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isverified ? 'Verified' : 'Unverified'}
                            </span>
                            {user.role === 'admin' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Admin
                              </span>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Package className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">{userOrders.length}</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt).split(',')[0]}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleUserClick(user)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleViewOrders(user)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="View Orders"
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex items-center text-sm text-gray-500">
              Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* User Profile */}
              <div className="flex items-start gap-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {(selectedUser.full_name || selectedUser.username).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedUser.full_name || selectedUser.username}</h3>
                  <p className="text-gray-600">@{selectedUser.username}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.isverified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser.isverified ? 'Verified' : 'Unverified'}
                    </span>
                    {selectedUser.role === 'admin' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 text-gray-900">{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone_number && (
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2 text-gray-900">{selectedUser.phone_number}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Verification:</span>
                      <span className="ml-2 text-gray-900">{selectedUser.verification_method || 'None'}</span>
                    </div>
                  </div>
                </div>

                {selectedUser.company_name && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Business Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Company:</span>
                        <span className="ml-2 text-gray-900">{selectedUser.company_name}</span>
                      </div>
                      {selectedUser.business_type && (
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <span className="ml-2 text-gray-900 capitalize">{selectedUser.business_type}</span>
                        </div>
                      )}
                      {selectedUser.gst_number && (
                        <div>
                          <span className="text-gray-600">GST:</span>
                          <span className="ml-2 text-gray-900">{selectedUser.gst_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Address Information */}
              {selectedUser.addresses.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address Information
                  </h4>
                  <div className="space-y-3">
                    {selectedUser.addresses.map((address, index) => (
                      <div key={address._id} className="bg-white rounded p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{address.label}</span>
                          {address.is_default && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-700">
                          <p>{address.address_line1}</p>
                          {address.address_line2 && <p>{address.address_line2}</p>}
                          <p>{address.city}, {address.state} - {address.pincode}</p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Account Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Account Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">User ID:</span>
                    <span className="ml-2 text-gray-900 font-mono">{selectedUser._id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Joined:</span>
                    <span className="ml-2 text-gray-900">{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="ml-2 text-gray-900">{formatDate(selectedUser.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Order Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(() => {
                    const userOrders = getUserOrders(selectedUser._id);
                    const totalAmount = userOrders.reduce((sum, order) => sum + order.amount, 0);
                    return (
                      <>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{userOrders.length}</p>
                          <p className="text-sm text-gray-600">Total Orders</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
                          <p className="text-sm text-gray-600">Total Spent</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {userOrders.length > 0 ? formatCurrency(totalAmount / userOrders.length) : '₹0'}
                          </p>
                          <p className="text-sm text-gray-600">Average Order</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Modal */}
      {showOrdersModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Orders for {selectedUser.full_name || selectedUser.username}
              </h2>
              <button
                onClick={() => setShowOrdersModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {(() => {
                const userOrders = getUserOrders(selectedUser._id);
                
                if (userOrders.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No orders found</p>
                      <p className="text-gray-400 text-sm">This user hasn&apos;t placed any orders yet.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {userOrders.map(order => {
                      const StatusIcon = getStatusIcon(order.status);
                      return (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <StatusIcon className="w-5 h-5 text-gray-600" />
                                <h3 className="font-medium text-gray-900">Order #{order._id}</h3>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">{formatCurrency(order.amount)}</p>
                              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-100 pt-3">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items:</h4>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                  <div>
                                    <span className="text-gray-900">Product {item.productId}</span>
                                    <span className="text-gray-500 ml-2">× {item.quantity}</span>
                                  </div>
                                  <span className="text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {order.razorpayPaymentId && (
                            <div className="border-t border-gray-100 pt-3 mt-3">
                              <div className="text-sm text-gray-600">
                                <span>Payment ID: </span>
                                <span className="font-mono text-gray-900">{order.razorpayPaymentId}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}