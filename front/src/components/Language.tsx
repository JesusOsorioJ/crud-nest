import { useTranslation } from "react-i18next";
import "../config/i18n";

function Language() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const currentLanguage = i18n.language;

  return (
    <div className="flex gap-6 items-center">
      <div>
        <button
          onClick={() => changeLanguage("es")}
          className={`p-[6px] rounded-l-lg ${
            currentLanguage === "en"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          Español
        </button>
        <button
          onClick={() => changeLanguage("en")}
          className={`p-[6px] rounded-r-lg ${
            currentLanguage === "es"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          English
        </button>
      </div>
      <button
        onClick={() => {
          localStorage.removeItem("access_token");

          localStorage.removeItem("refresh_token");

          window.location.href = "/login";
        }}
        className={`p-[8px] rounded-lg bg-black text-white`}
      >
        Logout
      </button>
    </div>
  );
}

export default Language;
