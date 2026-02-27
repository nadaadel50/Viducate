import { FormattedMessage } from "react-intl";
import { useLanguage } from "./core/hooks/useLanguage";

function App() {
  const { locale, toggleLocale } = useLanguage();

  return (
    <>
      <button
        onClick={toggleLocale}
        className="px-4 py-2 rounded-lg border border-gray-300">
        {locale === "en" ? "العربية" : "English"}
      </button>

      <h1 className="text-blue-600">
        <FormattedMessage id="title" />
      </h1>
    </>
  );
}

export default App;
