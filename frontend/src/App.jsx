import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell, MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import Header from "./pages/Header";
import HomePage from "./pages/HomePage";
import Onboarding from "./pages/SurveyPage";
import Upload from "./pages/UploadPage";
import Dashboard from "./pages/Dashboard";

const theme = createTheme({
  fontFamily: "Inter, sans-serif",
  headings: {
    fontFamily: "Fraunces, serif",
  },
  colors: {
    // Mapping your custom CSS variables into the Mantine color system
    brand: [
      "var(--parchment)",
      "var(--secondary)",
      "var(--muted)",
      "var(--border)",
      "var(--highlight)",
      "var(--accent)",
      "var(--primary)", // brand[6] is the default "filled" color
      "var(--ink)",
      "var(--ink)",
      "var(--ink)",
    ],
  },
  primaryColor: "brand",
  defaultRadius: "md",
});

function App() {
  return (
    <MantineProvider theme={theme}>
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
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </AppShell.Main>
        </AppShell>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
