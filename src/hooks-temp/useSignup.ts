import { useContext , createContext } from "react";

type SignupContextType = {
    step: number;
    completeStep: (stepNumber: number) => void;
    isGoogleAuth: boolean;
    setGoogleAuth: (status: boolean) => void;
  };

export const SignupContext = createContext<SignupContextType | undefined>(undefined);


export const useSignup = () => {
    const context = useContext(SignupContext);
    if (!context) {
        throw new Error("useSignup must be used within a SignupProvider");
    }
    return context;
};