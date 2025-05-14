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
          </Route>
        </Routes>
      </SidebarProvider>
    </ConfigProvider>
  );
};

export default AdminRoutes;
