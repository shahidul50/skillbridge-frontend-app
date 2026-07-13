import SuccessModule from "@/components/modules/book/SuccessModule";
import { Loader } from "@/components/shared/Loader";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Successful | SkillBridge",
  description: "Your session has been successfully booked. Thanks for using SkillBridge!",
};

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SuccessModule />
    </Suspense>
  );
}
