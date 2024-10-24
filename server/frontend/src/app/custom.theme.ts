"use client"

import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";

const customTheme = createTheme({
  palette: {
    background: {
      default: green[900],
    },
  },
});

export default customTheme;
