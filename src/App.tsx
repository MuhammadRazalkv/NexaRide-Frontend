import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import UserRoutes from './Routes/UserRoutes'
import PublicRoute from './Routes/PublicRoute'
import DriverRoutes from './Routes/DriverRoutes'
import AdminRoutes from './Routes/AdminRoutes'
function App() {

  return (
    <>
      <Routes>

        <Route element={<PublicRoute />}>
          <Route path='/' element={<Home />} />
        </Route>
        <Route path='/user/*' element={<UserRoutes />} />
        <Route path='/driver/*' element={<DriverRoutes />} />
        <Route path='/admin/*' element={<AdminRoutes />} />


      </Routes>
    </>
  )
}

export default App
