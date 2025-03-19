import { useEffect, useState } from "react"
import AdminNavBar from "../../components/Admin Comp/AdminNavBar"
import { getUsers, updateStatus } from "../../api/auth/admin"
import { FaEye } from "react-icons/fa";

import { message } from 'antd'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,

} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button";


interface IUser {
    _id: string;
    name: string;
    email: string;
    isBlocked: boolean
}


const AdminUsers = () => {
    const [users, setUsers] = useState<IUser[] | null>(null);
    const [userInfo, setUserInfo] = useState<IUser | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getUsers();
                if (res.users) {
                    setUsers(res.users);
                }
            } catch (error) {

                console.log(error);

            }
        };
        fetchUsers();
    }, []);

    const updateUserStatus = (user: IUser) => {
        setIsDialogOpen(true)
        setUserInfo(user)
    }


    const changeStatus = async (userId: string) => {
        if (!userId) return;

        try {
            messageApi.open({
                key,
                className: '',
                type: 'loading',
                content: 'Changing status...',
            });

            const res = await updateStatus(userId);
            if (res.success) {
                setTimeout(() => {
                    
                
                setUsers((prevUsers) =>
                    prevUsers
                        ? prevUsers.map((user) =>
                            user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
                        )
                        : null
                );

                messageApi.open({
                    key,
                    type: 'success',
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

    return (
        <div className="bg-[#0E1220] min-h-screen flex flex-col lg:flex-row">
            <AdminNavBar />
            {contextHolder}

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {userInfo && (
                    <AlertDialogContent className="bg-black">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                                {userInfo.isBlocked ? "Unblock User?" : "Block User?"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {userInfo.isBlocked
                                    ? "Are you sure you want to unblock this user? They will be able to interact with the application."
                                    : "Are you sure you want to block this user? They will no longer be able to interact with the application."
                                }
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-black text-white hover:bg-gray-400">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-white text-black hover:bg-black hover:text-white "
                                onClick={() => changeStatus(userInfo._id)}
                            >
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                )}
            </AlertDialog>

            <div className="flex-1 flex flex-col justify-center items-center p-6">

                <div className="bg-[#1A2036] rounded-lg p-6 w-full max-w-5xl shadow-lg border border-[#2C3347]/50">
                    <div className="hidden md:flex bg-[#2e345c] h-12 rounded-lg items-center px-6 text-white font-semibold">
                        <p className="w-[10%] text-center">#</p>
                        <p className="w-[30%] text-left">Name</p>
                        <p className="w-[30%] text-left">Email</p>
                        <p className="w-[15%] text-center">Block</p>
                        <p className="w-[15%] text-center">View</p>
                    </div>


                    {users && users.length > 0 ? (
                        users.map((item, index) => (
                            <div
                                key={item._id}
                                className="bg-[#394065] mt-2 rounded-lg p-4 md:h-12 flex flex-col md:flex-row items-center md:items-center px-6 text-white"
                            >

                                <div className="md:hidden w-full text-center">
                                    <p className="text-gray-400">{index + 1}</p>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm">{item.email}</p>

                                    <div className="flex justify-center mt-2 space-x-4">
                                        <button
                                            onClick={() => changeStatus(item._id)}
                                            className={`px-3 py-1 rounded transition-all ${item.isBlocked
                                                ? "bg-green-500 hover:bg-green-600"
                                                : "bg-red-500 hover:bg-red-600"
                                                }`}
                                        >
                                            {item.isBlocked ? "Unblock" : "Block"}
                                        </button>

                                        <button className="px-3 py-1 rounded hover:bg-blue-600 transition-all">
                                            <FaEye />
                                        </button>
                                    </div>
                                </div>


                                <p className="hidden md:block w-[10%] text-center">{index + 1}</p>
                                <p className="hidden md:block w-[30%] text-left">{item.name}</p>
                                <p className="hidden md:block w-[30%] text-left">{item.email}</p>

                                <div className="hidden md:flex w-[15%] justify-center">

                                    <Button variant={item.isBlocked ? 'success' : "destructive"} onClick={() => updateUserStatus(item)}>
                                        {item.isBlocked ? "Unblock" : "block"}
                                    </Button>


                                </div>

                                <div className="hidden md:flex w-[15%] justify-center">
                                    <button className="px-3 py-1 rounded hover:bg-blue-600 transition-all">
                                        <FaEye />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-white mt-4 text-center">No users found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;

