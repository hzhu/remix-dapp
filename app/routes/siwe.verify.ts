import { json } from "@remix-run/node";
import { SiweMessage } from "siwe";
import { getSession } from "~/session.server";

import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);
  const nonce = session.getNonce();
  const { message, signature } = await request.json();
  const siweMessage = new SiweMessage(message);
  const { data } = await siweMessage.verify({ signature });

  return nonce !== data.nonce
    ? json({ message: "Invalid nonce." }, { status: 422 })
    : json(
        { success: true },
        { headers: { "Set-Cookie": await session.commit() } }
      );
};
