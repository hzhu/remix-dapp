import { createCookieSessionStorage } from "@remix-run/node";
import type { SiweMessage } from "siwe";
import { type Theme, isTheme } from './theme-provider';
import { type Language, validateLanguage } from "~/translations.server";

const sessionSecret = process.env.SESSION_SECRET || "hullo-siwe";

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const storage = createCookieSessionStorage({
  cookie: {
    name: "remix-starter-session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

async function getSession(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));

  return {
    getNonce: () => session.get("nonce"),
    setNonce: (nonce: string) => session.set("nonce", nonce),
    getSiwe: (): SiweMessage => session.get("siwe"),
    setSiwe: (siwe: SiweMessage) => session.set("siwe", siwe),
    getTheme: () => {
      const themeValue = session.get('theme');
      return isTheme(themeValue) ? themeValue : null;
    },
    setTheme: (theme: Theme) => session.set('theme', theme),
    getLang: () => {
      const url = new URL(request.url);
      const lang = url.searchParams.get("lang");
      const sessionLang: Language = session.get("lang");

      if (validateLanguage(lang)) {
        return lang;
      } 

      if (validateLanguage(sessionLang)) {
        return sessionLang;
      } 

      return "en"
    },
    setLang: (lang: Language) => session.set("lang", lang),
    commit: () => storage.commitSession(session),
  };
}

export { getSession };
