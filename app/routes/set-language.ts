import { json } from "@remix-run/node";
import { getSession } from "~/session.server";
import { validateLanguage } from "~/translations.server";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const lang = form.get("lang");

  if (validateLanguage(lang)) {
    session.setLang(lang);
  } else {
    throw new Error("Unsupported Language.");
  }

  return json(
    { success: true },
    { headers: { "Set-Cookie": await session.commit() } }
  );
};
