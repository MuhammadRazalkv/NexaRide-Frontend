import { getFares, updateFare } from "@/api/auth/admin";
import AdminNavBar from "../../components/admin/AdminNavbar";
import { useEffect, useState } from "react";
import { message } from "antd";

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
        console.error(error);
      }
    };
    fetchFares();
  }, []);

  const handleFareChange = (type: FareType, value: number) => {
    const newValue = Math.max(value, 20); // Ensures value is ≥ 20
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
    <div className="bg-[#0E1220] min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      <AdminNavBar />
      {contextHolder}
      <h1 className="font-primary text-5xl text-white">Dashboard</h1>

      <div className="w-full max-w-md bg-[#1A2036] rounded-2xl shadow-lg p-6 text-white">
        <h1 className="text-2xl text-center mb-4">Fare Info</h1>

        <div className="space-y-4">
          {["basic", "premium", "luxury"].map((type) => (
            <div key={type} className="flex items-center justify-between">
              <p className="text-md capitalize">{type}</p>
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
          className={`w-full ${
            isLoading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white font-bold py-2 px-4 rounded-md mt-6`}
        >
          {isLoading ? "Updating..." : "Update Fare"}
        </button>
      </div>
    </div>
  );
};

export default AdminDashBoard;
