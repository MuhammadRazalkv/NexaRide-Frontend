import { Route, Routes } from "react-router-dom";

import DSignup from "@/pages/driver/auth/DSignup";
import DLogin from "@/pages/driver/auth/DLogin";
import DOtp from "@/pages/driver/auth/DOtp";
import DAddInfo from "@/pages/driver/auth/DAddInfo";
// import ResetPassword from '../Pages/Users/Auth/ResetPassword'
import DAddVehicle from "@/pages/driver/auth/DAddVehicle";
import ProtectedRouteDriverAuth from "./driver/DriverAuthRoutes";
import DriverProtectedRoute from "./driver/ProtectedDriverRoutes";
import { SignupProvider } from "../context/driverSignUpContext";
import UploadImg from "@/pages/driver/auth/UploadImg";
import DRide from "@/pages/driver/ride/DRide";
import DVerificationPending from "@/pages/driver/auth/DVerificationPending";
import DriverPublicRoute from "./driver/PublicDriverRoutes";
import DriverRejected from "@/pages/driver/auth/DriverRejected";
import VehicleRejected from "@/pages/driver/auth/VehicleRejected";
import DResetPassword from "@/pages/driver/auth/DResetPassword";
import DProfile from "@/pages/driver/DProfile";
import DWallet from "@/pages/driver/DWallet";
import DRideHistory from "@/pages/driver/ride/DRideHistory";
import DRideInfo from "@/pages/driver/ride/DRideInfo";
import DDashboard from "@/pages/driver/ride/DDashboard";
import NotFoundPage from "@/pages/NotFound";
import { DRideProvider } from "@/context/driverSocketContext";
const DriverRoutes = () => {
  return (
    <SignupProvider>
      <Routes>
        {/* Public Routes  */}
        <Route element={<DriverPublicRoute />}>
          <Route path="/signup" element={<DSignup />} />
          <Route
            path="/otp-verify"
            element={
              <ProtectedRouteDriverAuth element={<DOtp />} requiredStep={2} />
            }
          />
          <Route
            path="/addInfo"
            element={
              <ProtectedRouteDriverAuth
                element={<DAddInfo />}
                requiredStep={3}
              />
            }
          />
          <Route
            path="/addVehicle"
            element={
              <ProtectedRouteDriverAuth
                element={<DAddVehicle />}
                requiredStep={4}
              />
            }
          />
          <Route path="/login" element={<DLogin />} />
        </Route>

        <Route path="/reset-password" element={<DResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/verification-pending"
          element={<DVerificationPending />}
        />

        <Route
          element={
            <DRideProvider>
              <DriverProtectedRoute />
            </DRideProvider>
          }
        >
          <Route path="/ride" element={<DRide />} />
          <Route path="/rejected" element={<DriverRejected />} />
          <Route path="/vehicle-rejected" element={<VehicleRejected />} />
          <Route path="/profile" element={<DProfile />} />
          <Route path="/wallet" element={<DWallet />} />
          <Route path="/history" element={<DRideHistory />} />
          <Route path="/rideInfo" element={<DRideInfo />} />
          <Route path="/dashboard" element={<DDashboard />} />
        </Route>

        <Route path="/upload" element={<UploadImg />} />

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </SignupProvider>
  );
};

export default DriverRoutes;
