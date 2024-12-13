// packages
import { useContext } from "react";
import { Sun, Moon } from "lucide-react";

// contexts
import { ThemeContext } from "@/contexts/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="relative w-16 h-8 flex items-center bg-primary dark:bg-gray-700 cursor-pointer rounded-full p-1" onClick={toggleTheme}>
      <Moon className="size-4 text-white" />

      <div className="absolute bg-primary dark:bg-gray-700 brightness-150 dark:brightness-200 w-6 h-6 rounded-full shadow-md transform transition-transform duration-500" style={theme === "dark" ? { left: "4px" } : { right: "4px" }}></div>

      <Sun className="size-4 ml-auto text-white" />
    </div>
  );
};

export default ThemeToggle;
