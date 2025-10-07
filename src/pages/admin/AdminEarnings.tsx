import AdminNavBar from "@/components/admin/AdminNavbar";
import { useEffect, useState } from "react";
import { message, Pagination } from "antd";
import { getRideEarnings } from "@/api/auth/admin";
import { ICommission } from "@/interfaces/commission.interface";
import EarningsTable from "@/components/admin/EarningsTable";
import { RiUserFill } from "react-icons/ri";

const AdminEarnings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [commissions, setCommissions] = useState<ICommission[]>();
  const [messageApi, contextHolder] = message.useMessage();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await getRideEarnings(currentPage, debouncedSearch);
        console.log(res);
        if (res.success) {
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
  }, [messageApi, currentPage, debouncedSearch]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setSearch(value);
  };
  return (
    <div className="bg-[#0E1220] min-h-screen text-white">
      <AdminNavBar />
      {contextHolder}
      <div className="flex h-screen flex-col justify-center items-center gap-5 p-5">
        <div className="flex items-center bg-[#1E293B] px-2 p-0.5 rounded-2xl">
          <RiUserFill className="text-white" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search ..."
            className="bg-[#1E293B] text-white rounded-md px-4 py-1.5 text-sm w-full sm:w-64 outline-none"
          />
        </div>
        <div className="bg-[#1A2036] rounded-xl shadow-lg w-full max-w-7xl p-6">
          <h3 className="text-2xl font-semibold mb-6 text-center lg:text-left">
            Ride Earnings:{" "}
            <span className="text-green-400">{totalEarnings}</span>
          </h3>

          <EarningsTable commissions={commissions} />
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
