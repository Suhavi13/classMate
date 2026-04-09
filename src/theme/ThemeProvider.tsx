import React, { createContext, useContext, ReactNode } from 'react';
import { Colors, Spacing, Typography } from './theme';
interface ThemeContextType {
  colors: typeof Colors;
  spacing: typeof Spacing;
  typography: typeof Typography;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const themeValue = {
    colors: Colors,
    spacing: Spacing,
    typography: Typography,
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};