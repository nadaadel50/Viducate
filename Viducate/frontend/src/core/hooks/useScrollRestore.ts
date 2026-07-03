import { useEffect } from "react";

export function useScrollRestore() {
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll);

    const savedPosition = sessionStorage.getItem("scrollPosition");

    if (savedPosition) {
      window.scrollTo(0, Number(savedPosition));
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}
