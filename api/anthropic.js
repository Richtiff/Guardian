export const config = { runtime: "edge" };

export default async function handler(req) {
  const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return new Response("No API key", { status: 500, headers: CORS });

  const body = await req.text();

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01"
    },
    body
  });

  const text = await r.text();
  return new Response(text, {
    status: r.status,
    headers: { ...CORS, "Content-Type": "application/json" }
  });
}
