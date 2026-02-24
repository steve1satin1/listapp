import { LoginComp } from "./LoginComp";
import { RegisterComp } from "./RegisterComp";

export const LoginRegisterComp = ({ setIsLoggedIn }) => {
  return (
    <div role="tablist" className="tabs tabs-lifted w-fit">
      <input
        type="radio"
        name="tab_choice"
        role="tab"
        className="tab text-xl font-bold"
        aria-label="Login"
        defaultChecked
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <LoginComp setIsLoggedIn={setIsLoggedIn} />
      </div>

      <input
        type="radio"
        name="tab_choice"
        role="tab"
        className="tab text-xl font-bold"
        aria-label="Register"
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <RegisterComp />
      </div>
    </div>
  );
};
