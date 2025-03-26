import { theme } from "@/styles/theme";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import "@styles/globals.css";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router";

export default function RootLayout() {
	console.timeLog("load", "root layout");
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript />
      </head>


      <body style={{ backgroundColor: theme.white }}>
        <ErrorBoundary fallback={<span>Something went wrong in rootlayout</span>}>
        <MantineProvider theme={theme}>
          <Outlet />
        </MantineProvider>
        </ErrorBoundary>
      </body>
      </>
  );
}


