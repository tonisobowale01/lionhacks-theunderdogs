import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@mantine/core";
import Header from "./pages/Header";
import HomePage from "./pages/HomePage";
import Onboarding from "./pages/SurveyPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <AppShell header={{ height: 80 }} padding="md">
        <AppShell.Header p="xs">
          <Header />
        </AppShell.Header>
        <AppShell.Main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/onboarding" element={<Onboarding />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
