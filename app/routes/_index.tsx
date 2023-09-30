import { useChainId } from "wagmi";
import { json } from "@remix-run/node";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useFetcher,
  useLoaderData,
  useSearchParams,
  useOutletContext,
} from "@remix-run/react";
import { RemixLogo, EthereumLogo, LanguageSelect } from "~/components";
import { Theme, useTheme } from "~/theme-provider";
import { getSession } from "~/session.server";
import { getTranslations } from "~/translations.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ReducerState } from "~/hooks/useSignInWithEthereum";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request);
  const language = session.getLang();
  const translations = getTranslations(language, [
    "Sign In", // Full i18n coming soon. See: https://github.com/rainbow-me/rainbowkit/pull/1534
    "Select a language",
    "Switch to dark mode.",
    "Switch to light mode.",
    "Welcome to Remix dApp starter kit! Please sign in and verify with Ethereum.",
    "Welcome to Remix dApp starter kit! You have securely signed in with Ethereum.",
  ]);

  return json({ language, translations });
};

export default function Index() {
  useChainId(); // required for LiveReload to work in development
  const fetcher = useFetcher();
  const [theme, setTheme] = useTheme();
  const { 1: setSearchParams } = useSearchParams();
  const { state } = useOutletContext<{ state: ReducerState }>();
  const { language, translations } = useLoaderData<typeof loader>();
  const toggleTheme = () =>
    setTheme((previousTheme) =>
      previousTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  const setLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ lang: e.target.value });
    fetcher.submit(
      // See: this issue for console.log warning https://github.com/remix-run/remix/issues/7497
      { lang: e.target.value },
      { action: "set-language", method: "post" }
    );
  };

  return (
    <>
      <div>
        <div className="flex justify-end">
          <ConnectButton label={translations["Sign In"]} />
        </div>
        <div className="my-2 md:my-3 flex justify-end items-center">
          <input
            type="checkbox"
            id="theme-toggle"
            onChange={toggleTheme}
            checked={theme === "dark"}
          />
          <label
            htmlFor="theme-toggle"
            className="pl-2 text-lg select-none	cursor-pointer"
          >
            <span className="sr-only">
              {theme === "light"
                ? translations["Switch to dark mode."]
                : translations["Switch to light mode."]}
            </span>
            <span aria-hidden="true">
              {theme === "light" ? "☀️" : "🌙"}
            </span>
          </label>
        </div>
        <div className="mb-3 flex justify-end">
          <LanguageSelect
            language={language}
            onChange={setLanguage}
            label={translations["Select a language"]}
          />
        </div>
      </div>
      <div className="flex justify-center items-center m-8">
        <EthereumLogo />
        <div className="font-bold m-3">+</div>
        <RemixLogo />
      </div>
      <div className="text-center">
        {state.authenticationStatus === "authenticated"
          ? translations[
              "Welcome to Remix dApp starter kit! You have securely signed in with Ethereum."
            ]
          : translations[
              "Welcome to Remix dApp starter kit! Please sign in and verify with Ethereum."
            ]}
      </div>
    </>
  );
}
