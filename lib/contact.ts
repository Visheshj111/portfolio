export type ContactMessage = { name: string; email: string; message: string };

export function validateContact(value: unknown): ContactMessage {
  if (!value || typeof value !== "object") throw new Error("Enter your name, email, and message.");
  const fields = value as Record<string, unknown>;
  const name = typeof fields.name === "string" ? fields.name.trim() : "";
  const email = typeof fields.email === "string" ? fields.email.trim() : "";
  const message = typeof fields.message === "string" ? fields.message.trim() : "";
  if (name.length < 2 || name.length > 80) throw new Error("Use a name between 2 and 80 characters.");
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(email)) throw new Error("Enter a valid email address.");
  if (message.length < 10 || message.length > 3000) throw new Error("Use a message between 10 and 3,000 characters.");
  return { name, email, message };
}

export async function deliverContact(message: ContactMessage, send: typeof fetch = fetch) {
  const response = await send("https://formsubmit.co/ajax/vishesh.domain@gmail.com", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...message, _subject: "A new conversation from your portfolio", _template: "table" }),
    signal: AbortSignal.timeout(12000),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || (result?.success !== true && result?.success !== "true")) throw new Error("The message service couldn’t accept this message. Please try again or email me directly.");
}
