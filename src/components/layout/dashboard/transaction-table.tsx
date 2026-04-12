// components/dashboard/transaction-table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TransactionTable() {
  return (
    <Card className="border-none shadow-md ring-1 ring-border">
      <CardHeader className="border-b">
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">TXN-100201</TableCell>
              <TableCell>Sarah Johnson</TableCell>
              <TableCell className="font-bold">$129.99</TableCell>
              <TableCell><Badge className="bg-emerald-500/10 text-emerald-600 border-none">Completed</Badge></TableCell>
            </TableRow>
            {/* আরও ডেটা এখানে আসবে */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}