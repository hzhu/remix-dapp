import type { Locale } from "@rainbow-me/rainbowkit";

export type Language = "en" | "es" | "fr" | "ko";

export const languages = ["en", "es", "fr", "ko"] as const;

export const localesByShortForm: Record<string, Locale> = {
  en: "en-US",
  ko: "ko-KR",
  es: "es-419",
  fr: "fr-FR",
};

export function validateLanguage(language: any): language is Language {
  return languages.includes(language);
}

export function getTranslations<
  RequestedTranslations extends keyof Translations
>(lang: Language, requestedTranslations: Array<RequestedTranslations>) {
  let results: Record<RequestedTranslations, string> = {} as any;

  for (let translation of requestedTranslations) {
    results[translation] = translations[translation][lang];
  }

  return results;
}

type Translations = typeof translations;

export type PickTranslations<TranslationKeys extends keyof Translations> =
  Record<TranslationKeys, string>;

const translations = {
  "Sign In": {
    en: "Sign In",
    es: "Iniciar sesión",
    fr: "Se connecter",
    ko: "로그인",
  },
  "Select a language": {
    en: "Select a language",
    es: "Selecciona un idioma",
    fr: "Sélectionnez une langue",
    ko: "언어 선택",
  },
  "Switch to light mode.": {
    en: "Switch to light mode.",
    es: "Cambiar a modo claro.",
    fr: "Passer en mode clair.",
    ko: "밝은 모드로 전환하세요.",
  },
  "Switch to dark mode.": {
    en: "Switch to dark mode.",
    es: "Cambiar a modo oscuro.",
    fr: "Passer en mode sombre.",
    ko: "어두운 모드로 전환하세요.",
  },
  "Welcome to Remix dApp starter kit! Please sign in and verify with Ethereum.":
    {
      en: "Welcome to Remix dApp starter kit! Please sign in and verify with Ethereum.",
      es: "¡Bienvenido al kit de inicio de Remix dApp! Por favor, inicia sesión y verifica con Ethereum.",
      fr: "Bienvenue dans le kit de démarrage Remix dApp! Veuillez vous connecter et vérifier avec Ethereum.",
      ko: "Remix dApp 스타터 키트에 오신 것을 환영합니다! 이더리움으로 로그인하시고 인증해 주세요.",
    },

  "Welcome to Remix dApp starter kit! You have securely signed in with Ethereum.":
    {
      en: "Welcome to Remix dApp starter kit! You have securely signed in with Ethereum.",
      es: "Bienvenido al kit de inicio de Remix dApp, has iniciado sesión de forma segura con Ethereum.",
      fr: "Bienvenue dans le kit de démarrage Remix dApp, vous vous êtes connecté en toute sécurité avec Ethereum.",
      ko: "Remix dApp 스타터 키트에 오신 것을 환영합니다, 이더리움으로 안전하게 로그인하셨습니다.",
    },
};
