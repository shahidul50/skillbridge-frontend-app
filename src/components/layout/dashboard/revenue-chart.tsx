"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  { name: "Jan", total: 2000 }, { name: "Feb", total: 2500 }, { name: "Mar", total: 3800 },
  { name: "Apr", total: 3000 }, { name: "May", total: 4200 }, { name: "Jun", total: 4900 },
];

export function RevenueChart() {
  return (
    <Card className="border-none shadow-md ring-1 ring-border">
      <CardHeader className="border-b mb-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Overview</CardTitle>
        <div className="text-3xl font-bold">$4,702,000.00</div>
      </CardHeader>
      <CardContent className="h-75 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}