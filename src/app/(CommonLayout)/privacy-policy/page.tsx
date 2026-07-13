import { Container } from "@/components/layout/Container";
import { 
  FileText, User, MessageSquare, Activity, CheckCircle2, 
  Cookie, Lock, ShieldCheck, Shield 
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SkillBridge",
  description: "Learn about how SkillBridge collects, uses, and protects your personal data.",
};

const PrivacyPolicyPage = () => {
  return (
    <section className="min-h-screen bg-[#eef5ed] dark:bg-zinc-950 py-16 lg:py-24 transition-colors duration-300">
      <Container>
        {/* Header Section */}
        <div className="mb-12">
           <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 mb-4">
             <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
               LEGAL CENTER
             </span>
           </div>
           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
             Privacy Policy
           </h1>
           <p className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
             Effective Date: July 2026
           </p>
        </div>

        {/* Intro Block */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 md:p-8 shadow-sm border-l-4 border-emerald-600 dark:border-emerald-500 mb-12">
          <p className="text-gray-700 dark:text-zinc-300 leading-relaxed text-sm md:text-base">
            Welcome to <strong className="text-gray-900 dark:text-white">SkillBridge</strong>. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and secure your information when you use our platform as a Student or Tutor.
          </p>
        </div>

        {/* 1. Information We Collect */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-lg w-fit">
              <FileText className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Information We Collect</h2>
          </div>
          <p className="text-gray-600 dark:text-zinc-400 mb-6 md:ml-12 text-sm md:text-base">
            We collect information to provide a secure and seamless experience on our platform:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:ml-12">
            {/* Account Info */}
            <div className="bg-emerald-50/50 dark:bg-zinc-900/50 border border-emerald-100 dark:border-zinc-800 rounded-xl p-6">
              <User className="w-5 h-5 text-emerald-600 dark:text-emerald-500 mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Account Info</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                Full name, email address, password, and role selection during signup.
              </p>
            </div>
            
            {/* Profile Info */}
            <div className="bg-emerald-50/50 dark:bg-zinc-900/50 border border-emerald-100 dark:border-zinc-800 rounded-xl p-6">
              <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-500 mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Profile Info</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                Profile pictures, session pricing, and expertise provided by Tutors.
              </p>
            </div>

            {/* Communications */}
            <div className="bg-emerald-50/50 dark:bg-zinc-900/50 border border-emerald-100 dark:border-zinc-800 rounded-xl p-6">
              <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-500 mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Communications</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                Name, email, and message content sent via our Contact Form.
              </p>
            </div>
          </div>
        </div>

        {/* 2. How We Use Your Information */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-lg w-fit">
              <Activity className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. How We Use Your Information</h2>
          </div>
          <p className="text-gray-600 dark:text-zinc-400 mb-6 md:ml-12 text-sm md:text-base">
            We use your data for the following essential purposes:
          </p>

          <ul className="space-y-4 md:ml-12">
            {[
              "To authenticate your identity and maintain your active session across devices.",
              "To display relevant Tutor profiles to Students seeking specific lessons or expertise.",
              "To process contact messages and continuously improve our global support services.",
              "To ensure the overall safety, integrity, and security of our educational community."
            ].map((text, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-zinc-300 text-sm md:text-base">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Cookies */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-lg w-fit">
              <Cookie className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. Cookies and Authentication tokens</h2>
          </div>

          <div className="md:ml-12 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-800/30">
             <p className="text-gray-800 dark:text-zinc-200 mb-6 text-sm md:text-base">
                To keep our platform secure and user-friendly, we use <strong className="text-gray-900 dark:text-white">HttpOnly Cookies</strong> to store your Access and Refresh tokens.
             </p>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-emerald-700 dark:text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-zinc-300">
                    These cookies are strictly necessary for managing user sessions and preventing unauthorized access.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-zinc-300">
                    They cannot be accessed via client-side scripts, ensuring protection against XSS attacks.
                  </p>
                </div>
             </div>
          </div>
        </div>

        {/* 4. Data Protection and Security */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-lg w-fit">
              <Shield className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. Data Protection and Security</h2>
          </div>

          <div className="md:ml-12 bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
             <div className="flex-1">
                <h3 className="text-emerald-700 dark:text-emerald-400 font-bold mb-3">Industry Standard Encryption</h3>
                <p className="text-gray-700 dark:text-zinc-300 text-sm leading-relaxed mb-6">
                  All user passwords are encrypted and hashed in our database using industry-standard hashing algorithms before saving. This ensures that even in the unlikely event of data access, your credentials remain unreadable.
                </p>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-zinc-400">
                   <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                   We do not sell, trade, or share your personal data with third-party companies.
                </div>
             </div>
             
             {/* Badge/Seal illustration replacing the image */}
             <div className="w-32 h-32 shrink-0 bg-white dark:bg-zinc-900 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-emerald-50 dark:border-emerald-950">
               <ShieldCheck className="w-12 h-12 text-emerald-500 mb-2" />
               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center leading-tight">Privacy<br/>Policy</span>
             </div>
          </div>
        </div>

        {/* Footer Contact Box */}
        <div className="mt-20 bg-[#2b302a] dark:bg-zinc-900 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl">
           <h2 className="text-2xl md:text-3xl font-bold mb-4">Have questions about our policy?</h2>
           <p className="text-gray-300 mb-8 max-w-xl mx-auto text-sm md:text-base">
             Our privacy team is here to help you understand how your data is used and protected. Feel free to reach out at any time.
           </p>
           <Link href="/contact-us">
             <button className="bg-emerald-700 hover:bg-emerald-600 transition-colors text-white font-bold py-3 px-8 rounded-lg shadow-sm">
               Contact Privacy Team
             </button>
           </Link>
        </div>

      </Container>
    </section>
  );
};

export default PrivacyPolicyPage;