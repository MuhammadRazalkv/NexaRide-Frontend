import { Route, Routes } from "react-router-dom";
import Signup from "@/pages/Users/auth/Signup";
import Otp from "@/pages/Users/auth/Otp";
import AddInfo from "@/pages/Users/auth/AddInfo";
import Login from "@/pages/Users/auth/Login";
import Ride from "@/pages/Users/ride/Ride";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import ResetPassword from "@/pages/Users/auth/ResetPassword";
import Profile from "@/pages/Users/Profile";
import Wallet from "@/pages/Users/Wallet";
import RideHistory from "@/pages/Users/RideHistory";
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
      </Route>
    </Routes>
  );
};

export default UserRoutes;
