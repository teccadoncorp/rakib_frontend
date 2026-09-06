import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function backendBase() {
  return (process.env.API_PROXY_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:43124").replace(
    /\/$/,
    ""
  );
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  const { path } = await Promise.resolve(ctx.params);
  const target = `${backendBase()}/uploads/${path.join("/")}${req.nextUrl.search}`;
  try {
    const res = await fetch(target);
    const out = new Headers();
    const contentType = res.headers.get("content-type");
    if (contentType) out.set("content-type", contentType);
    const disposition = res.headers.get("content-disposition");
    if (disposition) out.set("content-disposition", disposition);
    return new Response(res.body, { status: res.status, headers: out });
  } catch {
    return new Response("Upload not available", { status: 502 });
  }
}
