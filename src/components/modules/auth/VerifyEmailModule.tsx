"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight, RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Roles } from "@/constants/roles";

const VerifyEmailModule = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const hasStartedVerification = useRef(false);
    
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email address...");
    
    // Resend states
    const [showResendForm, setShowResendForm] = useState(false);
    const [resendEmail, setResendEmail] = useState("");
    const [isResending, setIsResending] = useState(false);

    // 🚀 Session fetch for already verified check and redirection
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        const verify = async () => {
             // Wait for session to load
             if (isPending) return;

             // Prevent multiple verification calls
             if (hasStartedVerification.current) return;

             // 1. If user is already verified, inform and redirect immediately
             if (session?.user?.emailVerified) {
                hasStartedVerification.current = true;
                setStatus("success");
                setMessage("Your email is already verified! Redirecting to dashboard...");
                
                const user = session.user as { role?: string };
                const dashboardPath = user?.role === Roles.admin ? "/admin-dashboard" : 
                                    user?.role === Roles.tutor ? "/tutor-dashboard" : "/dashboard";
                
                setTimeout(() => {
                    router.push(dashboardPath);
                }, 2000);
                return;
            }

            // 2. If no token found in URL
            if (!token) {
                setStatus("error");
                setMessage("Invalid or missing verification token.");
                return;
            }

            try {
                hasStartedVerification.current = true;
                // 🚀 direct BetterAuth client call for verification
                const { error } = await authClient.verifyEmail({
                    query: {
                        token: token,
                    },
                });

                if (error) {
                    setStatus("error");
                    setMessage(error.message || "Verification failed.");
                    toast.error(error.message || "Verification failed.");
                } else {
                    setStatus("success");
                    setMessage("Your email has been successfully verified! Redirecting to dashboard...");
                    toast.success("Email verified successfully!");

                    // 3. Successful verification: small delay then redirect to dashboard
                    setTimeout(() => {
                        const user = session?.user as { role?: string };
                        window.location.href = user?.role === Roles.admin ? "/admin-dashboard" : 
                                             user?.role === Roles.tutor ? "/tutor-dashboard" : "/dashboard";
                    }, 2000);
                }
            } catch (error) {
                setStatus("error");
                setMessage("An error occurred. Please try again later.");
                toast.error("An error occurred during verification.");
            }
        };

        const timeout = setTimeout(verify, 1000);
        return () => clearTimeout(timeout);
    }, [token, isPending, session, router]);

    const handleResendEmail = async () => {
        if (!resendEmail) {
            toast.error("Please enter your email address.");
            return;
        }

        setIsResending(true);
        try {
            const { error } = await authClient.sendVerificationEmail({
                email: resendEmail,
                callbackURL: window.location.href.split('?')[0] // current URL without token
            });

            if (error) {
                toast.error(error.message || "Failed to resend confirmation email.");
            } else {
                toast.success("Verification link sent! Please check your inbox.");
                setShowResendForm(false);
                setResendEmail("");
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617] p-4 font-outfit">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md"
            >
                <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden rounded-[32px] p-8 md:p-10 text-center relative">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full -ml-16 -mb-16 blur-2xl" />

                    <AnimatePresence mode="wait">
                        {status === "loading" && (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="space-y-6 relative z-10"
                            >
                                <div className="mx-auto w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-3xl flex items-center justify-center relative">
                                    <div className="absolute inset-0 rounded-3xl border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                                    <Mail className="w-10 h-10 text-emerald-500" />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Verifying...</h1>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">{message}</p>
                                </div>
                            </motion.div>
                        )}

                        {status === "success" && (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6 relative z-10"
                            >
                                <div className="mx-auto w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Success!</h1>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">{message}</p>
                                </div>
                                <div className="pt-4 flex items-center justify-center gap-2 text-emerald-600 font-bold animate-pulse">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Redirecting to dashboard...
                                </div>
                            </motion.div>
                        )}

                        {status === "error" && (
                            <motion.div 
                                key="error"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6 relative z-10"
                            >
                                <div className="mx-auto w-20 h-20 bg-rose-500 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                                    <XCircle className="w-10 h-10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Verification Failed</h1>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">{message}</p>
                                </div>

                                {!showResendForm ? (
                                    <div className="flex flex-col gap-3">
                                        <Button 
                                            onClick={() => setShowResendForm(true)}
                                            className="w-full h-12 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                                        >
                                            <RefreshCw className="w-4 h-4" /> Resend Verification Email
                                        </Button>
                                        <Button 
                                            onClick={() => router.push("/")}
                                            variant="outline"
                                            className="w-full h-12 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                        >
                                            Back to Home
                                        </Button>
                                    </div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2 text-left">
                                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 px-1">Email Address</label>
                                            <Input 
                                                type="email" 
                                                placeholder="Enter your email" 
                                                value={resendEmail}
                                                onChange={(e) => setResendEmail(e.target.value)}
                                                className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-xl"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                onClick={() => setShowResendForm(false)}
                                                variant="ghost"
                                                className="flex-1 h-12 rounded-xl"
                                            >
                                                Cancel
                                            </Button>
                                            <Button 
                                                onClick={handleResendEmail}
                                                disabled={isResending}
                                                className="flex-[2] h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                                            >
                                                {isResending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                Send Link
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </motion.div>
        </div>
    );
};

export default VerifyEmailModule;
