import { getPremiumUsers } from "@/api/auth/admin";
import AdminNavBar from "@/components/admin/AdminNavbar";
import SearchSort from "@/components/SearchSort";
import { IPremiumUsers } from "@/interfaces/user.interface";
import { formatDate } from "@/utils/DateAndTimeFormatter";
import { message, Pagination } from "antd";
import { useEffect, useState } from "react";

const SubscribedUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [premiumUsers, setPremiumUsers] = useState<IPremiumUsers[]>();
  const [filter, setFilter] = useState<"All" | "Active" | "InActive">("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"A-Z" | "Z-A">("A-Z");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await getPremiumUsers(
          currentPage,
          filter,
          debouncedSearch,
          sort
        );

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
  }, [currentPage, filter, debouncedSearch, sort]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setSearch(value);
  };
  const changeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as "A-Z" | "Z-A");
  };
  return (
    <div className="bg-[#0E1220] min-h-screen text-white flex flex-col">
      <AdminNavBar />

      <main className="flex flex-col flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-center mb-8 gap-6">
          <div>
            <h3 className="text-3xl font-bold mb-2 lg:mb-0">
              Premium Subscriptions
            </h3>
          </div>
        </div>

        {/* ===== Search and Sort Section ===== */}
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <label htmlFor="filter" className="text-white font-medium">
              Filter by:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "All" | "Active" | "InActive")
              }
              className="bg-[#1E293B] text-white border border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="InActive">Expired</option>
            </select>
          </div>
          <SearchSort
            handleSearchChange={handleSearchChange}
            search={search}
            setSort={changeSort}
            sort={sort}
          />
        </div>

        {/* ===== Table Section ===== */}
        <section className="bg-[#1A2036] rounded-2xl shadow-lg w-full max-w-7xl mx-auto p-6 border border-gray-700">
          <h4 className="text-xl font-semibold">
            Total Earnings:{" "}
            <span className="text-green-400 font-bold">₹{totalEarnings}</span>
          </h4>
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#2A3441] border-b border-gray-700 text-gray-300 uppercase text-xs sm:text-sm">
                  <th className="px-4 py-3 text-left tracking-wider">User</th>
                  <th className="px-4 py-3 text-left tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left tracking-wider">
                    Taken At
                  </th>
                  <th className="px-4 py-3 text-left tracking-wider">
                    Expires At
                  </th>
                  <th className="px-4 py-3 text-left tracking-wider">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {premiumUsers?.length ? (
                  premiumUsers.map((item) => (
                    <tr
                      key={item.expiresAt + item.takenAt}
                      className="hover:bg-[#242B3D] transition-colors duration-200"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-white">
                        {item.user}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300 capitalize">
                        {item.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {formatDate(item.takenAt)}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm font-medium ${
                          item.expiresAt < Date.now()
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {formatDate(item.expiresAt)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-blue-400">
                        ₹{item.amount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-gray-400 text-lg"
                    >
                      No Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== Pagination ===== */}
        <div className="flex justify-center mt-8">
          <Pagination
            current={currentPage}
            total={total}
            pageSize={5}
            align="center"
            onChange={(page) => setCurrentPage(page)}
            className="pagination-dark"
          />
        </div>
      </main>
    </div>
  );
};

export default SubscribedUsers;
