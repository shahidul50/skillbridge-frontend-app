import { AppSidebar } from "@/components/layout/dashboard/Sidebar";
import { Header } from "@/components/layout/dashboard/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Roles } from "@/constants/roles";
import { userService } from "@/services/user.service";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  admin,
  student,
  tutor,
}: {
  admin: React.ReactNode;
  student: React.ReactNode;
  tutor: React.ReactNode;
}) {

  const { data } = await userService.getUserSession()
  const userInfo = data?.user
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={userInfo} />
        <div className="flex flex-1 flex-col h-screen overflow-y-auto">
          <Header />
          <main className="flex-1 p-4 md:p-8 space-y-8 bg-background">
            {userInfo?.role === Roles.admin && admin}
            {userInfo?.role === Roles.student && student}
            {userInfo?.role === Roles.tutor && tutor}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
