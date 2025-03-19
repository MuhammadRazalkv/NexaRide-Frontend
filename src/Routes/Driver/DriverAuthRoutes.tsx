import { Navigate } from "react-router-dom";
import { useSignup } from "../../Hooks/useSignup";

const ProtectedRouteDriverAuth = ({ element, requiredStep }: { element: JSX.Element; requiredStep: number }) => {
    const { step, isGoogleAuth } = useSignup();

    // Skip OTP if user signed up using Google
    if (requiredStep === 2 && isGoogleAuth) {
      return <Navigate to="/addInfo" replace />;
    }
  

  return step >= requiredStep ? element : <Navigate to="/driver/signup" replace />;
};

export default ProtectedRouteDriverAuth;
