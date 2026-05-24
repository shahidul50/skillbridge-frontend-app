import SuccessModule from "@/components/modules/book/SuccessModule";
import { Loader } from "@/components/shared/Loader";
import { Suspense } from "react";

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SuccessModule />
    </Suspense>
  );
}
