import { MoveRight } from "lucide-react";
import { motion } from "framer-motion";
import { FaFacebookSquare, FaInstagram, FaLinkedin , FaCopyright  } from "react-icons/fa"
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="bg-black w-full text-white px-6 py-8 mt-6">

      <h1 className="font-primary text-3xl font-bold tracking-wide text-center md:text-left">
        NexaRide
      </h1>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-6">

        <motion.div
          whileHover={{ x: 5 }}
          className="font-secondary flex items-start gap-3 group cursor-pointer w-fit mx-auto md:mx-0"
        >
          <p className="text-lg font-medium group-hover:underline transition-all duration-200">
            Need Help?
          </p>
          <MoveRight className="w-6 h-6 bg-white text-black p-1 rounded-full border border-gray-300 transition-transform duration-200 group-hover:translate-x-1" />
        </motion.div>


        <div>
          <p className="text-lg font-medium">Links</p>
          <ul className="text-sm mt-2 space-y-3">
            <li className="hover:underline">Home</li>
            <li className="hover:underline">About Us</li>
            <li className="hover:underline">Contact</li>
            <li className="hover:underline">FAQ</li>
            <li className="hover:underline">Terms & Conditions</li>
            <li className="hover:underline">Privacy Policy</li>
          </ul>
        </div>


        <div>
          <p className="text-lg font-medium">Ride Services</p>
          <ul className="text-sm mt-2 space-y-3">
            <li className="hover:underline">Ride Booking</li>
            <li className="hover:underline">Become a Driver</li>
          </ul>
        </div>


        <div>
          <p className="text-lg font-medium">Contact Information</p>
          <ul className="text-sm mt-2 space-y-3">
            <li>
              Email:{" "}
              <span className="text-blue-400 hover:underline">
                support@nexaride.com
              </span>
            </li>
            <li>Customer Service: 8523697410</li>
          </ul>
        </div>
      </div>


      <motion.div className="flex items-center justify-center mt-7 gap-10">
        <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
          <FaFacebookSquare className="w-7 h-7 cursor-pointer hover:text-blue-500" />
        </motion.div>

        <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
          <FaSquareXTwitter className="w-7 h-7 cursor-pointer hover:text-black " />
        </motion.div>

        <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
          <FaInstagram className="w-7 h-7 cursor-pointer hover:text-pink-500" />
        </motion.div>

        <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
          <FaLinkedin className="w-7 h-7 cursor-pointer hover:text-blue-600" />
        </motion.div>
      </motion.div>

      <hr className="text-gray-400 mt-3 "/>
      <div className="flex mt-3 text-xs text-gray-400 text-center gap-2 ">
      <FaCopyright className="mt-0.5" />
      <p> 2025 NexaRide Technologies Inc.</p>
      </div>
    



    </div>
  );
};

export default Footer;
