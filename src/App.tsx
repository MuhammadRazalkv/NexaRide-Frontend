import './App.css'
import { Route , Routes  } from 'react-router-dom'
import Home from './Pages/Users/Home'
import UserRoutes from './Routes/UserRoutes'
function App() {
 

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} /> 
        <Route path='/user/*' element={<UserRoutes />} /> 
        

        
      </Routes>
    </>
  )
}

export default App
