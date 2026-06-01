"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  GraduationCap,
  UserRound,
  Ban,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { TAdminStats } from "@/types/admin.type";

interface DashboardModuleProps {
  stats: TAdminStats;
}

const DashboardModule = ({ stats }: DashboardModuleProps) => {
  const statCards = [
    {
      title: "TOTAL USERS",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
      link: "/admin-dashboard/users",
    },
    {
      title: "TOTAL TUTORS",
      value: stats.totalTutors.toLocaleString(),
      icon: GraduationCap,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
      link: "/admin-dashboard/users?role=tutor",
    },
    {
      title: "TOTAL STUDENTS",
      value: stats.totalStudents.toLocaleString(),
      icon: UserRound,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
      link: "/admin-dashboard/users?role=student",
    },
    {
      title: "BANNED USERS",
      value: stats.totalBannedUsers.toLocaleString(),
      icon: Ban,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-500/10",
      link: "/admin-dashboard/users?status=banned",
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm dark:bg-zinc-900/50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider">
                  {stat.title}
                </span>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </h3>
                <Link
                  href={stat.link}
                  className="inline-flex items-center text-sm font-medium text-emerald-500 hover:underline transition-all"
                >
                  View Details
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card className="border-none shadow-sm dark:bg-zinc-900/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Recent Bookings</CardTitle>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Monitor and manage the latest tutoring sessions
            </p>
          </div>
          <Link
            href="/admin-dashboard/bookings"
            className="text-sm font-semibold text-emerald-500 hover:underline"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/50 dark:bg-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-wider">
                    Student
                  </TableHead>
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-wider">
                    Tutor
                  </TableHead>
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-wider">
                    Subject
                  </TableHead>
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-wider text-center">
                    Date & Time
                  </TableHead>
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-wider text-right">
                    Amount
                  </TableHead>
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-wider text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentBookings.map((booking, index) => (
                  <TableRow key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={booking.studentImage} alt={booking.studentName} />
                          <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {booking.studentName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            {booking.studentName}
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {booking.studentEmail}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={booking.TutorImage} alt={booking.TutorName} />
                          <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {booking.TutorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            {booking.TutorName}
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {booking.TutorEmail}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-600 dark:text-zinc-400 italic">
                      {booking.TutorCategories.join(", ")}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col text-sm">
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {booking.availabilitySlotDate}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {booking.availabilitySlotStartTime} - {booking.availabilitySlotEndTime}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-zinc-900 dark:text-zinc-100">
                      TK {booking.Price}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="secondary"
                        className={`font-semibold uppercase text-[10px] tracking-tight ${
                          booking.Status === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : booking.Status === "PENDING"
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                            : booking.Status === "COMPLETED"
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                            : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                      >
                        {booking.Status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="border-none shadow-sm dark:bg-zinc-900/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Recent Transactions</CardTitle>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              View and manage latest financial activities
            </p>
          </div>
          <Link
            href="/admin-dashboard/payments"
            className="text-sm font-semibold text-emerald-500 hover:underline"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/50 dark:bg-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-wider">
                    Transaction ID
                  </TableHead>
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-wider">
                    Student
                  </TableHead>
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-wider text-right">
                    Amount
                  </TableHead>
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-wider text-center">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-wider text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentPayments.map((payment, index) => (
                  <TableRow key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800">
                    <TableCell className="font-medium text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase">
                      {payment.transactionId}
                    </TableCell>
                    <TableCell className="font-bold text-zinc-900 dark:text-zinc-100">
                      {payment.StudentName}
                    </TableCell>
                    <TableCell className="text-right font-bold text-zinc-900 dark:text-zinc-100 uppercase">
                      TK {payment.Amount}
                    </TableCell>
                    <TableCell className="text-center text-zinc-600 dark:text-zinc-400">
                      {payment.Date}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="secondary"
                        className={`font-semibold uppercase text-[10px] tracking-tight ${
                          payment.Status === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : payment.Status === "PENDING"
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                            : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                      >
                        {payment.Status}
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
};

export default DashboardModule;
