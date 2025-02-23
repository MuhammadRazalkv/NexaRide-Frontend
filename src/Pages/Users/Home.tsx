import { Landing1, Landing2, Landing3 } from "../../Assets";
import { motion } from "framer-motion";
import Footer from "../../Components/User Comp/Footer";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate()

  return (
    <>
    {/* Navbar  */}
      <div className="h-[70px] flex items-center justify-between px-9 shadow-md w-full bg-white">
        <h1 className="font-primary text-4xl">NexaRide</h1>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white h-10 px-6 rounded-3xl text-sm drop-shadow-xl hover:bg-neutral-800 md:mr-5"
            onClick={() => navigate('/user/login')}
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black h-10 px-6 rounded-3xl text-sm drop-shadow-xl hover:bg-gray-100 hidden md:block"
            onClick={() => navigate('/user/signup')}
          >
            Sign up
          </motion.button>
        </div>
      </div>

      {/* Landing sec 1  */}
      <div className="relative w-full bg-cover" style={{ height: "calc(100vh - 70px)" }}>
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          src={Landing1}
          alt="Landing"
          className="h-full w-full object-cover object-bottom"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0 flex flex-col items-start justify-center text-left pl-10"
        >
          <h1 className="font-primary text-5xl text-black">
            Ride with Ease, <br /> Arrive in Breeze.
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white h-10 px-20 rounded-3xl text-sm mt-4 hover:bg-neutral-800"
            onClick={() => navigate('/user/signup')}
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>


      {/* Landing sec 2 user   */}
      <div className="mt-5 mr-3 w-full bg-cover px-4">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-12 min-h-[500px]"
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={Landing2}
            alt="Landing"
            className="w-full md:w-1/2 max-h-[500px] object-cover rounded-lg"
          />

          <div className="md:w-1/2 font-secondary text-center md:text-left flex flex-col justify-center items-center md:items-start space-y-6">
            <h1 className="text-4xl md:text-5xl text-black font-bold">Your Ride Awaits</h1>
            <p className="text-lg text-gray-700 max-w-lg">
              View past trips, tailored suggestions, support resources, and more.
            </p>
            <p className="text-lg text-gray-700 max-w-lg">Log in to see your recent activity</p>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white py-3 px-8 rounded-3xl text-sm drop-shadow-xl hover:bg-neutral-800"
                onClick={() => navigate('/user/login')}
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black py-3 px-8 rounded-3xl text-sm drop-shadow-xl hover:bg-gray-100"
                onClick={() => navigate('/user/signup')}
              >
                Sign up
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Landing sec 2 Driver    */}

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row-reverse items-center gap-12 min-h-[500px] mt-10"
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={Landing3}
            alt="Landing"
            className="w-full md:w-1/2 max-h-[500px] object-cover rounded-lg"
          />

          <div className="md:w-1/2 font-secondary text-center md:text-left flex flex-col justify-center items-center md:items-start space-y-6 ml-4">
            <h1 className="text-4xl md:text-5xl text-black font-bold">Hit the Road and Earn</h1>
            <p className="text-lg text-gray-700 max-w-lg">
              Make money on your schedule with every ride. Drive your own car and earn on your terms.
            </p>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white py-3 px-8 rounded-3xl text-sm drop-shadow-xl hover:bg-neutral-800"
                onClick={() => navigate('/driver/login')}
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black py-3 px-8  rounded-3xl text-sm drop-shadow-xl hover:bg-gray-100 "
                onClick={() => navigate('/driver/signup')}
              >
                Get started as a Driver
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;
