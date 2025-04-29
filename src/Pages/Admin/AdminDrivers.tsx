import { useEffect, useState } from "react";
import AdminNavBar from "../../components/admin/AdminNavbar";
import {
  getDrivers,
  getPendingDriverCount,
  toggleBlockUnblockDriver,
} from "../../api/auth/admin";
import { Link } from "react-router-dom";
import { message , Pagination } from "antd";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AdminTable from "@/components/admin/AdminTable";

import SearchSort from "@/components/SearchSort";
export interface IUser {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState<IUser[] | null>(null);
  const [driverInfo, setDriverInfo] = useState<IUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"A-Z" | "Z-A">("A-Z");
  const [currentPage, setCurrentPage] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const updateUserStatus = (driver: IUser) => {
    setIsDialogOpen(true);
    setDriverInfo(driver);
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);
  const fetchDrivers = async (page = 1, searchTerm = "", sortOrder = "A-Z") => {
    try {
      const res = await getDrivers(page, searchTerm, sortOrder);
      if (res.drivers && res.total) {
        setDrivers(res.drivers);
        setTotal(res.total);
      } else {
        setDrivers(null);
        setTotal(0);
      }
    } catch (error) {
      // messageApi.error("Failed to fetch driver data!.");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDrivers(currentPage, debouncedSearch, sort);
  }, [currentPage, debouncedSearch, sort]);

  useEffect(() => {
    const fetchPendingDriversCount = async () => {
      try {
        const res = await getPendingDriverCount();
        if (res.count) {
          setCount(res.count);
        }
      } catch (error) {
        messageApi.error("Failed to fetch count.");
        console.log(error);
      }
    };
    fetchPendingDriversCount();
  }, [messageApi]);

  const changeStatus = async (id: string) => {
    try {
      messageApi.open({
        key,
        type: "loading",
        content: "Changing status...",
      });
      const res = await toggleBlockUnblockDriver(id);
      if (res.success) {
        setTimeout(() => {
          setDrivers((prevUsers) =>
            prevUsers
              ? prevUsers.map((driver) =>
                  driver._id === id
                    ? { ...driver, isBlocked: !driver.isBlocked }
                    : driver
                )
              : null
          );

          messageApi.open({
            key,
            type: "success",
            content: res.message || "Driver status updated successfully!",
            duration: 2,
          });
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      messageApi.error("Failed to update status.");
    }
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setSearch(value);
  };
  const changeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as "A-Z" | "Z-A");
  };

  return (
    <div className="bg-[#0E1220] min-h-screen flex flex-col lg:flex-row">
      <AdminNavBar />
      {contextHolder}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {driverInfo && (
          <AlertDialogContent className="bg-black max-w-[90vw] sm:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                {driverInfo.isBlocked ? "Unblock Driver?" : "Block Driver?"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-300">
                {driverInfo.isBlocked
                  ? "Are you sure you want to unblock this driver? They will be able to interact with the application."
                  : "Are you sure you want to block this driver? They will no longer be able to interact with the application."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-black text-white hover:bg-gray-400">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-white text-black hover:bg-black hover:text-white"
                onClick={() => changeStatus(driverInfo._id)}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>

      <div className="flex-1 flex flex-col items-center px-4 py-6 sm:px-6 lg:px-8">
        <Link
          to="/admin/pending-drivers"
          className="w-full max-w-xs mb-6 transition-transform hover:scale-[1.02]"
        >
          <div className="relative bg-[#394065] hover:bg-[#4a527a] text-white rounded-xl h-12 flex items-center justify-center px-4 shadow-md transition-colors duration-200">
            <p className="text-sm sm:text-base font-medium">Pending Request</p>

            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                {count}
              </span>
            )}
          </div>
        </Link>

        <div className="w-full ">
          <SearchSort
            search={search}
            sort={sort}
            handleSearchChange={handleSearchChange}
            setSort={changeSort}
          />
          <AdminTable users={drivers} onBlockToggle={updateUserStatus} />
          <Pagination
            current={currentPage}
            total={total}
            pageSize={5}
            align="center"
            onChange={(page) => setCurrentPage(page)}
           
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDrivers;
