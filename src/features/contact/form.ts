export type ContactFields = {
  name: string;
  email: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export function contactFormId(value: string | undefined) {
  if (!value?.trim()) return null;
  const id = value.trim();
  if (!/^[a-zA-Z0-9]{6,64}$/.test(id))
    throw new Error(
      "NEXT_PUBLIC_FORMSPREE_FORM_ID must be a Formspree form ID.",
    );
  return id;
}

export function validateContact(data: FormData) {
  const fields: ContactFields = {
    name: String(data.get("name") || "").trim(),
    email: String(data.get("email") || "").trim(),
    message: String(data.get("message") || "").trim(),
  };
  const errors: ContactErrors = {};
  if (!fields.name) errors.name = "Please enter your name.";
  else if (fields.name.length > 100)
    errors.name = "Please keep your name to 100 characters.";
  if (!fields.email) errors.email = "Please enter your email address.";
  else if (
    fields.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)
  )
    errors.email = "Please enter a valid email address.";
  if (!fields.message) errors.message = "Please enter a message.";
  else if (fields.message.length > 5000)
    errors.message = "Please keep your message to 5,000 characters.";
  return { fields, errors };
}
