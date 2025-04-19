import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaCar,
} from "react-icons/fa";
import { useSidebar } from "../../hooks/useSidebar";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogout } from "@/redux/slices/adminAuthSlice";

const AdminNavBar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
    const dispatch = useDispatch()
  return (
    <>
      
      {!isOpen && (
        <button
          className="fixed top-5 left-5 z-50 bg-[#202936] text-white p-3 rounded-full shadow-lg hover:bg-[#282c3f] transition-all"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>
      )}

     
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#0b0f1f] text-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-40 flex flex-col`}
      >
   
        <div className="flex items-center justify-between p-6 text-xl font-bold">
          <span>NexaRide</span>
          <button
            onClick={toggleSidebar}
            className="bg-[#202936] text-white p-3 rounded-full shadow-lg hover:bg-[#282c3f] transition-all"
          >
            <FaTimes />
          </button>
        </div>

        
        <nav className="flex flex-col gap-4 p-4 flex-1">
          {/* <NavItem icon={<FaHome />} text="Dashboard" /> */}
          <Link to={"/admin/dashboard"}>
            {" "}
            <NavItem icon={<FaHome />} text="Dashboard" />
          </Link>
          <Link to={"/admin/users"}>
            {" "}
            <NavItem icon={<FaUser />} text="Users" />
          </Link>
          <Link to={"/admin/drivers"}>
            {" "}
            <NavItem icon={<FaCar />} text="Drivers" />
          </Link>
          {/* <NavItem icon={<FaCog />} text="Settings" /> */}
        </nav>

        <div className=" p-4 ">
          <button
            className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-all"
            onClick={() => {
              dispatch(adminLogout())
              window.location.href = "/admin/login";
            }}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

/** Reusable NavItem Component */
const NavItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#202936] transition-all">
    {icon}
    <span>{text}</span>
  </button>
);

export default AdminNavBar;
