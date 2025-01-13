import React, { useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";

export const Auth = ({ children }) => {
  const { userName } = React.useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userName) {
      return navigate("/");
    }
  }, [userName]);

  return <div>{children}</div>;
};
