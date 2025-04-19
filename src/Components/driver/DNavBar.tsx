import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { MdOutlineKeyboardArrowDown, MdMenu, MdClose , MdLogout } from "react-icons/md";
import { useState } from "react";
import { logoutDriver } from "@/redux/slices/driverAuthSlice";
import { useDispatch } from "react-redux";

const DNavBar = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { name: 'Drive', link: '/' },
    { name: 'History', link: '/driver/history' },
    { name: 'Wallet', link: '/driver/wallet' }
  ]
  const dispatch = useDispatch()

  return (
    <div className="h-[70px] flex items-center justify-between px-9 shadow-md w-full bg-white">

      {/* Logo */}
      <h1 className="font-primary text-3xl md:text-4xl">NexaDrive</h1>

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
        <div className="absolute top-16 right-0 w-full bg-gray-100 text-gray-600 text-sm h-dvh p-6 space-y-4">
          {links.map((item) => (
            <div key={item.name} className="font-primary cursor-pointer hover:text-black">
              <Link to={item.link}>{item.name}</Link>
              <hr className="h-px mt-2 mb-2 bg-gray-300 border-0" />
            </div>
          ))}
          <div className="font-primary cursor-pointer hover:text-black">
            <Link to={'/user/profile'}>Profile</Link>
            <hr className="h-px mt-2 mb-2 bg-gray-300 border-0" />
          </div>
          <div className="font-primary cursor-pointer text-red-600 hover:text-red-800">
            <Link to={'/user/login'} onClick={()=>dispatch(logoutDriver())}> <MdLogout/> Logout</Link>
            <hr className="h-px mt-2 mb-2 bg-gray-300 border-0" />
          </div>
        </div>
      )}

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-1 ml-12 justify-start space-x-10 text-gray-600">
        {links.map((item, index) => (
          <motion.p
            key={item.name}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 + index * 0.1, ease: "easeOut" }}
            className="font-primary cursor-pointer hover:text-black"
          >
            <Link to={item.link}>
              {item.name}
            </Link>
          </motion.p>
        ))}
      </div>

      {/* Profile Button */}
      <div className="hidden md:flex items-center text-white">
        <Link to={'/driver/profile'}>
          <div className="bg-black hover:bg-gray-800 rounded-2xl w-fit py-2 px-4 text-sm flex items-center justify-center gap-2 font-semibold">
            Profile
            <MdOutlineKeyboardArrowDown />
          </div>
        </Link>
      </div>

    </div>
  );
};

export default DNavBar;
