import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
import {
  MdOutlineKeyboardArrowDown,
  MdMenu,
  MdClose,
  MdLogout,
  MdDashboard,
} from "react-icons/md";
import { FaCrown, FaUser } from "react-icons/fa";
import { useState } from "react";
import { logout } from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { RootState } from "@/redux/store";
import { message } from "antd";
import { userLogout } from "@/api/auth/user";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { name: "Travel", link: "/" },
    { name: "History", link: "/user/history" },
    { name: "Wallet", link: "/user/wallet" },
    // { name: 'About Us ', link: '/' }
  ];
  const dispatch = useDispatch();
  const name = useSelector((state: RootState) => state.auth.user?.name);

  const handleLogout = async () => {
    try {
      const res = await userLogout();
      if (res.success) {
        dispatch(logout());
      }
    } catch (error) {
      if (error instanceof Error) message.error(error.message);
    }
    dispatch(logout());
  };

  return (
    <div className="h-[70px] flex items-center justify-between px-9 shadow-md w-full bg-white">
      {/* Logo */}
      <h1 className="font-primary text-3xl md:text-4xl">NexaRide</h1>

      {/* Mobile Menu */}
      <div
        className="md:hidden text-2xl cursor-pointer"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <MdClose /> : <MdMenu />}
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="absolute top-16 z-50 right-0 w-full bg-gray-100 text-gray-600 text-sm h-dvh p-6 space-y-4">
          {links.map((item) => (
            <div
              key={item.name}
              className="font-primary cursor-pointer hover:text-black"
            >
              <Link to={item.link}>{item.name}</Link>
              <hr className="h-px mt-2 mb-2 bg-gray-300 border-0" />
            </div>
          ))}
          <div className="font-primary cursor-pointer hover:text-black">
            <Link to={"/user/dashboard"}>DashBoard</Link>
            <hr className="h-px mt-2 mb-2 bg-gray-300 border-0" />
          </div>
          <div className="font-primary cursor-pointer hover:text-black">
            <Link to={"/user/profile"}>Profile</Link>
            <hr className="h-px mt-2 mb-2 bg-gray-300 border-0" />
          </div>
          <div className="font-primary cursor-pointer hover:text-black">
            <Link to={"/user/subscription"}>Subscription</Link>
            <hr className="h-px mt-2 mb-2 bg-gray-300 border-0" />
          </div>

          <div className="font-primary cursor-pointer text-red-600 hover:text-red-800">
            <Link to={"/user/login"} onClick={handleLogout}>
              {" "}
              Logout
            </Link>
            <hr className="h-px mt-2 mb-2 bg-gray-300 border-0" />
          </div>
        </div>
      )}

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-1 ml-12 justify-start space-x-10 text-gray-600">
        {links.map((item) => (
          // <motion.p
          //   key={item.name}
          //   initial={{ opacity: 0, y: 50 }}
          //   animate={{ opacity: 1, y: 0 }}
          //   transition={{ duration: 0.5 + index * 0.1, ease: "easeOut" }}
          //   className="font-primary cursor-pointer hover:text-black"
          // >
          //   <Link to={item.link}>{item.name}</Link>
          // </motion.p>
          <p
            key={item.name}
            className="font-primary cursor-pointer hover:text-black"
          >
            <Link to={item.link}>{item.name}</Link>
          </p>
        ))}
      </div>

      {/* Other links */}
      <div className="hidden md:flex items-center text-white">
        <HoverCard>
          <HoverCardTrigger className="bg-black hover:bg-gray-800 rounded-2xl w-fit py-2 px-4 text-sm flex items-center justify-center gap-2 font-semibold">
            {name}
            <MdOutlineKeyboardArrowDown />
          </HoverCardTrigger>
          <HoverCardContent className="w-xs">
            <Link to={"/user/dashboard"}>
              <div className="rounded-lg p-2 font-semibold bg-gray-100 hover:bg-gray-200 flex  items-center justify-start gap-2 m-1">
                <MdDashboard />
                Dashboard
              </div>
            </Link>
            <Link to={"/user/profile"}>
              <div className="rounded-lg p-2 font-semibold bg-gray-100 hover:bg-gray-200 flex  items-center justify-start gap-2 m-1">
                <FaUser />
                Profile
              </div>
            </Link>
            <Link to={"/user/subscription"}>
              <div className="rounded-lg p-2 font-semibold bg-gray-100 hover:bg-gray-200 flex  items-center justify-start gap-2 m-1">
                <FaCrown />
                Subscription
              </div>
            </Link>
            <Link to={"/user/login"} onClick={handleLogout}>
              <div className=" rounded-lg p-2 font-semibold bg-gray-100   flex  items-center justify-start gap-2 cursor-pointer text-red-600 hover:bg-red-100 hover:text-red-800 m-1">
                <MdLogout />
                Logout
              </div>
            </Link>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
};

export default NavBar;
