import { ISubHistory } from "@/pages/users/SubscriptionHistory";
import { formatDate } from "@/utils/DateAndTimeFormatter";

const SubHistoryTable = ({ data }: { data?: ISubHistory[] }) => {
  return (
    <div className="bg-white shadow-xl  rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-base text-left text-black ">
          <thead className="bg-black text-white uppercase text-sm tracking-widest">
            <tr>
              <th className="py-5 px-8 whitespace-nowrap">Taken At</th>
              <th className="py-5 px-8 whitespace-nowrap">Expires At</th>
              <th className="py-5 px-8 whitespace-nowrap">Type</th>
              <th className="py-5 px-8 whitespace-nowrap">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    item.expiresAt > Date.now() && "bg-green-100"
                  } border-gray-200 hover:bg-gray-100 transition-all`}
                >
                  <td className="py-5 px-8 whitespace-nowrap font-medium">
                    {formatDate(item.takenAt)}
                  </td>
                  <td className="py-5 px-8 whitespace-nowrap font-medium">
                    {formatDate(item.expiresAt)}
                  </td>
                  <td className="py-5 px-8 whitespace-nowrap font-semibold capitalize">
                    {item.type}
                  </td>
                  <td className="py-5 px-8 whitespace-nowrap font-bold text-black">
                    ₹{item.amount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 px-8 text-gray-500 italic"
                >
                  No subscription history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubHistoryTable;
