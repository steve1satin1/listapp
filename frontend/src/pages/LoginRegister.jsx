import { LoginRegisterComp } from "../components/LoginRegisterComp";

export const LoginRegister = ({ setIsLoggedIn }) => {
  return (
    <div className="flex justify-center py-20">
      <LoginRegisterComp setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
};
