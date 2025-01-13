import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import VoiceCall from "./Call";
import VoiceCall2 from "./VoiceCall2";
import VoiceCall3 from "./VoiceCall3";

import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import { Auth } from "../components/Auth";
import { connectWithWebSocket } from "../utils/socket";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    connectWithWebSocket();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <Auth>
              <Dashboard />
            </Auth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
