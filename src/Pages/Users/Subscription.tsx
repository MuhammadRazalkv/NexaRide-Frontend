import NavBar from "@/components/user/NavBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { message } from "antd";
import { checkSubscriptionStatus, subscribeToPlus } from "@/api/auth/user";
import WaitingModal from "@/components/user/WaitingModal";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/DateAndTimeFormatter";
import { Link } from "react-router-dom";

const Subscription = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedInfo, setSubscribedInfo] = useState<{
    isSubscribed: boolean;
    expiresAt: number;
    type: string;
  }>();
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await checkSubscriptionStatus();
        if (res.success && res.result) {
          setIsSubscribed(res.result.isSubscribed);
          setSubscribedInfo(res.result);
          console.log(res.result);
        }
      } catch (error) {
        if (error instanceof Error) message.error(error.message);
      }
    };
    fetchStatus();
  }, []);
  const handleClick = async (type: "yearly" | "monthly") => {
    try {
      setLoading(true);
      const res = await subscribeToPlus(type);
      if (res.success && res.url) {
        setLoading(false);
        window.location.href = res.url;
      }
    } catch (error) {
      setLoading(false);

      if (error instanceof Error) messageApi.error(error.message);
    }
  };

  return (
    <>
      <NavBar />
      {contextHolder}
      <WaitingModal open={loading} message="Redirecting" />

      <div className="container mx-auto py-3 px-4">
        <div className="flex justify-evenly items-start">
          <div className="ml-">
            <h2 className="text-center text-3xl font-bold text-gray-800 mb-2">
              Nexa Plus Subscription
            </h2>
            <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
              Join Nexa Plus and enjoy priority rides, discounts, and premium
              support every month.
            </p>
          </div>
          <div className="flex justify-end p-2">
            <button className="bg-black text-white hover:shadow-2xl p-2 text-sm px-5 rounded-xl ">
              <Link to={"/user/subscription-history"}>History</Link>
            </button>
          </div>
        </div>
        <div className="container flex items-center justify-center  px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8  max-w-4xl">
            {/* Monthly Plan */}
            <Card
              className={`rounded-2xl border shadow-lg transition duration-300 bg-white ${
                isSubscribed && subscribedInfo?.type === "monthly"
                  ? "border-green-500"
                  : "hover:shadow-2xl"
              }`}
            >
              <CardHeader className="text-center pt-6">
                {isSubscribed && subscribedInfo?.type === "monthly" && (
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Current Plan
                  </span>
                )}
                <CardTitle className="text-3xl font-bold text-black">
                  Nexa Plus
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Monthly Plan – Perfect for short-term savings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center my-6">
                  <span className="text-5xl font-extrabold text-black">
                    ₹149
                  </span>
                  <span className="text-sm text-gray-500"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 px-6">
                  <li>✓ 30% off the NexaRide app fee on all your rides</li>
                  <li>✓ Priority driver matching</li>
                  <li>✓ Early access to features</li>
                  <li>✓ Exclusive customer support</li>
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center mt-6 mb-4">
                {(!isSubscribed || subscribedInfo?.type === "monthly") && (
                  <button
                    disabled={
                      isSubscribed && subscribedInfo?.type === "monthly"
                    }
                    className={`px-8 py-2 font-semibold rounded-md transition ${
                      isSubscribed && subscribedInfo?.type === "monthly"
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-900 hover:scale-105"
                    }`}
                    onClick={() => handleClick("monthly")}
                  >
                    {isSubscribed && subscribedInfo?.type === "monthly"
                      ? `Expires at ${formatDate(subscribedInfo.expiresAt)}`
                      : "Subscribe Monthly"}
                  </button>
                )}
              </CardFooter>
            </Card>

            {/* Yearly Plan */}
            <Card
              className={`rounded-2xl border shadow-xl transition duration-300 bg-gradient-to-br from-yellow-50 to-white ${
                isSubscribed && subscribedInfo?.type === "yearly"
                  ? "border-green-500"
                  : "hover:shadow-2xl"
              }`}
            >
              <CardHeader className="text-center pt-6 relative">
                {isSubscribed && subscribedInfo?.type === "yearly" ? (
                  <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Current Plan
                  </span>
                ) : (
                  <span className="absolute top-2 right-2 bg-yellow-300 text-xs font-semibold text-black px-3 py-1 rounded-full">
                    Best Value
                  </span>
                )}
                <CardTitle className="text-3xl font-bold text-black">
                  Nexa Plus
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Yearly Plan - Save more long-term
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center my-6">
                  <span className="text-5xl font-extrabold text-black">
                    ₹1,499
                  </span>
                  <span className="text-sm text-gray-500"> / year</span>
                  <p className="text-xs text-green-600 mt-1">
                    Save ₹289 vs monthly
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 px-6">
                  <li>✓ 30% off the NexaRide app fee on all your rides</li>
                  <li>✓ Priority driver matching</li>
                  <li>✓ Early access to features</li>
                  <li>✓ Exclusive customer support</li>
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center mt-6 mb-4">
                {(!isSubscribed || subscribedInfo?.type == "yearly") && (
                  <button
                    disabled={isSubscribed && subscribedInfo?.type === "yearly"}
                    className={`px-8 py-2 font-semibold rounded-md transition ${
                      isSubscribed
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-yellow-400 text-black hover:bg-yellow-500 hover:scale-105"
                    }`}
                    onClick={() => handleClick("yearly")}
                  >
                    {isSubscribed && subscribedInfo?.type == "yearly"
                      ? `Expires at ${formatDate(subscribedInfo.expiresAt)}`
                      : "Subscribe Yearly"}
                  </button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscription;
