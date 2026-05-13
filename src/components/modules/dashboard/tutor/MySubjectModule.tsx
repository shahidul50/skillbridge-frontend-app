"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiInformationLine, RiLoader2Line } from "@remixicon/react";
import { toast } from "sonner";
import { setTutorCategoriesAction } from "@/actions/tutor.action";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface MySubjectModuleProps {
  allCategories: Category[];
  initialSelectedIds: string[];
}

export const MySubjectModule = ({ allCategories, initialSelectedIds }: MySubjectModuleProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync with initialSelectedIds if they change
  useEffect(() => {
    setSelectedIds(initialSelectedIds);
  }, [initialSelectedIds]);

  const toggleSubject = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const res = await setTutorCategoriesAction(selectedIds);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Subjects updated successfully");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDiscard = () => {
    setSelectedIds(initialSelectedIds);
    toast.info("Changes discarded");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-0">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Subject Selection</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Select the subjects you're qualified to teach. Click a badge to select or deselect it.
        </p>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 overflow-hidden">
        <CardContent className="p-6 md:p-8 space-y-8">
          <div className="flex flex-wrap gap-3">
            {allCategories.map((category) => {
              const isSelected = selectedIds.includes(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => toggleSubject(category.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2",
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                      : "border-zinc-100 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700"
                  )}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 text-center sm:text-left">
              <span className="text-emerald-600 font-bold">{selectedIds.length} subjects</span> currently selected.
            </p>
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button
                variant="ghost"
                onClick={handleDiscard}
                className="font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 h-11 px-6 rounded-xl w-full sm:w-auto"
              >
                Discard Changes
              </Button>
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-[#22c55e] hover:bg-[#1eb054] text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-emerald-600/10 transition-all w-full sm:w-auto"
              >
                {isUpdating ? (
                  <>
                    <RiLoader2Line className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Categories"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5 md:p-6 flex gap-4">
        <div className="shrink-0 size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <RiInformationLine className="size-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-emerald-900 dark:text-emerald-100">Subject Verification</h4>
          <p className="text-sm leading-relaxed text-emerald-700/80 dark:text-emerald-400/70">
            Selecting subjects helps us match you with the right students. Please ensure you have the necessary
            certifications or academic background for your selected subjects. We may periodically review tutor
            credentials for high-demand categories.
          </p>
        </div>
      </div>
    </div>
  );
};
