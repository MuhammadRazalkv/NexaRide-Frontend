import { useState } from "react";
import { SignupContext } from "../hooks/useSignup";

export const SignupProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState<number>(
    () => Number(localStorage.getItem("signupStep")) || 1
  );
  const [isGoogleAuth, setIsGoogleAuth] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem("isGoogleAuth") || "false")
  );

  const completeStep = (stepNumber: number) => {
    setStep(stepNumber);
    localStorage.setItem("signupStep", stepNumber.toString());
  };

  const setGoogleAuth = (status: boolean) => {
    setIsGoogleAuth(status);
    localStorage.setItem("isGoogleAuth", JSON.stringify(status));
    if (status) {
      completeStep(3);
    }
  };

  return (
    <SignupContext.Provider
      value={{ step, completeStep, isGoogleAuth, setGoogleAuth }}
    >
      {children}
    </SignupContext.Provider>
  );
};
