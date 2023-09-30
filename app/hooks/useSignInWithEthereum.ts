import { SiweMessage } from "siwe";
import { useRef, useEffect, useReducer } from "react";
import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import type { AuthenticationStatus } from "@rainbow-me/rainbowkit";

export interface ReducerState {
  authenticationStatus: AuthenticationStatus;
}

type ActionTypes = {
  type: "set auth status";
  payload: AuthenticationStatus;
};

const initialState: ReducerState = { authenticationStatus: "loading" };

function reducer(
  state: ReducerState,
  action: ActionTypes
): ReducerState {
  switch (action.type) {
    case "set auth status":
      return { ...state, authenticationStatus: action.payload };
    default:
      throw new Error();
  }
}

export function useSignInWithEthereum(statement?: string) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authenticationAdapterRef = useRef(
    createAuthenticationAdapter({
      getNonce: async () => {
        const response = await fetch("/siwe/nonce");
        const { nonce } = await response.json();
        return nonce;
      },
      createMessage: ({ nonce, address, chainId }) => {
        return new SiweMessage({
          domain: window.location.host,
          address,
          statement: statement || "Sign in with Ethereum.",
          uri: window.location.origin,
          version: "1",
          chainId,
          nonce,
        });
      },
      getMessageBody: ({ message }) => {
        return message.prepareMessage();
      },
      verify: async ({ message, signature }) => {
        const verifyRes = await fetch("/siwe/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, signature }),
        });
        dispatch({ type: "set auth status", payload: "authenticated" });
        return Boolean(verifyRes.ok);
      },
      signOut: async () => {
        await fetch("/siwe/logout");
        dispatch({ type: "set auth status", payload: "unauthenticated" });
      },
    })
  );

  const timerIdRef = useRef<number>();
  // Fetch user when:
  useEffect(() => {
    const timerId = timerIdRef.current;
    const handler = async () => {
      try {
        const res = await fetch("/siwe/me");
        const json = await res.json();
        if (json.address) {
          dispatch({ type: "set auth status", payload: "authenticated" });
        } else {
          dispatch({ type: "set auth status", payload: "unauthenticated" });
        }
      } catch (_error) {
        dispatch({ type: "set auth status", payload: "unauthenticated" });
      }
    };
    // Page loads
    handler();

    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener("focus", handler);
    };
  }, []);

  return {
    state,
    dispatch,
    authenticationAdapter: authenticationAdapterRef.current,
  };
}
