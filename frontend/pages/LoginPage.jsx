import React, { useState } from "react";
import { UserContext } from "../context/userContext";
import { Link, useNavigate } from "react-router-dom";
import { registerNewUser } from "../utils/socket";

export const LoginPage = () => {
  const { userName, setUserName } = React.useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div>
      <input
        type="text"
        value={userName}
        className="border-2 p-2 rounded-md focus:outline-none"
        autoFocus
        required
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter your name"
      />
      <button
        onClick={() => {
          registerNewUser(userName);
          navigate("/dashboard", { replace: true }); // navigate to call page with replace history state
        }}
        className=" button-primary"
      >
        Start
      </button>
    </div>
  );
};
