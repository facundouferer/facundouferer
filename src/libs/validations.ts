import { NextRequest } from "next/server";

const API_SECRET_KEY = process.env.API_SECRET_KEY;

export function validateApiKey(request: NextRequest): boolean {
  console.log(request)
  if (!API_SECRET_KEY) {
    console.error("CRITICAL: API_SECRET_KEY no está configurada en el servidor.");
    return false;
  }
  const clientApiKey = request.headers.get("X-API-KEY");
  return clientApiKey === API_SECRET_KEY;
}