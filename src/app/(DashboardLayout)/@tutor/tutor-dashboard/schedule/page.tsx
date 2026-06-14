import { getTutorScheduleEventsAction, getTutorScheduleMetaAction } from "@/actions/tutor.action";
import ScheduleModule from "@/components/modules/dashboard/tutor/ScheduleModule";
import { format, startOfDay, endOfDay } from "date-fns";

const SchedulePage = async () => {
    const metaRes = await getTutorScheduleMetaAction();
    
    // Default to today for initial events
    const today = new Date();
    const startDate = format(startOfDay(today), "yyyy-MM-dd");
    const endDate = format(endOfDay(today), "yyyy-MM-dd");
    
    const eventsRes = await getTutorScheduleEventsAction({ startDate, endDate });

    if (!metaRes.data || !eventsRes.data) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <p className="text-muted-foreground font-bold">Failed to load schedule data. Please try again later.</p>
            </div>
        );
    }

    return (
        <ScheduleModule 
            meta={metaRes.data} 
            initialEvents={eventsRes.data} 
        />
    );
};

export default SchedulePage;
