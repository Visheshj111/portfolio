import { deliverContact, validateContact } from "@/lib/contact";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Please send your message from the portfolio." }, { status: 403 });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return Response.json({ error: "Expected a JSON message." }, { status: 415 });
  let input: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 16384) { await reader.cancel(); return Response.json({ error: "This message is too large." }, { status: 413 }); }
      chunks.push(part.value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return Response.json({ error: "Please check your message and try again." }, { status: 400 }); }
  if (input && typeof input === "object" && "website" in input && input.website) return Response.json({ ok: true });
  let message;
  try { message = validateContact(input); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Check your message." }, { status: 400 }); }
  try { await deliverContact(message); return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ error: "The message service is unavailable. Your message hasn’t been confirmed. Please retry or email me directly." }, { status: 502 }); }
}
