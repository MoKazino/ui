import { type Writable, writable } from "svelte/store";

export const chatMessages: Writable<string[]> = writable([]);

interface Alert {
  header: string;
  message: string;
  expireAfter: number;
}

export const alerts: Writable<Alert[]> = writable([]);
let currentAlerts: Alert[] = [];
alerts.subscribe((state) => currentAlerts = state);

export function createAlert(alert: Alert): void {
  alerts.set(currentAlerts.concat(alert));
  setTimeout(() => {
    removeAlert(alert);
  }, alert.expireAfter);
}

export function removeAlert(alert: Alert): void {
  alerts.set(currentAlerts.filter((a) => a !== alert));
}

export const loggedIn = writable(false);

let $currency = "xmr";
export const currency: Writable<"xmr" | "btc"> = writable("xmr");
currency.subscribe((value) => $currency = value);

export async function changeCurrency(): Promise<boolean> {
  const newCurrency = $currency === "xmr" ? "btc" : "xmr";
  const response = await fetch(
    `https://mokazino.net/api/v1/switchcurrency/${newCurrency}/json`,
    {
      credentials: "include",
    },
  );

  if (response.ok) {
    currency.set(newCurrency);
    updateProfile();
    return true;
  }

  console.warn("Changing currency failed:", await response.text());
  return false;
}

interface Profile {
  user: {
    id: number;
    username: string;
    cookie: string;
    currency: "XMR" | "BTC";
    balance: number;
    bitcoinbalance: number;
    wagered: number;
    wageredbitcoin: number;
    investbalance: number;
    investbalancebitcoin: number;
    moneroaddress: string;
    bitcoinaddress: string;
    nonce: number;
    chatbanned: boolean;
    clientseed: string;
  };
  bets: unknown; // TODO: update
}

export const profile: Writable<Profile> = writable({
  user: {
    id: -1,
    username: "Unknown",
    currency: "XMR",

    bitcoinaddress: "",
    moneroaddress: "",

    balance: -1,
    bitcoinbalance: -1,

    investbalance: -1,
    investbalancebitcoin: -1,

    wagered: -1,
    wageredbitcoin: -1,

    cookie: "",
    chatbanned: false,

    nonce: -1,
    clientseed: "",
  },
  bets: null,
});

export async function updateProfile(): Promise<void> {
  const response = await fetch("https://mokazino.net/api/v1/profile", {
    credentials: "include",
  }).catch(() => {});

  let json: Profile;
  try {
    json = await response!.json();
  } catch {
    loggedIn.set(false);
    localStorage.removeItem("loggedIn");
    return;
  }

  if (json!) {
    loggedIn.set(true);
    profile.set(json);
    localStorage.setItem("loggedIn", "1");
    currency.set(json.user.currency.toLowerCase() as "xmr" | "btc");
  }
}
