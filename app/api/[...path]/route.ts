import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function backendBase() {
  return (process.env.API_PROXY_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:43124").replace(
    /\/$/,
    ""
  );
}

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  const { path } = await Promise.resolve(ctx.params);
  const target = `${backendBase()}/api/${path.join("/")}${req.nextUrl.search}`;
  const headers = new Headers();
  for (const key of ["authorization", "content-type", "accept", "x-superior-secret"]) {
    const value = req.headers.get(key);
    if (value) headers.set(key, value);
  }
  const init: RequestInit = { method: req.method, headers };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }
  try {
    const res = await fetch(target, init);
    const out = new Headers();
    const contentType = res.headers.get("content-type");
    if (contentType) out.set("content-type", contentType);
    return new Response(res.body, { status: res.status, headers: out });
  } catch {
    return Response.json(
      {
        message:
          "The API is unreachable. Set API_PROXY_URL or NEXT_PUBLIC_API_URL to the live backend URL.",
      },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
