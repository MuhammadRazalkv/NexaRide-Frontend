import { getDashBoardInfo, getFares, updateFare } from "@/api/auth/admin";
import AdminNavBar from "../../components/admin/AdminNavbar";
import { useEffect, useState } from "react";
import { message } from "antd";
import { FaUsers, FaCrown } from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";
import { FaMapLocationDot } from "react-icons/fa6";
import InfoCard from "@/components/admin/InfoCard";
import { PieChartComp } from "@/components/ui/PieChar";
import { LineChart } from "@/components/ui/LineChart";
interface IFare {
  basic: number;
  premium: number;
  luxury: number;
}

type FareType = "basic" | "premium" | "luxury"; // Enforced stricter typing

const AdminDashBoard = () => {
  const [fare, setFare] = useState<IFare>({
    basic: 20,
    premium: 20,
    luxury: 20,
  });
  const [data, setData] = useState<{
    users: number;
    drivers: number;
    completedRides: number;
    premiumUsers: number;
    monthlyCommissions: { month: string; totalCommission: number }[];
  }>();
  const [isLoading, setIsLoading] = useState<boolean>(false); // For submit button loading state
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  useEffect(() => {
    const fetchFares = async () => {
      try {
        const res = await getFares();
        console.log(res);

        if (res.success && res.fares) {
          setFare(res.fares);
        } else {
          setFare({ basic: 20, premium: 20, luxury: 20 });
        }
      } catch (error) {
        if (error instanceof Error) message.error(error.message);
      }
    };

    const fetchInfos = async () => {
      try {
        const res = await getDashBoardInfo();
        if (res.success && res.data) {
          console.log(res.data);

          setData(res.data);
        }
      } catch (error) {
        if (error instanceof Error) message.error(error.message);
      }
    };
    fetchInfos();
    fetchFares();
  }, []);

  const handleFareChange = (type: FareType, value: number) => {
    const newValue = Math.max(value, 20); // Ensures value is > 20
    setFare((prevFare) => ({ ...prevFare, [type]: newValue }));
  };

  const handleSubmit = async () => {
    console.log("Updated Fares:", fare);
    setIsLoading(true);

    messageApi.open({
      key,
      type: "loading",
      content: "Updating fare",
    });

    try {
      const res = await updateFare(fare);
      if (res?.success) {
        setFare(res.fares);
        messageApi.open({
          key,
          type: "success",
          content: "Fare updated successfully",
        });
      } else {
        throw new Error("Unexpected API response format.");
      }
    } catch (error) {
      console.error(error);
      messageApi.open({
        key,
        type: "error",
        content: "Failed to update fare info",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0E1220] min-h-screen p-4 text-white">
      <AdminNavBar />
      {contextHolder}

      <h1 className="text-5xl text-center font-primary">DashBoard </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 p-2">
        {/* Info Card */}
        <InfoCard
          icon={<FaUsers size={28} />}
          label="Total Users"
          value={data?.users}
        />
        <InfoCard
          icon={<GiSteeringWheel size={28} />}
          label="Total Drivers"
          value={data?.drivers}
        />
        <InfoCard
          icon={<FaMapLocationDot size={28} />}
          label="Completed Rides"
          value={data?.completedRides}
        />
        <InfoCard
          icon={<FaCrown size={28} />}
          label="Premium Users"
          value={data?.premiumUsers}
        />
      </div>

      {/* Fare Management */}
      <div className="  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <PieChartComp
          totalUsers={data?.users || 0}
          premiumUsers={data?.premiumUsers || 0}
        />
        <LineChart chartData={data?.monthlyCommissions || []} />
        <div className="w-xs bg-[#1A2036] rounded-2xl shadow-md p-6 mx-auto">
          <h2 className="text-2xl text-center mb-4">Fare Info</h2>
          <div className="space-y-4">
            {["basic", "premium", "luxury"].map((type) => (
              <div key={type} className="flex items-center justify-between">
                <p className="capitalize">{type}</p>
                <input
                  type="number"
                  value={fare[type as keyof typeof fare] || 0}
                  onChange={(e) =>
                    handleFareChange(type as FareType, Number(e.target.value))
                  }
                  className="bg-[#0E1220] border border-gray-500 rounded-md px-4 py-2 w-24 text-center"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full mt-6 py-2 px-4 font-bold rounded-md ${
              isLoading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Updating..." : "Update Fare"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
