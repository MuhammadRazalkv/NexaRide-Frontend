import { ICommission } from "@/interfaces/commission.interface";
import { useNavigate } from "react-router-dom";

const EarningsTable = ({ commissions }: { commissions: ICommission[] | undefined }) => {
  const navigate = useNavigate();
  return (
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
            commissions.map((item) => (
              <tr
                key={item.rideId}
                className="hover:bg-[#242B3D] transition-colors duration-200"
                onClick={() =>
                  navigate("/admin/ride-info", { state: item.rideId })
                }
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
  );
};

export default EarningsTable;
