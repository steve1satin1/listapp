import { useEffect, useRef, useState } from "react";
import { authapi } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { LoaderCircle } from "lucide-react";

export const OtpComponent = ({ email, password }) => {
  const [otpCode, setOtpCode] = useState(new Array(6).fill(""));
  const [seconds, setSeconds] = useState(120);
  const [loading, setLoading] = useState(false);

  const refs = useRef(new Array(6).fill(null));

  let navigate = useNavigate();

  useEffect(() => {
    // Send OTP
    async function sendOtp() {
      try {
        await authapi.post("/generate_otp", {
          email: email,
        });
      } catch (error) {
        console.log("Error at useEffect hook of OtpComp: ", error);
      }
    }

    const timer = setInterval(() => {
      if (seconds === 120) {
        console.log("send otp");
        sendOtp();
      }
      if (seconds >= 0) {
        setSeconds(seconds - 1);
      } else {
        clearInterval(timer);
        return 0;
      }
    }, 1000);
    return () => clearInterval(timer);
  });

  const formatTime = (time) => {
    const mins = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const secs = (time % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  async function handleVerify() {
    console.log(`email: ${email}\npassword: ${password}\notp: ${otpCode}`);
    try {
      setLoading(true);
      // Call register endpoint
      await authapi.post("/register", {
        email: email,
        password1: password,
        password2: password,
        otp: otpCode.join(""),
      });
      toast.success("Registered successfully, Please Login in");
      navigate("/");
      setLoading(true);
    } catch (error) {
      setLoading(false);
      console.log("Error while trying to login ", error);
      toast.error("Wrong OTP Code");
    }
  }

  const isEmpty = (myarray) => {
    for (let item of myarray) {
      if (!item) {
        return true;
      }
    }
    return false;
  };

  return (
    <>
      <h1 className="text-lg font-medium">
        We have sent an OTP code at {email}
      </h1>
      <h3>
        OTP Code{" "}
        {seconds > 0 ? `expires at ${`${formatTime(seconds)}`}` : "expired"}
      </h3>
      <div className="grid grid-cols-6">
        {otpCode.map((_, index) => {
          return (
            <input
              type="tel"
              maxLength={1}
              className="border border-gray-500 w-10 h-10 text-center"
              key={index}
              ref={(el) => (refs.current[index] = el)}
              onKeyUp={(e) => {
                if (e.key === "Backspace") {
                  refs.current[index > 0 ? index - 1 : index].focus();
                } else {
                  refs.current[index < 5 ? index + 1 : index].focus();
                }
              }}
              onChange={(e) => {
                otpCode[index] = e.target.value;
                setOtpCode(otpCode);
              }}
            />
          );
        })}
      </div>
      <div className="flex justify-between">
        <button
          className="btn btn-neutral text-lg"
          disabled={seconds > 0}
          onClick={() => setSeconds(120)}
        >
          re-send
        </button>
        <button
          className="btn btn-primary text-lg"
          onClick={handleVerify}
          disabled={isEmpty(otpCode) || loading}
        >
          {loading && <LoaderCircle className="animate-spin" />}Verify
        </button>
      </div>
    </>
  );
};
