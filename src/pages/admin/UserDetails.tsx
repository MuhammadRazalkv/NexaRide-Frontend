import AdminNavBar from "@/components/admin/AdminNavbar";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import ProfileHead from "@/components/admin/ProfileHead";
import { message } from "antd";
import { getUserInfoAdmin, getUserRideAndRating } from "@/api/auth/admin";
import ProfileBody from "@/components/admin/ProfileBody";
import { IUserInfo } from "@/interfaces/user.interface";

const UserDetails = () => {
  const location = useLocation();
  const userId: string | null | undefined = location.state;
  const [user, setUser] = useState<IUserInfo>();
  const [ratings, setRatings] = useState<{
    avgRating: number;
    totalRatings: number;
  }>();
  const [totalRides, setTotalRides] = useState(0);

  useEffect(() => {
    if (!userId) {
      message.error("User Id not found");
      return;
    }
    const fetchInfo = async () => {
      try {
        const res = await getUserInfoAdmin(userId);
        const data = await getUserRideAndRating(userId);
        if (res.success && res.user) {
          setUser(res.user);
        }
        if (data.success && data.ratings) {
          setRatings(data.ratings);
        }
        if (data.totalRides) {
          setTotalRides(data.totalRides);
        }
      } catch (error) {
        if (error instanceof Error) message.error(error.message);
      }
    };
    fetchInfo();
  }, [userId]);
  return (
    <div className="bg-[#0E1220] min-h-screen flex flex-col items-center p-9">
      <AdminNavBar />
      {userId ? (
        <>
          <ProfileHead
            name={user?.name}
            isVehicleInfo={false}
            variant="user"
            profilePic={user?.profilePic}
            ratings={ratings}
            totalRides={totalRides}
          />
          <ProfileBody variant="user" info={user} />
        </>
      ) : (
        <>
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center text-white space-y-4">
            <h1 className="text-2xl font-semibold text-red-400">
              No User ID found
            </h1>
            <p className="text-gray-300">Please go back to the user list.</p>
            <Link
              to="/admin/users"
              className="px-5 py-2 bg-blue-600 rounded hover:bg-blue-700 transition duration-300 text-white font-medium"
            >
              Go Back
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetails;
