"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setTutorCategoriesAction } from "@/actions/tutor.action";
import { cn } from "@/lib/utils";
import { motion, type Variants, AnimatePresence } from "framer-motion";

// ── Animation Variants ─────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 max-w-5xl mx-auto p-4 md:p-0"
    >
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Subject Selection</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Select the subjects you're qualified to teach. Click a badge to select or deselect it.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 overflow-hidden">
          <CardContent className="p-6 md:p-8 space-y-8">
            <div className="flex flex-wrap gap-3">
              <AnimatePresence>
                {allCategories.map((category) => {
                  const isSelected = selectedIds.includes(category.id);
                  return (
                    <motion.button
                      key={category.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSubject(category.id)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 border-2",
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : "border-zinc-100 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700"
                      )}
                    >
                      {category.name}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-zinc-100 dark:border-zinc-800"
            >
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 text-center sm:text-left">
                <motion.span
                  key={selectedIds.length}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-600 font-bold inline-block"
                >
                  {selectedIds.length}
                </motion.span>{" "}
                subjects currently selected.
              </p>
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="ghost"
                    onClick={handleDiscard}
                    className="font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 h-11 px-6 rounded-xl w-full sm:w-auto"
                  >
                    Discard Changes
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="bg-[#22c55e] hover:bg-[#1eb054] text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-emerald-600/10 transition-colors w-full sm:w-auto"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Categories"
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5 md:p-6 flex gap-4 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
          <div className="shrink-0 size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Info className="size-5 text-emerald-600 dark:text-emerald-400" />
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
      </motion.div>
    </motion.div>
  );
};
