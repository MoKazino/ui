import { loggedIn, updateProfile } from "../stores"; // stores related to app state, auth state
import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/internal";
import { browser } from "$app/env";

let isLoggedIn = false;
loggedIn.subscribe((state) => isLoggedIn = state);

const protectedPaths = [
  "./game",
  "./deposit",
  "./withdraw",
  "./invest",
  "./login",
  "./invite-friends",
];

export async function routeGuard(
  { url }: Partial<LoadInput>,
): Promise<LoadOutput> {
  if (!browser) return {};

  if (
    !isLoggedIn &&
    (
      url!.searchParams.get("login") === "" ||
      protectedPaths.includes(url!.pathname)
    )
  ) {
    await updateProfile();
  }

  if (isLoggedIn) {
    if (url!.pathname === "./login") {
      return { status: 302, redirect: "./" };
    }

    return {};
  }

  if (url?.pathname !== "./login" && url?.pathname !== "./") {
    return { status: 302, redirect: "./login" };
  }

  return {};
}
