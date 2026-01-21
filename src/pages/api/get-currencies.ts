import type { APIRoute } from "astro";

import { getCurrencies } from "@/lib/now-payment";

export const prerender = false;
export const GET: APIRoute = async () => {
  return getCurrencies();
};
