import { Route, Routes } from 'react-router-dom'

import DSignup from '../Pages/Driver/Auth/DSignup'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
// import ResetPassword from '../Pages/Users/Auth/ResetPassword'

const DriverRoutes = () => {
  return (

    <Routes>
       <Route element={<PublicRoute />}>
      <Route path='/signup' element={<DSignup />} />

      {/*<Route path='/otp-verify' element={<Otp />} />
      <Route path='/addInfo' element={<AddInfo />} />
      <Route path='/login' element={<Login />} /> */}
      </Route>
      {/* <Route path='/reset-password' element={<ResetPassword />} /> */}
      
      {/* Protected Routes */}

      <Route element={<ProtectedRoute />}>
        {/* <Route path='/ride' element={<Ride />} /> */}
      </Route>




    </Routes>

  )
}

export default DriverRoutes
