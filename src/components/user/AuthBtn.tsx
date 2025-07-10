import { motion } from "framer-motion";

const AuthBtn = ({ text, onClick }: { text: string, onClick: () => void }) => {
  return (
    <>
      <motion.button
        // disabled
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        
        className="bg-blue-500 text-white h-10 px-6 rounded-3xl text-xs drop-shadow-xl hover:bg-blue-800 sm:max-w-xs md:mr-5 mt-5 "
      >
        {text}
      </motion.button>
    </>
  )
}

export default AuthBtn
