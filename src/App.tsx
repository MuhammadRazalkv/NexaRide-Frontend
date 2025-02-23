import './App.css'
import { Route , Routes  } from 'react-router-dom'
import Home from './Pages/Users/Home'
import UserRoutes from './Routes/UserRoutes'
import PublicRoute from './Routes/PublicRoute'
import DriverRoutes from './Routes/DriverRoutes'
function App() {
 

  return (
    <>
      <Routes>
      <Route element={<PublicRoute />}>
        <Route path='/' element={<Home />} /> 
        </Route>
        <Route path='/user/*' element={<UserRoutes />} /> 
        <Route path='/driver/*' element={<DriverRoutes />} /> 

        
      </Routes>
    </>
  )
}

export default App
