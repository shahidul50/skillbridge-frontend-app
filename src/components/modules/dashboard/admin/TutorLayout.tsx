import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TTutorProfileResponse } from "@/types/admin.type";
import { Star } from "lucide-react";
import { InfoItem } from "./InfoItem";

export function TutorLayout({ data }: { data: TTutorProfileResponse }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center mb-4">
        <div className="relative mb-2">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-pulse-slow" />
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
            <AvatarImage src={data.tutorImage} alt={data.tutorName} />
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
              {data.tutorName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {
            data.status === "Active" && <div className="absolute bottom-1 right-1 h-6 w-6 bg-emerald-500 rounded-full border-4 border-background flex items-center justify-center">
            <div className="h-2 w-2 bg-white rounded-full" />
          </div>
          }
        </div>
        <h2 className="text-3xl font-bold mb-1">{data.tutorName}</h2>
        <p className="text-muted-foreground mb-3">{data.tutorEmail}</p>
        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-1 rounded-md text-sm font-bold uppercase tracking-wider">
          {data.role}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-lg border border-emerald-100 dark:border-emerald-900/20 text-sm">
        <InfoItem label="JOINING DATE" value={data.joiningDate} />
        <InfoItem
          label="STATUS"
          value={data.status}
          icon={<div className={`h-2 w-2 ${data.status === "Active" ? "bg-emerald-500" : "bg-red-500" }  rounded-full mr-2`} />}
          valueClassName="text-foreground flex items-center"
        />
        <div className="col-span-full">
          <InfoItem label="TITLE" value={data.tutorTitle} valueClassName="italic text-foreground" />
        </div>
        <InfoItem label="EXPERIENCE" value={data.experience} />
        <InfoItem label="PHONE NUMBER" value={data.phoneNumber} />
        <InfoItem
          label="HOURLY RATE"
          value={`TK ${data.hourlyRate}/hr`}
          valueClassName="text-emerald-600 dark:text-emerald-400 font-bold"
        />
        <InfoItem
          label="RATING"
          value={data.rating?.toString()}
          icon={<Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />}
          valueClassName="flex items-center font-bold"
        />
        <InfoItem label="TOTAL REVIEWS" value={`${data.totalReviews} Reviews`} />
        <InfoItem label="TOTAL SESSIONS" value={`${data.totalSession}`} />
        <div className="col-span-full">
          <InfoItem label="TOTAL STUDENTS TAUGHT" value={`${data.totalStudentTaught} unique students`} />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Professional Bio</h3>
        <div className="bg-card border border-border p-4 rounded-lg shadow-sm text-xs text-muted-foreground leading-relaxed">
          {data.bio}
        </div>
      </div>
    </div>
  );
}
