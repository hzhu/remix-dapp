import { json } from "@remix-run/node";
import { generateNonce } from "siwe";
import { getSession } from "~/session.server";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const nonce = generateNonce();
  session.setNonce(nonce);

  return json({ nonce }, { headers: { "Set-Cookie": await session.commit() } });
};
