import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@mantine/core";
import Header from "./pages/Header";
import HomePage from "./pages/HomePage";
import Onboarding from "./pages/SurveyPage";
import Upload from "./pages/UploadPage";

function App() {

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
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
