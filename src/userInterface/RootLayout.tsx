import { theme } from "@/styles/theme";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import "@styles/globals.css";
import { Outlet } from "react-router";

export default function RootLayout() {
  console.log("rendering rootlayout")
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript />
      </head>


      <body style={{ backgroundColor: theme.white }}>
        <MantineProvider theme={theme}>
          <Outlet />
        </MantineProvider>
      </body>
      </>
  );
}


