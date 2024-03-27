import Image from "next/image";

import { auth } from "@clerk/nextjs";

import ProfileLink from "@/components/shared/ProfileLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getUserById, getUserInfo } from "@/lib/actions/user.action";
import { getFormattedJoinedDate } from "@/lib/utils";

import ListingsTab from "@/components/shared/ListingsTab";
import ReviewsTab from "@/components/shared/ReviewsTab";
import type { URLProps } from "@/types";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: Omit<URLProps, "searchParams">): Promise<Metadata> {
  const user = await getUserById({ userId: params.id });

  return {
    title: `${user.username}'s profile — Parkade`,
  };
}

const Page = async ({ params, searchParams }: URLProps) => {
  const { userId: clerkId } = auth();
  const userInfo = await getUserInfo({ userId: params.id });

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={userInfo?.user.picture}
            alt="profile picture"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {userInfo.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{userInfo.user.username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={getFormattedJoinedDate(userInfo.user.joinedAt)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="listings" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] w-auto p-1">
            <TabsTrigger value="listings" className="tab">
              Listings
            </TabsTrigger>
            <TabsTrigger value="reviews" className="tab">
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="Listings"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <ListingsTab
              searchParams={searchParams}
              userId={userInfo.user._id}
              clerkId={clerkId}
            />
          </TabsContent>
          <TabsContent value="reviews" className="flex w-full flex-col gap-6">
            <ReviewsTab
              searchParams={searchParams}
              userId={userInfo.user._id}
              clerkId={clerkId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;
