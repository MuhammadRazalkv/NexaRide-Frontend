import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaCar,
  FaExclamationTriangle,
  FaMoneyBillWaveAlt,
  FaCrown,
  FaHistory,
} from "react-icons/fa";
import { RiDiscountPercentFill } from "react-icons/ri";
import { useSidebar } from "../../hooks/useSidebar";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogout } from "@/redux/slices/adminAuthSlice";
import { message } from "antd";
import { logoutAdmin } from "@/api/auth/admin";

const AdminNavBar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;
  const handleLogout = async () => {
    try {
      const res = await logoutAdmin();
      if (res.success) {
        dispatch(adminLogout());
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  };
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
            <NavItem
              icon={<FaHome />}
              text="Dashboard"
              active={currentPath == "/admin/dashboard"}
            />
          </Link>
          <Link to={"/admin/users"}>
            {" "}
            <NavItem
              icon={<FaUser />}
              text="Users"
              active={currentPath == "/admin/users"}
            />
          </Link>
          <Link to={"/admin/drivers"}>
            {" "}
            <NavItem
              icon={<FaCar />}
              text="Drivers"
              active={currentPath == "/admin/drivers"}
            />
          </Link>
          <Link to={"/admin/rides"}>
            {" "}
            <NavItem
              icon={<FaHistory />}
              text="Ride History"
              active={currentPath == "/admin/rides"}
            />
          </Link>
          <Link to={"/admin/ride-complaints"}>
            {" "}
            <NavItem
              icon={<FaExclamationTriangle />}
              text="Complaints"
              active={currentPath == "/admin/ride-complaints"}
            />
          </Link>
          <Link to={"/admin/offers"}>
            {" "}
            <NavItem
              icon={<RiDiscountPercentFill />}
              text="Offers"
              active={currentPath == "/admin/offers"}
            />
          </Link>
          <Link to={"/admin/earnings"}>
            {" "}
            <NavItem
              icon={<FaMoneyBillWaveAlt />}
              text="Earnings"
              active={currentPath == "/admin/earnings"}
            />
          </Link>
          <Link to={"/admin/subscribed-users"}>
            {" "}
            <NavItem
              icon={<FaCrown />}
              text="Premium users"
              active={currentPath == "/admin/subscribed-users"}
            />
          </Link>
          {/* <NavItem icon={<FaCog />} text="Settings" /> */}
        </nav>

        <div className=" p-4 ">
          <button
            className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-all"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

const NavItem = ({
  icon,
  text,
  active = false,
}: {
  icon: React.ReactNode;
  text: string;
  active: boolean;
}) => (
  <button
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
      active ? "bg-[#202936] text-white" : "text-gray-300 hover:bg-[#202936]"
    }`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

export default AdminNavBar;
