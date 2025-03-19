import Loader from "../../../components/Loader";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const DVerificationPending = () => {
  const driver = useSelector((state: RootState) => state.driverAuth.driver);
  const navigate = useNavigate()
  console.log('Driver ',driver);
  useEffect(() => {
    window.history.replaceState(null, "", window.location.href);
    if (!driver) {
      navigate('/')
    }
  },[navigate,driver]);
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
  
        <h1 className="font-primary text-3xl text-black">NexaDrive</h1>


        {/* Loader Animation */}
        <div className="flex justify-center mt-5">
          <Loader />
        </div>

        {/* Greeting & Verification Message */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          Hi {driver?.name}, <br /> Your Verification is Pending 🚧
        </h2>
        <p className="text-gray-600 mt-2">
          Our team is reviewing your documents. This process usually takes <span className="font-semibold">24-48 hours.</span>
        </p>

       
     

        {/* Information Message */}
        <p className="text-gray-500 text-sm mt-4">
          You will receive an email once your verification is complete.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            // onClick={() => navigate("/contact-support")}
          >
            Contact Support
          </button>
          
        </div>
      </div>
    </div>
  );
  
};

export default DVerificationPending;
