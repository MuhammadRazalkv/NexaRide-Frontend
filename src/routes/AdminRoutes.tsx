import { Route, Routes } from "react-router-dom";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashBoard from "@/pages/admin/AdminDashBoard";
import { SidebarProvider } from "../context/toggeleSideBar";
import AdminUsers from "@/pages/admin/AdminUser";
import AdminDrivers from "@/pages/admin/AdminDrivers";
import AdminPendingDriver from "@/pages/admin/AdminPendingDriver";
import { ConfigProvider, theme } from "antd";
import AProtectedRoute from "./AdminProtectedRoutes";
import AdminComplaints from "@/pages/admin/AdminComplaints";
import AdminOffers from "@/pages/admin/AdminOffers";
import AdminEarnings from "@/pages/admin/AdminEarnings";
import SubscribedUsers from "@/pages/admin/SubscribedUsers";
import DriverDetails from "@/pages/admin/DriverDetails";
import UserDetails from "@/pages/admin/UserDetails";
import NotFoundPage from "@/pages/NotFound";
import AdminRides from "@/pages/admin/AdminRides";
import AdminRideInfo from "@/pages/admin/AdminRideInfo";

const AdminRoutes = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <SidebarProvider>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route element={<AProtectedRoute />}>
            <Route path="/dashboard" element={<AdminDashBoard />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/drivers" element={<AdminDrivers />} />
            <Route path="/pending-drivers" element={<AdminPendingDriver />} />
            <Route path="/ride-complaints" element={<AdminComplaints />} />
            <Route path="/offers" element={<AdminOffers />} />
            <Route path="/earnings" element={<AdminEarnings />} />
            <Route path="/subscribed-users" element={<SubscribedUsers />} />
            <Route path="/driver-info" element={<DriverDetails />} />
            <Route path="/user-info" element={<UserDetails />} />
            <Route path="/rides" element={<AdminRides />} />
            <Route path="/ride-info" element={<AdminRideInfo />} />
          </Route>
          <Route path="/*" element={<NotFoundPage isAdmin={true} />} />
        </Routes>
      </SidebarProvider>
    </ConfigProvider>
  );
};

export default AdminRoutes;
