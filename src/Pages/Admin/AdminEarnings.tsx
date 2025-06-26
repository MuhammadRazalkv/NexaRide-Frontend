import AdminNavBar from "@/components/admin/AdminNavbar";
import { useEffect, useState } from "react";
import { message, Pagination } from "antd";
import { getRideEarnings } from "@/api/auth/admin";
interface ICommission {
  rideId: string;
  driverId: string;
  originalFare: number;
  totalFare: number;
  offerDiscount: number;
  premiumDiscount: number;
  originalCommission: number;
  commission: number;
  driverEarnings: number;
  paymentMethod: string;
}

const AdminEarnings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [commissions, setCommissions] = useState<ICommission[]>();
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await getRideEarnings(currentPage);
        console.log(res);

        if (res.success && res.commissions && res.totalCount) {
          setCommissions(res.commissions);
          setTotal(res.totalCount);
        }
        if (res.totalEarnings) {
          setTotalEarnings(res.totalEarnings);
        }
      } catch (error) {
        if (error instanceof Error) messageApi.error(error.message);
        else messageApi.error("Failed to fetch info");
      }
    };
    fetchInfo();
  }, [messageApi, currentPage]);
  return (
    <div className="bg-[#0E1220] min-h-screen text-white">
      <AdminNavBar />
      {contextHolder}
      <div className="flex h-screen flex-col justify-center items-center gap-5 p-5">
        <div className="bg-[#1A2036] rounded-xl shadow-lg w-full max-w-7xl p-6">
          <h3 className="text-2xl font-semibold mb-6 text-center lg:text-left">
            Ride Earnings:{" "}
            <span className="text-green-400">{totalEarnings}</span>
          </h3>

          {/* Desktop Table */}
          <div className=" overflow-x-auto">
            <table className="w-full table-auto border-collapse ">
              <thead>
                <tr className="bg-[#2A3441] border-b border-gray-600">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Ride ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Original Fare
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Og Commission
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Offer Discount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Premium Discount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Driver Share
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {commissions?.length ? (
                  commissions.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-[#242B3D] transition-colors duration-200"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-white">
                        #{item.rideId.slice(-3)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-300">
                        ₹{item.originalFare}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-300">
                        ₹{item.originalCommission}
                      </td>
                      <td className="px-4 py-4 text-sm text-red-400">
                        -₹{item.offerDiscount}
                      </td>
                      <td className="px-4 py-4 text-sm text-red-400">
                        -₹{item.premiumDiscount}
                      </td>
                      <td className="px-4 py-4 text-sm text-blue-400 font-medium">
                        ₹{item.commission}
                      </td>
                      <td className="px-4 py-4 text-sm text-green-400 font-medium">
                        ₹{item.driverEarnings}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-gray-400 text-lg"
                    >
                      No Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination
          current={currentPage}
          total={total}
          pageSize={5}
          align="center"
          onChange={(page) => setCurrentPage(page)}
          className="pagination-dark"
        />
      </div>
    </div>
  );
};

export default AdminEarnings;
