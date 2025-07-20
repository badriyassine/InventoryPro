import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import VerifyCode from "./VerifyCode";
import ResetPassword from "./ResetPassword";

const ForgotFlow = ({ onBackToLogin }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  return (
    <div>
      {step === 1 && (
        <ForgotPassword
          onCodeSent={(e) => {
            setEmail(e);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <VerifyCode
          email={email}
          onVerified={(c) => {
            setCode(c);
            setStep(3);
          }}
        />
      )}
      {step === 3 && (
        <ResetPassword
          email={email}
          code={code}
          onDone={() => {
            alert("Password reset. You can now log in.");
            if (onBackToLogin) onBackToLogin();
          }}
        />
      )}
    </div>
  );
};

export default ForgotFlow;
