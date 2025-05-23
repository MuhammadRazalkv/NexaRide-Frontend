import { getFeedBackSummary, getRideSummary, getTransactionSummary } from "@/api/auth/user";
import DashBoardCards from "@/components/DashBoardCards";
import NavBar from "@/components/user/NavBar";
import { message } from "antd";
import { useEffect, useState } from "react";

const DashBoard = () => {
    const [messageApi, contextHolder] = message.useMessage();

  const [rideSummary, setRideSummary] = useState<{
    totalRides: number;
    completedRides: number;
    cancelledRides: number;
  }>();
  const [transactionSummary, setTransactionSummary] = useState<{
    totalTransaction: number;
    usingWallet: number;
    usingStripe: number;
  }>();
  const [feedBackSummary, setFeedBackSummary] = useState<{
    avgRating: number;
    totalRatings: number;
  }>();
  useEffect(() => {
    async function fetchInfo() {
      try {
        const rideInfos = await getRideSummary();
        const paymentInfo = await getTransactionSummary();
        const feedBackInfo = await getFeedBackSummary()
        if (rideInfos.success && rideInfos.data) {
          setRideSummary(rideInfos.data);
        }
        if (paymentInfo.success && paymentInfo.data) {
          setTransactionSummary(paymentInfo.data);
        }
        if (feedBackInfo.success && feedBackInfo.data) {
          setFeedBackSummary(feedBackInfo.data)
        }
      } catch (error) {
        if (error instanceof Error) messageApi.error(error.message);
      }
    }
    fetchInfo();
  }, [messageApi]);
  return (
    <>
      <NavBar />
      {contextHolder}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
        <DashBoardCards title="Ride" info={rideSummary} />
        <DashBoardCards title="Transactions" info={transactionSummary} />
        <DashBoardCards title="Feedbacks" info={feedBackSummary} />
      </div>
    </>
  );
};

export default DashBoard;
