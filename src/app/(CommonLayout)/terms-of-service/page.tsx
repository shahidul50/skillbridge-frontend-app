import { Container } from "@/components/layout/Container";
import { 
  ShieldCheck, Users, CreditCard, MessageSquare, 
  AlertTriangle, UserX, History, Calendar
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | SkillBridge",
  description: "Read the Terms of Service for using SkillBridge. Understand your rights, responsibilities, and our community guidelines.",
};

const termsData = [
  {
    id: 1,
    title: "Account Creation and Security",
    icon: ShieldCheck,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    content: "Users must provide accurate, current, and complete information during the registration process. You are solely responsible for maintaining the confidentiality of your account credentials and password at all times. Any unauthorized use of your account must be reported to our support team immediately."
  },
  {
    id: 2,
    title: "Platform Usage and Conduct",
    icon: Users,
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    content: "Our platform connects Students and Tutors. Students may browse and book educational sessions, while Tutors are responsible for creating accurate, professional profiles. Users agree not to engage in unlawful activities, harassment, or spamming. SkillBridge reserves the right to monitor interactions to ensure community standards are upheld."
  },
  {
    id: 3,
    title: "Session Booking and Payments",
    icon: CreditCard,
    iconBg: "bg-orange-100 dark:bg-orange-900/50",
    iconColor: "text-orange-600 dark:text-orange-400",
    content: "All sessions must be booked through the official SkillBridge scheduling system. Payments are processed securely via our integrated gateways. Please refer to our official guidelines for specific cancellation and refund policies. Unauthorized off-platform payments are strictly prohibited and may result in account suspension."
  },
  {
    id: 4,
    title: "Reviews and Feedback System",
    icon: MessageSquare,
    iconBg: "bg-teal-100 dark:bg-teal-900/50",
    iconColor: "text-teal-600 dark:text-teal-400",
    content: "We value transparency. Users are encouraged to provide honest and respectful reviews based on their actual experience. SkillBridge reserves the right to remove any content deemed offensive, fraudulent, or violating our community guidelines without prior notice.",
    isAfterBanner: true
  },
  {
    id: 5,
    title: "Limitation of Liability",
    icon: AlertTriangle,
    iconBg: "bg-red-100 dark:bg-red-900/50",
    iconColor: "text-red-600 dark:text-red-400",
    content: "SkillBridge is a marketplace platform and does not provide a guarantee on the quality of individual teaching or learning outcomes. To the maximum extent permitted by law, SkillBridge shall not be liable for any incidental, indirect, or consequential damages arising from your use of the platform."
  },
  {
    id: 6,
    title: "Termination of Service",
    icon: UserX,
    iconBg: "bg-zinc-200 dark:bg-zinc-800",
    iconColor: "text-zinc-600 dark:text-zinc-400",
    content: "We reserve the right to suspend or terminate access to our services at our sole discretion, without notice, for any conduct that we believe violates these Terms of Service or is harmful to other users, our business, or third parties."
  },
  {
    id: 7,
    title: "Changes to Terms",
    icon: History,
    iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    content: "SkillBridge reserves the right to modify these terms at any time. Changes will be effective immediately upon posting to the platform. We will notify users of significant changes by updating the \"Effective Date\" at the top of this page. Your continued use of the platform constitutes acceptance of the updated terms."
  }
];

export default function TermsOfServicePage() {
  const preBannerTerms = termsData.filter((t) => !t.isAfterBanner && t.id <= 3);
  const postBannerTerms = termsData.filter((t) => t.id > 3);

  return (
    <section className="bg-[#fcfdfc] dark:bg-zinc-950 min-h-screen py-12 md:py-20 transition-colors duration-300">
      <Container className="max-w-4xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400 mb-8 font-medium">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-zinc-200">Terms of Service</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl md:leading-[1.1] font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Terms of Service
          </h1>
          <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400 text-sm font-medium">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
            Effective Date: July 2026
          </div>
        </div>

        {/* Welcome Box */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-6 md:p-8 mb-12">
          <p className="text-gray-700 dark:text-zinc-300 text-base md:text-lg leading-relaxed">
            Welcome to <strong className="text-gray-900 dark:text-white font-bold">SkillBridge!</strong> By accessing or using our platform, you agree to comply with and be bound by the following Terms of Service. Please read them carefully before using our services.
          </p>
        </div>

        {/* Pre-Banner Terms Cards */}
        <div className="space-y-6 md:space-y-8 mb-12">
          {preBannerTerms.map((term) => (
            <div 
              key={term.id} 
              className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04),0_10px_20px_-2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-5 md:gap-6 items-start"
            >
              <div className={`p-4 rounded-xl shrink-0 ${term.iconBg}`}>
                <term.icon className={`w-6 h-6 md:w-7 md:h-7 ${term.iconColor}`} />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {term.id}. {term.title}
                </h3>
                <p className="text-gray-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
                  {term.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Banner Image */}
        <div className="relative w-full h-[240px] md:h-[320px] rounded-3xl overflow-hidden mb-12 shadow-md">
          {/* We'll use a dynamic gradient background representing a workspace */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')" }}></div>
          <div className="absolute inset-0 bg-emerald-900/60 dark:bg-emerald-950/70 mix-blend-multiply"></div>
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-10 text-white">
             <h2 className="text-2xl md:text-3xl font-bold mb-2 shadow-sm">Global Learning Community</h2>
             <p className="text-emerald-50 dark:text-emerald-100/80 font-medium text-sm md:text-base text-shadow-sm">Building the future of peer-to-peer education.</p>
          </div>
        </div>

        {/* Post-Banner Terms Cards */}
        <div className="space-y-6 md:space-y-8">
          {postBannerTerms.map((term) => (
            <div 
              key={term.id} 
              className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04),0_10px_20px_-2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-5 md:gap-6 items-start"
            >
              <div className={`p-4 rounded-xl shrink-0 ${term.iconBg}`}>
                <term.icon className={`w-6 h-6 md:w-7 md:h-7 ${term.iconColor}`} />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {term.id}. {term.title}
                </h3>
                <p className="text-gray-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
                  {term.content}
                </p>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
}
