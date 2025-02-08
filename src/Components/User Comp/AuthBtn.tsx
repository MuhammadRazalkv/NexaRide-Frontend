import { motion } from "framer-motion";

const AuthBtn = ({text}: {text: string}) => {
  return (
  <>
   <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }} 
            className="bg-blue-500 text-white h-10 px-6 rounded-3xl text-sm drop-shadow-xl hover:bg-blue-800 sm:max-w-xs md:mr-5 mt-5"    
          >
            {text}
    </motion.button>
  </>
  )
}

export default AuthBtn
