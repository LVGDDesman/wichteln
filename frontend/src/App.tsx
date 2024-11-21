import "./App.css";
import Login from "./pages/login/Login";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import DeLocale from "./locales/de.json";
import DeppLocale from "./locales/depp.json";
import { HappyNeutralEmoticonButton } from "./components/button/HappyNeutralEmoticonButton";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RedirectToLogin } from "./pages/RedirectToLogin";
import Register from "./pages/login/Register";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      de: DeLocale,
      depp: DeppLocale,
    },
    lng: "de",
    fallbackLng: "de",

    interpolation: {
      escapeValue: false,
    },
  });

function App() {
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<RedirectToLogin />} />
      </Routes>
      <footer className="h-10 flex justify-end">
        <HappyNeutralEmoticonButton
          onToggle={(toggled) => i18n.changeLanguage(toggled ? "depp" : "de")}
        />
      </footer>
    </BrowserRouter>
  );
}

export default App;
