import { IoWallet } from "react-icons/io5";
import { GrStripe } from "react-icons/gr";


type Props = {
  isOpen: boolean;
  onSelect: (method: "wallet" | "stripe") => void;
};

const PaymentOptions = ({ isOpen, onSelect }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/25 bg-opacity-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative animate-fade-in">

        <h2 className="text-xl font-semibold text-center mb-6">
            Ride completed
        </h2>
        <div className="space-y-4">
          <div
            onClick={() => onSelect("wallet")}
            className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
          >
            <IoWallet size={24}  />
            <span className="text-gray-800 font-medium">Pay using Wallet</span>
          </div>
          <div
            onClick={() => onSelect("stripe")}
            className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
          >
            <GrStripe size={24}  />
            <span className="text-gray-800 font-medium">Pay with Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
