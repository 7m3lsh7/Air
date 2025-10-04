"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { useState } from "react";
import { lightTheme, darkTheme } from "@/lip/theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
