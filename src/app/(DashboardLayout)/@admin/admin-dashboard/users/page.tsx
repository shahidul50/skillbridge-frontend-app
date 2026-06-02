import { getAllPlatformUserAction } from "@/actions/admin.action";
import UserModule from "@/components/modules/dashboard/admin/UserModule";
import { TUserParams, TUserResponse } from "@/types/admin.type";

export const metadata = {
  title: "User Management | SkillBridge Admin",
  description: "Manage and oversee all platform users including students and tutors.",
};

interface IProps {
  searchParams: Promise<TUserParams>;
}

const UserManagementPage = async ({ searchParams }: IProps) => {
  const query = await searchParams;
  
  // Clean up params for the action
  const filterParams: TUserParams = {
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Number(query.limit) : 10,
    searchTerm: query.searchTerm || "",
    role: query.role && query.role !== "all" ? query.role : undefined,
    isActive: query.isActive !== undefined ? (String(query.isActive) === "true") : undefined,
  };

  const res = await getAllPlatformUserAction(filterParams);
  const data = res?.data as TUserResponse;

  return (
    <div className="flex-1 w-full p-4 md:p-8">
      <UserModule 
        initialData={data?.data || []} 
        initialMeta={data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }}
      />
    </div>
  );
};

export default UserManagementPage;
