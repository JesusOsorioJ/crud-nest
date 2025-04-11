import { useTranslation } from "react-i18next";
import "../config/i18n";

function Language() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const currentLanguage = i18n.language;

  return (
    <div className="flex gap-6 items-center">
      <div className="flex border border-black rounded-lg overflow-hidden">
        <button
          onClick={() => changeLanguage("es")}
          className={`p-2 px-4 font-semibold transition-colors ${
            currentLanguage === "en"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          Español
        </button>
        <button
          onClick={() => changeLanguage("en")}
          className={`p-2 px-4 font-semibold transition-colors ${
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
        className="p-2 px-4 bg-red-500 text-white rounded-lg transition-colors uppercase"
      >
        {t("logout")}
      </button>
    </div>
  );
}

export default Language;
