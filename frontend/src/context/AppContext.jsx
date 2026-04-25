import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [userData, setUserDataState] = useState({});
  const [syllabusTitle, setSyllabusTitle] = useState(null);
  const [plan, setPlan] = useState(null);

  const setUserData = (a) => setUserDataState((prev) => ({ ...prev, ...a }));

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
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
