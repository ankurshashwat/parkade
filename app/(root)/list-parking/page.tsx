import { auth } from "@clerk/nextjs";
import ListParking from "@/components/forms/ListParking";
import { getUserById } from "@/lib/actions/user.action";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "list your parking space",
};

const Page = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">List your parking space</h1>

      <div className="mt-9">
        <ListParking
          type="create"
          mongoUserId={mongoUser?._id}
        />
      </div>
    </div>
  );
};

export default Page;
