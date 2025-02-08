import { Route , Routes  } from 'react-router-dom'
import Signup from '../Pages/Users/Auth/Signup'
import Otp from '../Pages/Users/Auth/Otp'
import AddInfo from '../Pages/Users/Auth/AddInfo'
import Login from '../Pages/Users/Auth/Login'

const UserRoutes = () => {
  return (
    
      <Routes>
        <Route path='/signup' element={<Signup />} /> 
        <Route path='/otpVerification' element={<Otp />} /> 
        <Route path='/addInfo' element={<AddInfo />} /> 
        <Route path='/login' element={<Login />} /> 
        
        

        
      </Routes>
    
  )
}

export default UserRoutes
