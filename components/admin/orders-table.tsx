import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"

export default function OrdersTable() {
  const orders = [
    {
      id: "#ORD001",
      customer: "John Doe",
      date: "2025-11-10",
      amount: "₹2,450",
      status: "completed",
      items: 3,
    },
    {
      id: "#ORD002",
      customer: "Jane Smith",
      date: "2025-11-09",
      amount: "₹1,890",
      status: "pending",
      items: 2,
    },
    {
      id: "#ORD003",
      customer: "Mike Johnson",
      date: "2025-11-08",
      amount: "₹3,120",
      status: "processing",
      items: 5,
    },
    {
      id: "#ORD004",
      customer: "Sarah Williams",
      date: "2025-11-07",
      amount: "₹1,560",
      status: "completed",
      items: 2,
    },
    {
      id: "#ORD005",
      customer: "Tom Brown",
      date: "2025-11-06",
      amount: "₹2,890",
      status: "cancelled",
      items: 1,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Items</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={i} className="border-b border-border hover:bg-secondary transition">
                <td className="px-6 py-4 text-sm font-semibold text-foreground">{order.id}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{order.items}</td>
                <td className="px-6 py-4 text-sm font-semibold text-foreground">{order.amount}</td>
                <td className="px-6 py-4">
                  <Badge className={`text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 text-muted-foreground hover:text-foreground transition">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
