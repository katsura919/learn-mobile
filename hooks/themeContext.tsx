import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LightTheme, DarkTheme } from "./theme";  

const ThemeContext = createContext<any>(null);
export const useAppTheme = () => useContext(ThemeContext);

const THEME_KEY = "user-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await AsyncStorage.setItem(THEME_KEY, newTheme ? "dark" : "light");
  };

  const theme = useMemo(() => (isDark ? DarkTheme : LightTheme), [isDark]);

  useEffect(() => {
    const loadTheme = async () => {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      setIsDark(stored === "dark");
      setLoading(false);
    };
    loadTheme();
  }, []);

  if (loading) return null; 

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
