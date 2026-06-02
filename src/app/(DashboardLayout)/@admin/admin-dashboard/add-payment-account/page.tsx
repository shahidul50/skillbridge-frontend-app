import { getAllPaymentAccountForAdminDashboardAction } from "@/actions/payment.action";
import PaymentAccountModule from "@/components/modules/dashboard/admin/PaymentAccountModule";
import { TPaymentAccountParams } from "@/types/admin.type";

interface PageProps {
  searchParams: Promise<TPaymentAccountParams>;
}

export default async function AddPaymentAccountPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data: accounts } = await getAllPaymentAccountForAdminDashboardAction(params);

  return (
    <PaymentAccountModule 
        accounts={accounts || { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } }} 
        searchParams={params} 
    />
  );
}
