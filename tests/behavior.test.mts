import { test } from "node:test";
import assert from "node:assert/strict";
import { advanceDemo, freshDemo, sendDemo } from "../lib/rate-demo.ts";
import { deliverContact, validateContact } from "../lib/contact.ts";

test("a burst admits only available capacity for both algorithms", () => {
  for (const algorithm of ["token_bucket", "sliding_window"] as const) {
    const result = sendDemo(freshDemo(0), algorithm, 8, 0);
    assert.equal(result.admitted, 5);
    assert.equal(result.blocked, 3);
    const again = sendDemo(result.state, algorithm, 8, 0);
    assert.equal(again.admitted, 0);
    assert.equal(again.blocked, 8);
  }
});

test("bucket refill and rolling-window expiry behave differently between bursts", () => {
  const bucket = sendDemo(freshDemo(0), "token_bucket", 5, 0).state;
  const window = sendDemo(freshDemo(0), "sliding_window", 5, 0).state;
  assert.equal(sendDemo(bucket, "token_bucket", 8, 4000).admitted, 2);
  assert.equal(sendDemo(window, "sliding_window", 8, 4000).admitted, 0);
  assert.equal(sendDemo(window, "sliding_window", 8, 9999).admitted, 0);
  assert.equal(sendDemo(window, "sliding_window", 8, 10000).admitted, 5);
});

test("fractional refill cannot admit a request, and idle capacity stays bounded", () => {
  const empty = sendDemo(freshDemo(0), "token_bucket", 5, 0).state;
  assert.equal(sendDemo(empty, "token_bucket", 1, 1999).admitted, 0);
  assert.equal(sendDemo(empty, "token_bucket", 1, 2000).admitted, 1);
  assert.equal(advanceDemo(empty, 100000).tokens, 5);
  assert.equal(advanceDemo(freshDemo(1000), 0).tokens, 5);
});

test("contact validation trims valid input and rejects incomplete or oversized messages", () => {
  const valid = { name: " Test Reader ", email: " test@example.com ", message: " A meaningful test message. " };
  assert.deepEqual(validateContact(valid), { name: "Test Reader", email: "test@example.com", message: "A meaningful test message." });
  for (const invalid of [null, {}, { ...valid, name: "a" }, { ...valid, name: "a".repeat(81) }, { ...valid, email: "missing-at-sign" }, { ...valid, email: "a@example.com\r\nBcc:other@example.com" }, { ...valid, message: "short" }, { ...valid, message: "x".repeat(3001) }]) assert.throws(() => validateContact(invalid));
});

test("delivery uses the existing provider and requires explicit provider acceptance", async () => {
  const message = { name: "Test Reader", email: "test@example.com", message: "A meaningful test message." };
  let calls = 0;
  await deliverContact(message, (async (url, options) => {
    calls++;
    assert.equal(url, "https://formsubmit.co/ajax/vishesh.domain@gmail.com");
    assert.equal(options?.method, "POST");
    assert.equal(JSON.parse(String(options?.body)).message, message.message);
    assert(options?.signal instanceof AbortSignal);
    return Response.json({ success: "true" });
  }) as typeof fetch);
  assert.equal(calls, 1);
});

test("delivery failures never turn into a success response or an automatic resend", async () => {
  const message = { name: "Test Reader", email: "test@example.com", message: "A meaningful test message." };
  for (const response of [Response.json({ success: true }, { status: 500 }), Response.json({ success: false }), Response.json({}), new Response("not json")]) {
    let calls = 0;
    await assert.rejects(deliverContact(message, (async () => { calls++; return response; }) as typeof fetch));
    assert.equal(calls, 1);
  }
  await assert.rejects(deliverContact(message, (async () => { throw new Error("offline"); }) as typeof fetch));
});
