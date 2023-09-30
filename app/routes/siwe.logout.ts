import { redirect } from "@remix-run/node";
import { storage } from "~/session.server";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await storage.getSession(
    request.headers.get("Cookie")
  );
  
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
};