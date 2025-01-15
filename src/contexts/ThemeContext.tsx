// packages
import React, { useState, createContext, useEffect } from "react";

// types
type ThemeProps = "dark" | "light";

interface IThemeContext {
  theme: ThemeProps;
  toggleTheme(): void;
}

// types
type ThemeContextProps = {
  children: Readonly<React.ReactNode>;
};

// context
const ThemeContext = createContext<IThemeContext>({
  theme: (localStorage.getItem("theme") as ThemeProps) || "dark",
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }: ThemeContextProps) => {
  const [theme, setTheme] = useState<ThemeProps>(/* (localStorage.getItem("theme") as ThemeProps) ||  */"dark");

  useEffect(() => {
    _defineTheme(theme)
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    _defineTheme(newTheme);
  };

  const _defineTheme = (theme: ThemeProps) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);

    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
