//  import { useLanguage } from "./core/hooks/useLanguage";
import LoginPage from './features/auth/presentation/pages/login_page';
function App() {
  //  const { locale, toggleLocale } = useLanguage();

  return (
    <>
      <div className="App">
      <LoginPage />
    </div>
    </>
  );
}

export default App;
