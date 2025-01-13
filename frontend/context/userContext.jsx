// create a react context to set and get user name
import React, { createContext, useState } from "react";

export const UserContext = createContext();

function AppProvider({ children }) {
  const [userName, setUserName] = useState("");

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
}

export default AppProvider;
