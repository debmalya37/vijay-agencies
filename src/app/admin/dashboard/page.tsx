// src/app/admin/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

interface Stats {
  users: number
  products: number
  orders: number
}

// Demo stats to show immediately
const demoStats: Stats = {
  users: 120,
  products: 80,
  orders: 45,
}

// Static demo data for charts
const demoUserGrowth = [
  { month: 'Apr', newUsers: 15 },
  { month: 'May', newUsers: 22 },
  { month: 'Jun', newUsers: 30 },
  { month: 'Jul', newUsers: 18 },
]
const demoSalesOverview = [
  { month: 'Apr', sales: 5_000 },
  { month: 'May', sales: 7_200 },
  { month: 'Jun', sales: 9_500 },
  { month: 'Jul', sales: 6_800 },
]

// Static recent orders
const recentOrders = [
  { id: 'ORD12345', customer: 'john_doe', total: 1499, status: 'pending' },
  { id: 'ORD67890', customer: 'jane_smith', total: 2599, status: 'shipped' },
  { id: 'ORD54321', customer: 'acme_corp', total: 4999, status: 'delivered' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>(demoStats)

  useEffect(() => {
    Promise.all([
      axios.get('/api/admin/users'),
      axios.get('/api/admin/products'),
      axios.get('/api/admin/orders'),
    ])
      .then(([u, p, o]) => {
        setStats({
          users: Array.isArray(u.data) ? u.data.length : stats.users,
          products: Array.isArray(p.data) ? p.data.length : stats.products,
          orders: Array.isArray(o.data) ? o.data.length : stats.orders,
        })
      })
      .catch(() => {
        // keep demoStats
      })
  }, [])

  const cards = [
    { label: 'Total Users', value: stats.users, color: 'border-blue-500' },
    { label: 'Total Products', value: stats.products, color: 'border-green-500' },
    { label: 'Total Orders', value: stats.orders, color: 'border-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 space-y-12">
      <h1 className="text-4xl font-extrabold">Admin Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(c => (
          <div
            key={c.label}
            className={`bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 ${c.color}`}
          >
            <p className="text-sm uppercase tracking-wide text-gray-400">
              {c.label}
            </p>
            <p className="mt-2 text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Growth & Sales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-xl font-semibold mb-4 text-gray-200">
            User Growth (New Users / Month)
          </p>
          <ul className="space-y-2">
            {demoUserGrowth.map(d => (
              <li key={d.month} className="flex justify-between text-gray-100">
                <span>{d.month}</span>
                <span>{d.newUsers}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sales Overview */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-xl font-semibold mb-4 text-gray-200">
            Sales Overview (₹ / Month)
          </p>
          <ul className="space-y-2">
            {demoSalesOverview.map(d => (
              <li key={d.month} className="flex justify-between text-gray-100">
                <span>{d.month}</span>
                <span>₹{d.sales.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <p className="text-xl font-semibold mb-4 text-gray-200">Recent Orders</p>
        <table className="w-full text-left text-gray-100">
          <thead>
            <tr className="border-b border-gray-700">
              {['Order ID', 'Customer', 'Total', 'Status'].map(h => (
                <th key={h} className="py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(o => (
              <tr key={o.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="py-2">{o.id}</td>
                <td className="py-2">{o.customer}</td>
                <td className="py-2">₹{o.total}</td>
                <td className="py-2 capitalize">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
