import { getStudentScheduleEventsDataAction, getStudentScheduleMetaDataAction } from "@/actions/student.action";
import ScheduleModule from "@/components/modules/dashboard/student/ScheduleModule";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default async function SchedulePage() {
  const meta = await getStudentScheduleMetaDataAction();
  
  // Initial date range for events (current month)
  const now = new Date();
  const startDate = format(startOfMonth(now), "yyyy-MM-dd");
  const endDate = format(endOfMonth(now), "yyyy-MM-dd");
  
  const initialEvents = await getStudentScheduleEventsDataAction({ startDate, endDate });

  return (
    <div className="flex-1 w-full flex flex-col">
       {meta.data ? (
         <ScheduleModule 
           meta={meta.data} 
           initialEvents={initialEvents.data || { calendarEvents: [] }} 
         />
       ) : (
         <div className="flex-1 flex items-center justify-center p-20">
            <p className="text-muted-foreground font-bold">Failed to load schedule metadata.</p>
         </div>
       )}
    </div>
  );
}
