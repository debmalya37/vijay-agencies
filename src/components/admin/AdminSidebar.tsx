"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Tags,
  Layers,
  Store,
} from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Category", href: "/admin/category", icon: Layers },
  { name: "Coupon & Banner", href: "/admin/coupon&banner", icon: Tags },
  { name: "Brands", href: "/admin/brand", icon: Store },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-gray-900 text-white flex flex-col shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <h1 className="text-xl font-bold">Admin Panel</h1>}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-300 hover:text-white transition"
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto mt-4 space-y-1">
        {sidebarLinks.map(({ name, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);

          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-300 hover:bg-gray-800"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span>{name}</span>}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
