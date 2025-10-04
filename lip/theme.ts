import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#1e1e2f",  // from your --background
      paper: "#292942"     // from your --card
    },
    primary: { main: "#4e88ff" }, // example from --primary
    secondary: { main: "#3a3a55" },
    text: { primary: "#f2f2f2", secondary: "#cfcfcf" },
  },
  shape: { borderRadius: 8 },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1e1e2f",
      paper: "#292942",
    },
    primary: { main: "#4e88ff" },
    secondary: { main: "#3a3a55" },
    text: { primary: "#f2f2f2", secondary: "#cfcfcf" },
  },
  shape: { borderRadius: 8 },
});
