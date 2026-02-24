import { useState } from "react";
import { Mail, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { authapi } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";

export const LoginComp = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [passVisible, setPassVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await authapi.post("/login", {
        email: email,
        password: password,
      });
      setIsLoggedIn(true);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      console.log("Error while trying to login ", error);
      toast.error("Wrong email or password");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    try {
      await authapi.post("/google_auth", {
        credential: credentialResponse.credential,
        client_id: credentialResponse.clientId,
      });
      setIsLoggedIn(true);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      console.log("Error while trying to login with google ", error);
      toast.error("Error while to log in with Google");
    }
  };

  return (
    <div className="flex flex-col gap-5 card card-bordered border-t-primary border-t-8 bg-base-100 w-96 shadow-xl p-7 my-5">
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
          <span className="label-text text-lg font-semibold">Password</span>
        </div>
        <label
          className={`flex items-center input input-bordered ${password === "" && "input-error"}`}
        >
          <input
            type={passVisible ? "text" : "password"}
            className="grow"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setPassVisible(!passVisible)}
          >
            {passVisible ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </label>
        <p className={`text-red-500 ${password === "" ? "inline" : "hidden"}`}>
          Password is required!
        </p>
      </label>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          handleGoogleLogin(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
          toast.error("Error while trying to log in with Google");
          navigate("/");
        }}
        shape="circle"
        theme="filled_blue"
      />

      <div className="flex items-center justify-center">
        <button
          className="btn btn-primary"
          disabled={password && email && !loading ? false : true}
          onClick={handleLogin}
        >
          {loading && <LoaderCircle className="animate-spin" />}Log in
        </button>
      </div>
    </div>
  );
};
