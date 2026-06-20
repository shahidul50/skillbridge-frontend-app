import VerifyEmailModule from "@/components/modules/auth/VerifyEmailModule";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Verify Email | SkillBridge",
  description: "Verify your email address to get started with SkillBridge.",
};

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617]">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        </div>
    }>
      <VerifyEmailModule />
    </Suspense>
  );
};

export default VerifyEmailPage;
