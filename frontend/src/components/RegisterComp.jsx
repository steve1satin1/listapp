import { useState } from "react";
import { Mail, Eye, EyeOff, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { OtpComponent } from "./OtpComponent";
import { authapi } from "../lib/axios";

export const RegisterComp = () => {
  const [email, setEmail] = useState(null);
  const [password1, setPassword1] = useState(null);
  const [password2, setPassword2] = useState(null);
  const [passVisible1, setPassVisible1] = useState(false);
  const [passVisible2, setPassVisible2] = useState(false);
  const [verifyPage, setVerifyPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    //Check that user is not already registered
    try {
      if (!email) {
        toast.error("Please enter the required data");
        setLoading(false);
        return;
      }
      const response = await authapi.get(`/already_exists/${email}`);
      if (response.status === 226) {
        toast.error("This email already registered");
        setLoading(false);
        return;
      }

      // Check that passwords match
      if (!(password1 === password2)) {
        toast.error("Passwords doesn't much");
        setLoading(false);
        return;
      }
      setVerifyPage(true);
    } catch (error) {
      console.log(
        "Error while trying to check if user already registered: ",
        error,
      );
      toast.error("Error while trying to check if user already registered");
      setLoading(false);
      return;
    }
  };

  return (
    <div className="flex flex-col gap-5 card card-bordered border-t-primary border-t-8 bg-base-100 w-96 shadow-xl p-7 my-5">
      {verifyPage ? (
        <>
          <OtpComponent email={email} password={password1} />
        </>
      ) : (
        <>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-lg font-semibold">Email</span>
            </div>
            <label
              className={`flex items-center input input-bordered ${email === "" && "input-error"}`}
            >
              <input
                type="text"
                placeholder="example@gmail.com"
                className="grow"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail size={17} />
            </label>
            <p className={`text-red-500 ${email === "" ? "inline" : "hidden"}`}>
              email is required!
            </p>
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-lg font-semibold">
                Password #1
              </span>
            </div>
            <label
              className={`flex items-center input input-bordered ${password1 === "" && "input-error"}`}
            >
              <input
                type={passVisible1 ? "text" : "password"}
                className="grow"
                onChange={(e) => setPassword1(e.target.value)}
              />
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setPassVisible1(!passVisible1)}
              >
                {passVisible1 ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </label>
            <p
              className={`text-red-500 ${password1 === "" ? "inline" : "hidden"}`}
            >
              Password is required!
            </p>
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-lg font-semibold">
                Password #2
              </span>
            </div>
            <label
              className={`flex items-center input input-bordered ${password2 === "" && "input-error"}`}
            >
              <input
                type={passVisible2 ? "text" : "password"}
                className="grow"
                onChange={(e) => setPassword2(e.target.value)}
              />
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setPassVisible2(!passVisible2)}
              >
                {passVisible2 ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </label>
            <p
              className={`text-red-500 ${password2 === "" ? "inline" : "hidden"}`}
            >
              Password is required!
            </p>
          </label>

          <div className="flex items-center justify-center">
            <button
              className="btn btn-primary"
              disabled={
                password1 && password2 && email && !loading ? false : true
              }
              onClick={handleRegister}
            >
              {loading && <LoaderCircle className="animate-spin" />}Register
            </button>
          </div>
        </>
      )}
    </div>
  );
};
