// components/dashboard/stat-card.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, change, icon: Icon }: StatCardProps) {
  return (
    <Card className="border-none shadow-md ring-1 ring-border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between text-muted-foreground text-sm font-medium">
          <Icon className="size-5 text-primary" />
          {title}
        </div>
        <div className="mt-2 text-2xl font-bold">{value}</div>
        <div className="mt-3 flex items-center justify-end">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-900 border-emerald-200">
            {change}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}