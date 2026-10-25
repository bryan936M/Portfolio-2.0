import test from "node:test";
import assert from "node:assert/strict";
import {
  contactFormId,
  validateContact,
} from "../src/features/contact/form.ts";

const form = (values) => {
  const data = new FormData();
  for (const [field, value] of Object.entries(values)) data.set(field, value);
  return data;
};

test("empty or whitespace-only inquiries never pass validation", () => {
  const { errors } = validateContact(
    form({ name: "  ", email: "", message: "\n " }),
  );
  assert.deepEqual(Object.keys(errors), ["name", "email", "message"]);
});

test("real names and multiline messages retain their content", () => {
  const { fields, errors } = validateContact(
    form({
      name: "  李  ",
      email: "  bryan+portfolio@example.org  ",
      message: "  Hello Bryan,\n\nCan we discuss a project?  ",
    }),
  );
  assert.deepEqual(errors, {});
  assert.equal(fields.name, "李");
  assert.equal(fields.email, "bryan+portfolio@example.org");
  assert.equal(fields.message, "Hello Bryan,\n\nCan we discuss a project?");
});

test("invalid emails and oversized messages receive specific field errors", () => {
  const { errors } = validateContact(
    form({
      name: "Bryan",
      email: "not-an-email",
      message: "x".repeat(5001),
    }),
  );
  assert.equal(errors.name, undefined);
  assert.ok(errors.email);
  assert.ok(errors.message);
});

test("missing delivery configuration keeps the email fallback; invalid config fails", () => {
  assert.equal(contactFormId(undefined), null);
  assert.equal(contactFormId("  "), null);
  assert.equal(contactFormId(" abcd1234 "), "abcd1234");
  assert.throws(() => contactFormId("https://unexpected.example/collect"));
  assert.throws(() => contactFormId("re_private-key"));
});
