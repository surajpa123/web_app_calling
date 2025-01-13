import React, { useEffect } from "react";
import { UserContext } from "../context/userContext";

const Dashboard = () => {
  const { userName } = React.useContext(UserContext);

  useEffect(()=>{

    console.log("rendered")

  },[])
  return (
    <div>
      <h1>Welcome {userName}!</h1>
      <p>This is your dashboard.</p>
    </div>
  );
};

export default Dashboard;
