import UserProfileModule from "@/components/modules/dashboard/student/UserProfileModule";
import { getUserProfileByIdAction } from "@/actions/profile.action";

export default async function ProfilePage() {
    const response = await getUserProfileByIdAction();
    const profileData = response?.data;

    return <UserProfileModule initialData={profileData} />;
}
