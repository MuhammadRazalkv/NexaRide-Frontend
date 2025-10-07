import { adminRideHistory } from "@/api/auth/admin";
import AdminNavBar from "@/components/admin/AdminNavbar";
import RideHistoryTable from "@/components/RideHistoryTable";
import { IRideHistoryItem } from "@/interfaces/fullRideInfo.interface";
import { message, Pagination } from "antd";
import { useEffect, useState } from "react";
import { RiUserSearchFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const AdminRides = () => {
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<"new" | "old">("new");
  const [filterBy, setFilterBy] = useState<
    "all" | "ongoing" | "canceled" | "completed"
  >("all");
  const [rideHistory, setRideHistory] = useState<IRideHistoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setSearch(value);
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchHIstory = async () => {
      try {
        const res = await adminRideHistory(
          sort,
          filterBy,
          debouncedSearch,
          currentPage
        );
        if (res.success && res.history && res.total) {
          setTotal(res.total);
          setRideHistory(res.history);
        } else {
          setTotal(0);
          setRideHistory([]);
        }
      } catch (error) {
        if (error instanceof Error) message.error(error.message);
        else message.error("Failed to fetch ride history");
      }
    };

    fetchHIstory();
  }, [currentPage, sort, filterBy, debouncedSearch]);
  const handleNavigation = (id: string) => {
    console.log("handleNavigation", id);

    navigate("/admin/ride-info", { state: id });
  };
  return (
    <div className="bg-[#0E1220] min-h-screen p-10 md:p-20  ">
      <AdminNavBar />
      <div className="px-2 md:px-10 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row  justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto text-white">
            <label htmlFor="sort" className="font-medium">
              Sort by date:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as "new" | "old")}
              className="border border-amber-100 rounded-md px-4 py-1 outline-none bg-[#0E1220]"
            >
              <option value="new">Newest First </option>
              <option value="old">Oldest First</option>
            </select>
          </div>
          
          <div className="flex items-center bg-[#1E293B] px-2 p-0.5 rounded-2xl">
            <RiUserSearchFill className="text-white" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search Pickup location..."
              className="bg-[#1E293B] text-white rounded-md px-4 py-1.5 text-sm w-full sm:w-64 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto text-white">
            <label htmlFor="filter" className="font-medium">
              Filter by :
            </label>
            <select
              id="filter"
              value={filterBy}
              onChange={(e) =>
                setFilterBy(
                  e.target.value as "all" | "ongoing" | "canceled" | "completed"
                )
              }
              className="border border-amber-100 rounded-md px-4 py-1 outline-none bg-[#0E1220]"
            >
              <option value="all">All </option>
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
              <option value="canceled">Cancelled</option>
            </select>
          </div>
        </div>
        <RideHistoryTable
          rideHistory={rideHistory}
          handleNavigation={handleNavigation}
          variant="admin"
        />
        <Pagination
          current={currentPage}
          total={total}
          pageSize={8}
          align="center"
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default AdminRides;
