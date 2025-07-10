import { motion, AnimatePresence } from "framer-motion";
import Loader from "../Loader";

const WaitingModal = ({
  open,
  message,
}: {
  open: boolean;
  message?: string;
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-40"
        >
          <div className="bg-white p-8 rounded-lg shadow-lg text-black text-center w-80">
            <Loader />
            <p className="mt-4 text-lg font-bold">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WaitingModal;
