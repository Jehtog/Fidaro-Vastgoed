import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "./pages/Landing";
import Success from "./pages/Success";
import Admin from "./pages/Admin";
import { LanguageProvider } from "./contexts/LanguageContext";
import CookieBanner from "./components/CookieBanner";

function App() {
  useEffect(() => {
    document.title = "Fidaro Vastgoed — Valideer voordat je investeert";
  }, []);

  return (
    <div className="App">
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/success" element={<Success />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <CookieBanner />
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </LanguageProvider>
    </div>
  );
}

export default App;
