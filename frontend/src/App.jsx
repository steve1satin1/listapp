import { Route, Routes, useNavigate } from "react-router";
import { HomePage } from "./pages/HomePage";
import { CreateNote } from "./pages/CreateNote";
import { DetailsNote } from "./pages/DetailsNote";
import { NavBar } from "./components/NavBar";
import { LoginRegister } from "./pages/LoginRegister";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import api from "./lib/axios.js";
import toast from "react-hot-toast";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLoggedIn() {
      try {
        const response = await api.get("/logged_in");

        if (response.status === 200) {
          setIsLoggedIn(true);
          console.log("is logged in inside if: ", isLoggedIn);
        }
      } catch (error) {
        console.log("Error at app: ", error);

        if (error.status === 429) {
          toast("Rate limit reached try again at 5 minutes.", { icon: "⌛" });
          setIsLoggedIn(true);
        } else {
          toast("Please Log in or Register to view your notes.");
        }
      }
    }
    checkLoggedIn();
    console.log("Is logged in: ", isLoggedIn);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 h-screen w-screen bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#0d9488_100%)]">
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
        <Route path="/create" element={<CreateNote />} />
        <Route path="/details/:id" element={<DetailsNote />} />
        <Route
          path="/login_register"
          element={<LoginRegister setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
