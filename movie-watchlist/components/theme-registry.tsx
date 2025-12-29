import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ColorModeContextType = {
  toggleColorMode: () => void;
  mode: "light" | "dark";
};

const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: "dark",
});

export const useColorMode = () => useContext(ColorModeContext);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedMode = localStorage.getItem("theme-mode") as "light" | "dark";
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme-mode", mode);
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
      {children}
    </ColorModeContext.Provider>
  );
}
