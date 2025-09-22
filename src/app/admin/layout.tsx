// src/app/admin/layout.tsx
import Link from 'next/link';

export const metadata = { title: 'Admin Dashboard' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <nav className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl mb-6">Admin</h1>
        <ul className="space-y-2">
          <li><Link href="/admin/dashboard">Dashboard</Link></li>
          <li><Link href="/admin/products">Products</Link></li>
          <li><Link href="/admin/users">Users</Link></li>
          <li><Link href="/admin/orders">Orders</Link></li>
          <li><Link href="/admin/category">Category</Link></li>
          <li><Link href="/admin/coupon&banner">Coupon & Banner</Link></li>
        </ul>
      </nav>
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
