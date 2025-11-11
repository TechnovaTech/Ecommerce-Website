"use client"

import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, Tag } from "lucide-react"
import { useState } from "react"

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true)

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin", active: true },
    { icon: Package, label: "Products", href: "/admin/products" },
    { icon: Tag, label: "Categories", href: "/admin/categories" },
    { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
    { icon: Users, label: "Customers", href: "/admin/customers" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ]

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } border-r border-border bg-card transition-all duration-300 flex flex-col hidden md:flex fixed left-0 top-0 h-screen z-10`}
    >
      <div className="p-6 border-b border-border">
        <div className="text-xl font-bold text-primary">SM</div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
              </div>
            </Link>
          )
        })}
      </nav>


    </aside>
  )
}
