import { getEarningsSummary, getFeedBackSummary, getRideSummary } from "@/api/auth/driver";
import DashBoardCards from "@/components/DashBoardCards";
import DNavBar from "@/components/driver/DNavBar";
import { message } from "antd";
import { useEffect, useState } from "react";

const DDashboard = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [earings, setEarnings] = useState<{
    totalEarnings: number;
    Today: number;
    Week: number;
    Month: number;
  }>();
  const [feedBackSummary, setFeedBackSummary] = useState<{
    avgRating: number;
    totalRatings: number;
  }>();
  const [rideSummary, setRideSummary] = useState<{
    totalRides: number;
    completedRides: number;
    cancelledRides: number;
  }>();
  useEffect(() => {
    const fetchInfos = async () => {
      try {
        const earningsInfo = await getEarningsSummary();
        const rideInfos = await getRideSummary()
        const feedBackInfo = await getFeedBackSummary()
        if (earningsInfo.success && earningsInfo.data) {
          setEarnings(earningsInfo.data);
        }
        if (rideInfos.success && rideInfos.data) {
          setRideSummary(rideInfos.data);
        }
        if (feedBackInfo.success && feedBackInfo.data) {
          setFeedBackSummary(feedBackInfo.data);
        }

      } catch (error) {
        if (error instanceof Error) messageApi.error(error.message);
      }
    };
    fetchInfos();
  }, [messageApi]);
  return (
    <>
      <DNavBar />
      {contextHolder}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
        <DashBoardCards title="Earnings " info={earings} />
        <DashBoardCards title="Rides "  info={rideSummary}/>
        <DashBoardCards title="FeedBacks " info={feedBackSummary} />
      </div>
    </>
  );
};

export default DDashboard;
