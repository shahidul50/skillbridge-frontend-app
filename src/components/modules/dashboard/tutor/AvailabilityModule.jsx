"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DayRow from "./DayRow";
import AddSlotModal from "./AddSlotModal";
import { 
  getWeeklyAvailableSlots, 
  createWeeklyAvailableSlot, 
  updateWeeklyAvailableSlot, 
  deleteWeeklyAvailableSlot 
} from "@/actions/tutor.action";
import { toast } from "sonner";

const DAYS_OF_WEEK = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const AvailabilityModule = () => {
  const [availability, setAvailability] = useState({
    Saturday: [],
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  });

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [newSlotData, setNewSlotData] = useState({
    startTime: "09:00",
    endTime: "10:00",
  });

  const fetchAvailability = async () => {
    setLoading(true);
    const { data, error } = await getWeeklyAvailableSlots();
    if (error) {
      toast.error(error);
    } else if (data) {
      // Group slots by day
      const grouped = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      };
      data.forEach((slot) => {
        if (grouped[slot.dayOfWeek]) {
          grouped[slot.dayOfWeek].push(slot);
        }
      });

      // Sort slots by time for each day
      Object.keys(grouped).forEach(day => {
        grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
      });

      setAvailability(grouped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleToggleSlot = async (day, slotId, currentStatus) => {
    const res = await updateWeeklyAvailableSlot(slotId, { isActive: !currentStatus });
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Slot status updated");
      setAvailability((prev) => ({
        ...prev,
        [day]: prev[day].map((slot) =>
          slot.id === slotId ? { ...slot, isActive: !slot.isActive } : slot
        ),
      }));
    }
  };

  const handleDeleteSlot = async (day, slotId) => {
    const res = await deleteWeeklyAvailableSlot(slotId);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Slot deleted");
      setAvailability((prev) => ({
        ...prev,
        [day]: prev[day].filter((slot) => slot.id !== slotId),
      }));
    }
  };

  const openModal = (day) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleAddSlot = async () => {
    const slotPayload = {
      dayOfWeek: selectedDay,
      startTime: newSlotData.startTime,
      endTime: newSlotData.endTime,
    };
    
    const res = await createWeeklyAvailableSlot(slotPayload);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("New slot added");
      setIsModalOpen(false);
      fetchAvailability(); // Refresh to get the new slot with ID
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        when: "beforeChildren",
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-slate-800 dark:text-white"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div>
          <h1 className="text-2xl font-bold font-tight">Manage Availability</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Set your recurring weekly teaching hours. Use toggles to activate or deactivate slots.
          </p>
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
           {[...Array(7)].map((_, i) => (
             <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl w-full" />
           ))}
        </div>
      ) : (
        <div className="space-y-4">
          {DAYS_OF_WEEK.map((day) => (
            <motion.div key={day} variants={rowVariants}>
              <DayRow
                day={day}
                slots={availability[day]}
                onToggleSlot={(id, status) => handleToggleSlot(day, id, status)}
                onDeleteSlot={(id) => handleDeleteSlot(day, id)}
                onAddSlot={() => openModal(day)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Slot Modal Component */}
      <AddSlotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDay={selectedDay}
        newSlotData={newSlotData}
        setNewSlotData={setNewSlotData}
        onAddSlot={handleAddSlot}
      />
    </motion.div>
  );
};

export default AvailabilityModule;
