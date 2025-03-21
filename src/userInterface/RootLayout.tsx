import { theme } from "@/styles/theme";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import '@mantine/core/styles.css';
import "@styles/globals.css";
import { Outlet } from "react-router";

export default function RootLayout() {
  console.log("rendering rootlayout")
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>

      <body style={{ backgroundColor: theme.white }}>
        <MantineProvider theme={theme}>
          <Outlet />
        </MantineProvider>
      </body>
    </html>
  );
}


