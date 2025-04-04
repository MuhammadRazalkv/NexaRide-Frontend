import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../Loader';

const WaitingModal = ({ sendRideReq }: { sendRideReq: boolean }) => {
  return (
    <AnimatePresence>
      {sendRideReq && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}  // Initial state: Invisible and smaller
          animate={{ opacity: 1, scale: 1 }}    // Final state: Fully visible and normal size
          exit={{ opacity: 0, scale: 0.8 }}     // Exit state: Shrinks back while fading out
          transition={{ duration: 0.3, ease: 'easeInOut' }} // Smooth transition
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-40"
        >
          <div className="bg-white p-8 rounded-lg shadow-lg text-black text-center w-80">
            <Loader />
            <p className="mt-4 text-lg font-bold">
              Waiting for driver response...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WaitingModal;
