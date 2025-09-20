import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { THEME_KEY } from "../constants/constans";

export const useTheme = () => {
  const [theme, setThemeState] = useLocalStorage(THEME_KEY, "system");

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (themeValue) => {
    const root = document.documentElement;

    if (themeValue === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", isDark);
    } else {
      root.classList.toggle("dark", themeValue === "dark");
    }
  };

  useEffect(() => {
    applyTheme(theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return [theme, setTheme];
};
