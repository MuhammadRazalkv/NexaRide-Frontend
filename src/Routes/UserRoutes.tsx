import { Route, Routes } from 'react-router-dom'
import Signup from '../Pages/Users/Auth/Signup'
import Otp from '../Pages/Users/Auth/Otp'
import AddInfo from '../Pages/Users/Auth/AddInfo'
import Login from '../Pages/Users/Auth/Login'
import Ride from '../Pages/Users/Ride/Ride'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import ResetPassword from '../Pages/Users/Auth/ResetPassword'
import Profile from '@/Pages/Users/Profile'

const UserRoutes = () => {
  return (

    <Routes>
       <Route element={<PublicRoute />}>
      <Route path='/signup' element={<Signup />} />
      <Route path='/otp-verify' element={<Otp />} />
      <Route path='/addInfo' element={<AddInfo />} />
      <Route path='/login' element={<Login />} />
      </Route>
      <Route path='/reset-password' element={<ResetPassword />} />
      
      {/* Protected Routes */}

      <Route element={<ProtectedRoute />}>
        <Route path='/ride' element={<Ride />} />
        <Route path='/profile' element={<Profile />} />
      </Route>




    </Routes>

  )
}

export default UserRoutes
