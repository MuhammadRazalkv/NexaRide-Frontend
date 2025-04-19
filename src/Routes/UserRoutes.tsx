import { Route, Routes } from "react-router-dom";
import Signup from "@/pages/users/auth/Signup";
import Otp from "@/pages/users/auth/Otp";
import AddInfo from "@/pages/users/auth/AddInfo";
import Login from "@/pages/users/auth/Login";
import Ride from "@/pages/users/ride/Ride";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import ResetPassword from "@/pages/users/auth/ResetPassword";
import Profile from "@/pages/users/Profile";
import Wallet from "@/pages/users/Wallet";
import RideHistory from "@/pages/users/ride/RideHistory";
import RideInfo from "@/pages/users/ride/RideInfo";
const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-verify" element={<Otp />} />
        <Route path="/addInfo" element={<AddInfo />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}

      <Route element={<ProtectedRoute />}>
        <Route path="/ride" element={<Ride />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/history" element={<RideHistory />} />
        <Route path="/rideInfo" element={<RideInfo />} />

      </Route>
    </Routes>
  );
};

export default UserRoutes;
