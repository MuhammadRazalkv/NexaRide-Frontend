import { useEffect, useState } from "react";
// import { debounce } from "lodash";
import AdminNavBar from "../../components/admin/AdminNavbar";
import { getUsers, updateStatus } from "../../api/auth/admin";
import { Pagination, message } from "antd";
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
// import { RiUserSearchFill } from "react-icons/ri";
import AdminTable from "@/components/admin/AdminTable";
import SearchSort from "@/components/SearchSort";

interface IUser {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<IUser[] | null>(null);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"A-Z" | "Z-A">("A-Z");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const key = "updatable";

  const fetchUsers = async (page = 1, searchTerm = "", sortOrder = "A-Z") => {
    try {
      const res = await getUsers(page, searchTerm, sortOrder);
      if (res.users && res.total) {
        setUsers(res.users);
        setTotal(res.total);
      } else {
        setUsers(null);
        setTotal(0);
      }
    } catch (error) {
      console.log(error);       
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchUsers(currentPage, debouncedSearch, sort);
  }, [currentPage, debouncedSearch, sort]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setSearch(value);
  };
  const updateUserStatus = (user: IUser) => {
    setIsDialogOpen(true);
    setUserInfo(user);
  };

  const changeStatus = async (userId: string) => {
    if (!userId) return;

    try {
      messageApi.open({
        key,
        className: "",
        type: "loading",
        content: "Changing status...",
      });

      const res = await updateStatus(userId);
      if (res.success) {
        setTimeout(() => {
          setUsers((prevUsers) =>
            prevUsers
              ? prevUsers.map((user) =>
                  user._id === userId
                    ? { ...user, isBlocked: !user.isBlocked }
                    : user
                )
              : null
          );

          messageApi.open({
            key,
            type: "success",
            content: res.message || "User status updated successfully!",
            duration: 2,
          });
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to update status.");
    }
  };

  const changeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as "A-Z" | "Z-A");
  };

  return (
    <div className="bg-[#0E1220] min-h-screen flex flex-col items-center px-4 py-6">
      <AdminNavBar />
      {contextHolder}

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {userInfo && (
          <AlertDialogContent className="bg-black">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                {userInfo.isBlocked ? "Unblock User?" : "Block User?"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                {userInfo.isBlocked
                  ? "Are you sure you want to unblock this user? They will be able to interact with the application."
                  : "Are you sure you want to block this user? They will no longer be able to interact with the application."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-black text-white hover:bg-gray-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-white text-black hover:bg-gray-300"
                onClick={() => changeStatus(userInfo._id)}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>

      <div className="w-full max-w-5xl mt-10">

        <SearchSort sort={sort} search={search} handleSearchChange={handleSearchChange} setSort={changeSort}  />

        {/* Table */}
        <AdminTable users={users} onBlockToggle={updateUserStatus} />

       
        <div className="flex justify-center mt-6">
          <Pagination
            current={currentPage}
            total={total}
            pageSize={5}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
