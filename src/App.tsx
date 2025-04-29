import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import UserRoutes from "@/routes/UserRoutes";
import PublicRoute from "@/routes/PublicRoute";
import DriverRoutes from "@/routes/DriverRoutes";
import AdminRoutes from "@/routes/AdminRoutes";
function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/driver/*" element={<DriverRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </>
  );
}

export default App;
