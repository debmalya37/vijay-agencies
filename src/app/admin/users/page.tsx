// src/app/admin/users/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'

interface User {
  _id: string
  email: string
  username: string
  company_name?: string
  gst_number?: string
  business_type?: string
  isverified: boolean
  admin_approval: boolean
}

// Static demo users
const demoUsers: User[] = [
  {
    _id: 'USR0001',
    email: 'alice@corp.com',
    username: 'alice_corp',
    company_name: 'Alice Industries',
    gst_number: '27AAACI1234K1Z2',
    business_type: 'manufacturer',
    isverified: true,
    admin_approval: true,
  },
  {
    _id: 'USR0002',
    email: 'bob@distribute.com',
    username: 'bob_dist',
    company_name: 'Bob Distributors',
    gst_number: '29BBBCD5678L3Z4',
    business_type: 'distributor',
    isverified: false,
    admin_approval: false,
  },
]

export default function AdminUsersPage() {
  // start with demo users
  const [users, setUsers] = useState<User[]>(demoUsers)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 10

  // fetch real users and replace demo if any
  useEffect(() => {
    axios.get<User[]>('/api/admin/users')
      .then(res => {
        if (res.data.length) {
          setUsers(res.data)
        }
      })
      .catch(() => {
        // keep demoUsers on error
      })
  }, [])

  const stats = useMemo(() => {
    const total = users.length
    const verified = users.filter(u => u.isverified).length
    const pending = users.filter(u => !u.admin_approval).length
    return { total, verified, pending }
  }, [users])

  const filtered = useMemo(() => {
    return users.filter(u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.business_type?.toLowerCase().includes(search.toLowerCase())
    )
  }, [users, search])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page])

  const toggleApproval = async (id: string, approve: boolean) => {
    // if demo user, skip API
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      setUsers(us => us.map(u => u._id === id ? { ...u, admin_approval: approve } : u))
      return
    }
    await axios.patch('/api/admin/users', { id, update: { admin_approval: approve } })
    setUsers(us => us.map(u => u._id === id ? { ...u, admin_approval: approve } : u))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm uppercase">Total Users</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm uppercase">Verified</p>
          <p className="text-2xl font-semibold">{stats.verified}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm uppercase">Pending Approval</p>
          <p className="text-2xl font-semibold">{stats.pending}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, company..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full md:w-1/3 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-800 rounded shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-700">
              {['Username', 'Email', 'Company', 'Business Type', 'Verified', 'Admin Approved', 'Actions']
                .map(h => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-medium">{h}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map(u => (
              <tr key={u._id} className="border-b border-gray-700">
                <td className="px-4 py-2">{u.username}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.company_name || '—'}</td>
                <td className="px-4 py-2">{u.business_type || '—'}</td>
                <td className="px-4 py-2">{u.isverified ? '✔️' : '❌'}</td>
                <td className="px-4 py-2">{u.admin_approval ? '✔️' : '❌'}</td>
                <td className="px-4 py-2 space-x-2">
                  {u.admin_approval ? (
                    <button
                      onClick={() => toggleApproval(u._id, false)}
                      className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 text-sm"
                    >Revoke</button>
                  ) : (
                    <button
                      onClick={() => toggleApproval(u._id, true)}
                      className="px-3 py-1 bg-green-600 rounded hover:bg-green-500 text-sm"
                    >Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >Next</button>
      </div>
    </div>
  )
}
