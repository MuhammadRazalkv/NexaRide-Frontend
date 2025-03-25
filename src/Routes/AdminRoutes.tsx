import { Route, Routes } from 'react-router-dom'
import AdminLogin from '../Pages/Admin/AdminLogin'
import AdminDashBoard from '../Pages/Admin/AdminDashBoard'
import { SidebarProvider } from '../Context/toggeleSideBar'
import AdminUsers from '../Pages/Admin/AdminUser'
import AdminDrivers from '../Pages/Admin/AdminDrivers'
import AdminPendingDriver from '../Pages/Admin/AdminPendingDriver'
import { ConfigProvider, theme } from 'antd';

const AdminRoutes = () => {
  return (
    <ConfigProvider theme={{
      algorithm: theme.darkAlgorithm
    }}>
      <SidebarProvider >

        <Routes>

          <Route path='/login' element={<AdminLogin />} />

          <Route path='/dashboard' element={<AdminDashBoard />} />
          <Route path='/users' element={<AdminUsers />} />
          <Route path='/drivers' element={<AdminDrivers />} />
          <Route path='/pending-drivers' element={<AdminPendingDriver />} />

          {/*  <Route path='/addInfo' element={<AddInfo />} />
   
        <Route path='/reset-password' element={<ResetPassword />} /> */}

          {/* Protected Routes */}

          {/* <Route element={<ProtectedRoute />}>
     <Route path='/ride' element={<Ride />} />
   </Route> */}




        </Routes>
      </SidebarProvider>
    </ConfigProvider>
  )
}

export default AdminRoutes
