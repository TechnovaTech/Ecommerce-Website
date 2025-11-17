import { TrendingUp, ShoppingCart, Users, DollarSign } from "lucide-react"

export default function OverviewCards() {
  const cards = [
    {
      title: "Total Revenue",
      value: "₹45,231",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+8.2%",
      icon: ShoppingCart,
      trend: "up",
    },
    {
      title: "Active Customers",
      value: "5,847",
      change: "+3.1%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Growth Rate",
      value: "24.5%",
      change: "+2.1%",
      icon: TrendingUp,
      trend: "up",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon
        return (
          <div key={i} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon size={24} className="text-primary" />
              </div>
              <span className="text-xs font-semibold text-green-600">{card.change}</span>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
          </div>
        )
      })}
    </div>
  )
}
