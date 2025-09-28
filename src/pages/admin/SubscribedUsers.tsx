import { getPremiumUsers } from "@/api/auth/admin";
import AdminNavBar from "@/components/admin/AdminNavbar";
import { formatDate } from "@/utils/DateAndTimeFormatter";
import { message, Pagination } from "antd";
import { useEffect, useState } from "react";

interface IPremiumUsers {
  user: string;
  amount: number;
  expiresAt: number;
  takenAt: number;
  type: string;
}

const SubscribedUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [premiumUsers, setPremiumUsers] = useState<IPremiumUsers[]>();
  const [filter, setFilter] = useState<"All" | "Active" | "InActive">("All");
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await getPremiumUsers(currentPage, filter);

        if (res.success && res.premiumUsers) {
          setPremiumUsers(res.premiumUsers);
        }
        if (res.total) {
          setTotal(res.total);
        }
        if (res.totalEarnings) {
          setTotalEarnings(res.totalEarnings);
        }
      } catch (error) {
        if (error instanceof Error) message.error(error.message);
      }
    };
    fetchInfo();
  }, [currentPage, filter]);
  return (
    <div className="bg-[#0E1220] min-h-screen text-white">
      <AdminNavBar />
      <div className="flex h-screen flex-col justify-center items-center gap-5 p-5">
        <div className="bg-[#1A2036] rounded-xl shadow-lg w-full max-w-7xl p-6">
          <div className="flex justify-between">
            <h3 className="text-2xl font-semibold mb-6 text-center lg:text-left">
              Premium Earnings:{" "}
              <span className="text-green-400">{totalEarnings}</span>
            </h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label htmlFor="sort" className="text-white font-medium">
                Filter by:
              </label>
              <select
                id="sort"
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as "All" | "Active" | "InActive")
                }
                className="bg-[#1E293B] text-white border border-gray-600 rounded-md px-4 py-1 outline-none"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="InActive">Expired</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className=" overflow-x-auto">
            <table className="w-full table-auto border-collapse ">
              <thead>
                <tr className="bg-[#2A3441] border-b border-gray-600">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Taken At
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Exp At
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {premiumUsers?.length ? (
                  premiumUsers.map((item) => (
                    <tr
                      key={item.expiresAt + item.takenAt}
                      className="hover:bg-[#242B3D] transition-colors duration-200"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-white">
                        {item.user}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-300">
                        {item.type}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-300">
                        {formatDate(item.takenAt)}
                      </td>
                      <td
                        className={`px-4 py-4 text-sm ${
                          item.expiresAt < Date.now()
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {formatDate(item.expiresAt)}
                      </td>

                      <td className="px-4 py-4 text-sm  font-medium">
                        ₹{item.amount}
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

export default SubscribedUsers;
