import { Route, Routes } from "react-router-dom";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashBoard from "@/pages/admin/AdminDashBoard";
import { SidebarProvider } from "../context/toggeleSideBar";
import AdminUsers from "@/pages/admin/AdminUser";
import AdminDrivers from "@/pages/admin/AdminDrivers";
import AdminPendingDriver from "@/pages/admin/AdminPendingDriver";
import { ConfigProvider, theme } from "antd";

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

          <Route path="/dashboard" element={<AdminDashBoard />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/drivers" element={<AdminDrivers />} />
          <Route path="/pending-drivers" element={<AdminPendingDriver />} />

          {/*  <Route path='/addInfo' element={<AddInfo />} />
   
        <Route path='/reset-password' element={<ResetPassword />} /> */}

          {/* Protected Routes */}

          {/* <Route element={<ProtectedRoute />}>
     <Route path='/ride' element={<Ride />} />
   </Route> */}
        </Routes>
      </SidebarProvider>
    </ConfigProvider>
  );
};

export default AdminRoutes;
