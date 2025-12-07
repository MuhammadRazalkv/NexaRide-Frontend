import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStatus } from "@/api/auth/driver";

const DVerificationPending = () => {
  const driver = useSelector((state: RootState) => state.driverAuth.driver);
  const navigate = useNavigate();
  useEffect(() => {
    window.history.replaceState(null, "", window.location.href);
    if (!driver) {
      navigate("/");
    }
  }, [navigate, driver]);
  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const res = await getStatus();
        if (!isMounted) return;

        const { driverStatus, vehicleStatus } = res;

        if (driverStatus === "approved" && vehicleStatus === "approved")
          navigate("/driver/ride");
        else if (driverStatus === "rejected") navigate("/driver/rejected");
        else if (vehicleStatus === "rejected")
          navigate("/driver/vehicle-rejected");
      } catch {
        localStorage.clear();
        navigate("/driver/login");
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [navigate]);
  const handleClick = () => {
    const supportEmail = "nexaridee@gmail.com";

    const subject = encodeURIComponent(
      "NexaRide Support - Signup Verification Assistance"
    );

    const body = encodeURIComponent(
      `Hello NexaRide Support Team,

I'm reaching out regarding my pending account verification. I submitted my signup details, but my account is still awaiting approval and I would appreciate your assistance.

Account Details:
Name: ${driver?.name}
Signup Email: ${driver?.email}
Phone Number:
Vehicle Registration Number:
Submission Date:

Issue Description:
(Please briefly describe the problem or any additional information that may help.)

Thank you for your support.

Kind regards,`
    );

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${supportEmail}&su=${subject}&body=${body}`,
      "_blank"
    );
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="font-primary text-3xl text-black">NexaDrive</h1>

        {/* Greeting & Verification Message */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          Hi {driver?.name}, <br />
          Your verification is in progress 🚧
        </h2>

        <p className="text-gray-600 mt-3">
          Our team is currently reviewing your submitted details, including your
          driver information and vehicle documents. This process typically takes
          <span className="font-semibold"> 24–48 hours</span>.
        </p>

        {/* Information Message */}
        <p className="text-gray-500 text-sm mt-4">
          You will receive an email notification as soon as your account is
          approved.
        </p>

        {/* Support Guidance */}
        <p className="text-gray-500 text-sm mt-3">
          If you have been waiting longer than 48 hours or believe any
          information may be incorrect, you can contact our support team for
          assistance.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default DVerificationPending;
