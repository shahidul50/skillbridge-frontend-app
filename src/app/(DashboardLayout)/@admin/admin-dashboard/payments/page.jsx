import {
  getAllPaymentsForAdminDashboardAction,
  getPaymentStatsForAdminDashboardAction,
} from "@/actions/payment.action";
import PaymentModule from "@/components/modules/dashboard/admin/PaymentModule";

/**
 * Admin Payments Management Page
 * Handles fetching of payment statistics and list with filtering/pagination
 */
const AdminPaymentsPage = async ({ searchParams }) => {
  // Await searchParams as per Next.js 15+ patterns
  const params = await searchParams;

  // Fetch stats and payments in parallel for better performance
  const [statsData, paymentsData] = await Promise.all([
    getPaymentStatsForAdminDashboardAction(),
    getAllPaymentsForAdminDashboardAction(params),
  ]);

  // Handle error cases
  if (statsData.error || paymentsData.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-8">
        <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-full">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 italic">Oops! Something went wrong</h2>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-center">
          {statsData.error || paymentsData.error || "We couldn't load the payment information at this time."}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-12">
      <PaymentModule
        stats={statsData.data}
        payments={paymentsData.data}
        searchParams={params}
      />
    </div>
  );
};

export default AdminPaymentsPage;
