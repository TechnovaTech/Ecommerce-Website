"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function RevenueChart() {
  const data = [
    { date: "Nov 1", revenue: 4000, orders: 24 },
    { date: "Nov 2", revenue: 3000, orders: 13 },
    { date: "Nov 3", revenue: 2000, orders: 9 },
    { date: "Nov 4", revenue: 2780, orders: 39 },
    { date: "Nov 5", revenue: 1890, orders: 48 },
    { date: "Nov 6", revenue: 2390, orders: 38 },
    { date: "Nov 7", revenue: 3490, orders: 43 },
    { date: "Nov 8", revenue: 4200, orders: 52 },
    { date: "Nov 9", revenue: 3800, orders: 41 },
    { date: "Nov 10", revenue: 4500, orders: 48 },
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Revenue Trend</h3>
        <p className="text-sm text-muted-foreground">Last 10 days performance</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="date" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
          <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: `1px solid var(--color-border)`,
              borderRadius: "8px",
            }}
            labelStyle={{ color: "var(--color-foreground)" }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={false}
            name="Revenue"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
