import clsx from "clsx";
import { useState } from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import {
  darkTheme,
  lightTheme,
  getDefaultWallets,
  RainbowKitProvider,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";
import { getSession } from "~/session.server";
import { useSignInWithEthereum } from "./hooks/useSignInWithEthereum";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import {
  useTheme,
  ThemeProvider,
  NonFlashOfWrongThemeEls,
  type Theme,
} from "./theme-provider";

import rainbowStylesUrl from "@rainbow-me/rainbowkit/styles.css";
import stylesheet from "~/tailwind.css";

type Env = { WALLET_CONNECT_PROJECT_ID: string };

type LoaderData = { ENV: Env; serverSideTheme: Theme | null };

export const meta: MetaFunction = () => {
  return [
    { charset: "utf-8" },
    { title: "Remix dApp Starter" },
    { name: "viewport", content: "width=device-width" },
    { name: "description", content: "A starter project using Remix" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: rainbowStylesUrl },
  { rel: "stylesheet", href: stylesheet },
];

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getSession(request);

  const data: LoaderData = {
    ENV: { WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID! },
    serverSideTheme: themeSession.getTheme(),
  };

  return json(data);
};

function App() {
  const [theme] = useTheme();
  const { ENV, serverSideTheme } = useLoaderData<LoaderData>();
  const { state, dispatch, authenticationAdapter } = useSignInWithEthereum();

  const [{ config, chains }] = useState(() => {
    const { chains, publicClient } = configureChains(
      [mainnet, polygon, optimism, arbitrum, base],
      [publicProvider()]
    );

    const { connectors } = getDefaultWallets({
      appName: "Remix dApp Starter",
      projectId: ENV.WALLET_CONNECT_PROJECT_ID,
      chains,
    });

    const config = createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    });

    return { config, chains };
  });

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(serverSideTheme)} />
        <Meta />
        <Links />
      </head>
      <body className="p-5 md:p-10 lg:p-12 bg-yellow-50 dark:bg-slate-800 text-slate-800 dark:text-yellow-50">
        {config && chains.length ? (
          <WagmiConfig config={config}>
            <RainbowKitAuthenticationProvider
              adapter={authenticationAdapter}
              status={state.authenticationStatus}
            >
              <RainbowKitProvider
                coolMode
                chains={chains}
                modalSize="compact"
                theme={
                  theme === "light"
                    ? lightTheme({
                        accentColor: "#1e293b",
                        borderRadius: "small",
                        accentColorForeground: "#fefce8",
                      })
                    : darkTheme({
                        accentColor: "#fefce8",
                        borderRadius: "small",
                        accentColorForeground: "#1e293b",
                      })
                }
              >
                <Outlet context={{ state, dispatch }} />
              </RainbowKitProvider>
            </RainbowKitAuthenticationProvider>
          </WagmiConfig>
        ) : null}
        <ScrollRestoration />
        <Scripts />
        <LiveReload timeoutMs={2000} />
      </body>
    </html>
  );
}

export default function AppWithTheme() {
  const { serverSideTheme } = useLoaderData<LoaderData>();

  return (
    <ThemeProvider specifiedTheme={serverSideTheme}>
      <App />
    </ThemeProvider>
  );
}
