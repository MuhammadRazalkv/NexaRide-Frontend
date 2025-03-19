import { Route, Routes } from 'react-router-dom'

import DSignup from '../Pages/Driver/Auth/DSignup'
import DLogin from '../Pages/Driver/Auth/DLogin'

// import PublicRoute from './PublicRoute'
import DOtp from '../Pages/Driver/Auth/DOtp'
import DAddInfo from '../Pages/Driver/Auth/DAddInfo'
// import ResetPassword from '../Pages/Users/Auth/ResetPassword'
import DAddVehicle from '../Pages/Driver/Auth/DAddVehicle'
import ProtectedRouteDriverAuth from './Driver/DriverAuthRoutes'
import DriverProtectedRoute from './Driver/ProtectedDriverRoutes'
import { SignupProvider } from '../Context/driverSignUpContext'
import UploadImg from '../Pages/Driver/Auth/UploadImg'
import DRide from '../Pages/Driver/Ride/DRide'
import DVerificationPending from '../Pages/Driver/Auth/DVerificationPending'
import DriverPublicRoute from './Driver/PublicDriverRoutes'
import DriverRejected from '../Pages/Driver/Auth/DriverRejected'
import VehicleRejected from '../Pages/Driver/Auth/VehicleRejected'
import DResetPassword from '@/Pages/Driver/Auth/DResetPassword'

const DriverRoutes = () => {
  return (

    <SignupProvider >
      <Routes>
        {/* Public Routes  */}
        <Route element={<DriverPublicRoute />}>
          <Route path="/signup" element={<DSignup />} />
          <Route path="/otp-verify" element={<ProtectedRouteDriverAuth element={<DOtp />} requiredStep={2} />} />
          <Route path="/addInfo" element={<ProtectedRouteDriverAuth element={<DAddInfo />} requiredStep={3} />} />
          <Route path="/addVehicle" element={<ProtectedRouteDriverAuth element={<DAddVehicle />} requiredStep={4} />} />
          <Route path='/login' element={<DLogin />} />

        </Route>

      <Route path='/reset-password' element={<DResetPassword />} />



        {/* Protected Routes */}
        <Route path='/verification-pending' element={<DVerificationPending />} />

        <Route element={<DriverProtectedRoute />}>
          <Route path='/ride' element={<DRide />} />
          <Route path='/rejected' element={<DriverRejected />} />
          <Route path='/vehicle-rejected' element={<VehicleRejected />} />
        </Route>

        <Route path='/upload' element={<UploadImg />} />



      </Routes>
    </SignupProvider>

  )
}

export default DriverRoutes
