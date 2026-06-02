"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TStudentProfileResponse, TTutorProfileResponse, UserRole } from "@/types/admin.type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TutorLayout } from "./TutorLayout";
import { StudentLayout } from "./StudentLayout";

interface ProfileDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: TTutorProfileResponse | TStudentProfileResponse | null;
}

export default function ProfileDetailsModal({
  isOpen,
  onOpenChange,
  data,
}: ProfileDetailsModalProps) {
  if (!data) return null;

  // Identify type
  const isTutor = data.role === UserRole.TUTOR || "tutorName" in data;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-2xl lg:max-w-lg p-0 overflow-hidden bg-background border-border flex flex-col h-[90vh] max-h-[90vh]">
        <DialogHeader className="p-6 pb-2 border-b-0 shrink-0">
          <DialogTitle className="text-2xl font-bold tracking-tight text-center sm:text-left">
            {isTutor ? "Tutor Profile Overview" : "Student Profile Overview"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 w-full min-h-0">
          <div className="py-2 pb-6 px-4 sm:px-6">
            {isTutor ? (
              <TutorLayout data={data as TTutorProfileResponse} />
            ) : (
              <StudentLayout data={data as TStudentProfileResponse} />
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-emerald-50/30 dark:bg-emerald-900/5 flex justify-end shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-8 font-semibold border-emerald-200 dark:border-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
