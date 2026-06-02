import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TStudentProfile } from "@/types/admin.type";
import { InfoItem } from "./InfoItem";

export function StudentLayout({ data }: { data: TStudentProfile }) {
  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="flex flex-col items-center mb-4">
        <div className="relative mb-2">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500" />
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
            <AvatarImage src={data.studentImage} alt={data.studentName} />
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
              {data.studentName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-1 right-1 h-6 w-6 bg-emerald-500 rounded-full border-4 border-background flex items-center justify-center">
            <div className="h-2 w-2 bg-white rounded-full" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-1 text-center">{data.studentName}</h2>
        <p className="text-xs text-muted-foreground mb-2 text-center">{data.studentEmail}</p>
        <Badge className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border-none">
          {data.role}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-4 bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-lg border border-emerald-100 dark:border-emerald-900/20 text-sm">
        <InfoItem label="JOIN DATE" value={data.joiningDate} />
        <InfoItem
          label="STATUS"
          value={data.accountStatus}
          icon={<div className="h-2 w-2 bg-emerald-500 rounded-full mr-2" />}
          valueClassName="text-foreground flex items-center font-semibold"
        />
        <InfoItem label="PHONE" value={data.phoneNumber} />
        <InfoItem label="TOTAL BOOKINGS" value={`${data.totalBookings} sessions`} />
      </div>

      <Card className="overflow-hidden border border-border px-0 shadow-sm dark:bg-zinc-900/50  w-full min-w-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            RECENT BOOKINGS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-2">
          <div className="rounded-lg border border-border overflow-x-auto w-full max-h-[220px] scrollbar-thin scrollbar-thumb-emerald-200 dark:scrollbar-thumb-emerald-800">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-[9px] font-bold h-8 uppercase">Date</TableHead>
                  <TableHead className="text-[9px] font-bold h-8 uppercase">Tutor</TableHead>
                  <TableHead className="text-[9px] font-bold h-8 uppercase">Subject</TableHead>
                  <TableHead className="text-[9px] font-bold h-8 uppercase">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentBookings?.map((booking, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/50 transition-colors border-b h-10">
                    <TableCell className="py-2 text-xs whitespace-nowrap">{booking.date}</TableCell>
                    <TableCell className="py-2 text-xs font-medium whitespace-nowrap">{booking.tutorName}</TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground whitespace-nowrap">
                      {Array.isArray(booking.subject) ? booking.subject.join(", ") : booking.subject}
                    </TableCell>
                    <TableCell className="py-2 text-xs font-semibold whitespace-nowrap">
                      <Badge
                        variant="secondary"
                        className={`font-semibold uppercase text-[10px] tracking-tight ${
                          booking.status === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : booking.status === "PENDING"
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                            : booking.status === "COMPLETED"
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                            : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border border-border shadow-sm dark:bg-zinc-900/50 w-full min-w-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            PAYMENT HISTORY
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-2">
          <div className="rounded-lg border border-border overflow-x-auto w-full max-h-[220px] scrollbar-thin">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-[9px] font-bold h-8 uppercase ">Transaction ID</TableHead>
                  <TableHead className="text-[9px] font-bold h-8 uppercase ">Amount</TableHead>
                  <TableHead className="text-[9px] font-bold h-8 uppercase ">Date</TableHead>
                  <TableHead className="text-[9px] font-bold h-8 uppercase ">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentPayments?.map((payment, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/50 transition-colors border-b h-10">
                    <TableCell className="py-2 text-xs text-muted-foreground whitespace-nowrap">{payment.transactionId}</TableCell>
                    <TableCell className="py-2 text-xs font-bold whitespace-nowrap">Tk {payment.amount?.toFixed(2)}</TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground whitespace-nowrap">{payment.submittedDate}</TableCell>
                    <TableCell className="py-2 text-xs font-semibold whitespace-nowrap">
                      <Badge
                        variant="secondary"
                        className={`font-semibold uppercase text-[10px] tracking-tight ${
                          payment.status === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : payment.status === "PENDING"
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                            : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
