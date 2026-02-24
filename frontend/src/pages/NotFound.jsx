import { ChevronLeft } from "lucide-react";
import { NavLink } from "react-router";

const NotFound = () => {
  return (
    <div className="bg-base-100 flex justify-center items-start my-11">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-primary">404</h1>
          <h1 className="text-5xl font-bold">Page Not Found</h1>
          <p className="py-6 text-2xl font-medium text-grey-500 text-pretty">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <NavLink to="/" end>
            <button className="btn btn-primary text-lg group glass">
              <ChevronLeft className="group-hover:pr-2" /> Home
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
