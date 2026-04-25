import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [syllabusTitle, setSyllabusTitle] = useState("");
  const [plan, setPlan] = useState(null);

  return (
    <AppContext.Provider
      value={{
        userData,
        setUserData,
        syllabusTitle,
        setSyllabusTitle,
        plan,
        setPlan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  return useContext(AppContext);
};
