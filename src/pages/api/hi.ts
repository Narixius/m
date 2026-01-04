export const prerender = false;
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      time: new Date().getTime()
    }),
    { status: 200 }
  );
};
