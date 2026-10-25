"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSubmit } from "@formspree/react";
import { Arrow } from "@/components/ui/Arrow";
import {
  validateContact,
  type ContactErrors,
  type ContactFields,
} from "./form";

const fieldOrder = ["name", "email", "message"] as const;

export function ContactForm({
  formId,
  email,
}: {
  formId: string;
  email: string;
}) {
  const submit = useSubmit<ContactFields & { _gotcha: string }>(formId);
  const [phase, setPhase] = useState<
    "idle" | "sending" | "success" | "invalid" | "error"
  >("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [interactive, setInteractive] = useState(false);
  const [submissionAttempt, setSubmissionAttempt] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const mounted = useRef(true);
  const focusAfterRestart = useRef(false);

  useEffect(() => {
    mounted.current = true;
    setInteractive(true);
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (phase === "idle" && focusAfterRestart.current) {
      focusAfterRestart.current = false;
      formRef.current
        ?.querySelector<HTMLInputElement>("#contact-name")
        ?.focus();
      return;
    }
    if (phase !== "error" && phase !== "invalid" && phase !== "success") return;
    const field = formRef.current?.querySelector<HTMLElement>(
      '[aria-invalid="true"]',
    );
    if (field) field.focus();
    else feedbackRef.current?.focus();
  }, [phase, submissionAttempt]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    setSubmissionAttempt((attempt) => attempt + 1);
    const data = new FormData(event.currentTarget);
    const checked = validateContact(data);
    setErrors(checked.errors);
    if (Object.keys(checked.errors).length) {
      setPhase("invalid");
      return;
    }
    pending.current = true;
    setPhase("sending");
    try {
      const result = await submit({
        ...checked.fields,
        _gotcha: String(data.get("_gotcha") || ""),
      });
      if (!mounted.current) return;
      if (result.kind === "error") {
        const fieldErrors: ContactErrors = {};
        for (const field of fieldOrder) {
          const messages = result.getFieldErrors(field);
          if (messages.length)
            fieldErrors[field] =
              `${field === "email" ? "Email" : field === "name" ? "Name" : "Message"} ${messages.map(({ message }) => message).join(", ")}.`;
        }
        setErrors(fieldErrors);
        setPhase("error");
      } else {
        formRef.current?.reset();
        setPhase("success");
      }
    } catch {
      if (mounted.current) setPhase("error");
    } finally {
      pending.current = false;
    }
  }

  if (phase === "success") {
    return (
      <div
        className="contact-success"
        ref={feedbackRef}
        tabIndex={-1}
        role="status"
      >
        <span className="eyebrow">Thank you</span>
        <h2>
          Message <em>sent.</em>
        </h2>
        <p>
          Your message has been submitted. You can also reach me at{" "}
          <a href={`mailto:${email}`}>{email}</a>.
        </p>
        <button
          className="text-link"
          type="button"
          onClick={() => {
            focusAfterRestart.current = true;
            setPhase("idle");
          }}
        >
          Send another message <Arrow />
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="contact-form"
      action={`https://formspree.io/f/${formId}`}
      method="post"
      onSubmit={handleSubmit}
      noValidate={interactive}
      aria-label="Send Bryan a message"
      aria-busy={phase === "sending"}
      onChange={(event) => {
        const target = event.target;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement
        ) {
          const name = target.name as keyof ContactFields;
          const remaining = { ...errors, [name]: undefined };
          if (errors[name]) setErrors(remaining);
          if (
            (phase === "invalid" || phase === "error") &&
            !Object.values(remaining).some(Boolean)
          )
            setPhase("idle");
        }
      }}
    >
      <p className="contact-form-intro">
        Have a project, a role, or a question in mind? Tell me about it.
      </p>
      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          name="_gotcha"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {fieldOrder.map((name, index) => (
        <div
          className={`contact-field ${errors[name] ? "has-error" : ""}`}
          key={name}
        >
          <span className="contact-field-number" aria-hidden="true">
            0{index + 1}
          </span>
          <div>
            <label htmlFor={`contact-${name}`}>
              {name === "name"
                ? "Your name"
                : name === "email"
                  ? "Your email"
                  : "Your message"}
            </label>
            {name === "message" ? (
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                maxLength={5000}
                required
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? "contact-message-error" : undefined
                }
                readOnly={phase === "sending"}
              />
            ) : (
              <input
                id={`contact-${name}`}
                name={name}
                type={name === "email" ? "email" : "text"}
                autoComplete={name}
                maxLength={name === "name" ? 100 : 254}
                required
                aria-invalid={Boolean(errors[name])}
                aria-describedby={
                  errors[name] ? `contact-${name}-error` : undefined
                }
                readOnly={phase === "sending"}
              />
            )}
            {errors[name] && (
              <p className="contact-field-error" id={`contact-${name}-error`}>
                {errors[name]}
              </p>
            )}
          </div>
        </div>
      ))}
      <div className="contact-form-bottom">
        <div
          className="contact-form-feedback"
          ref={feedbackRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {phase === "error" || phase === "invalid" ? (
            <p className="contact-form-error">
              {Object.values(errors).some(Boolean) ? (
                "Please check the highlighted fields."
              ) : (
                <>
                  Your message couldn’t be sent. Please try again or{" "}
                  <a href={`mailto:${email}`}>email me directly</a>.
                </>
              )}
            </p>
          ) : phase === "sending" ? (
            <p>Sending your message…</p>
          ) : (
            <p>
              All three fields are required.
              <br />
              Your details are used to reply to your message.
            </p>
          )}
        </div>
        <button
          className="circle-link contact-send"
          type="submit"
          disabled={phase === "sending"}
        >
          <span>{phase === "sending" ? "Sending…" : "Send message"}</span>
          <Arrow diagonal />
        </button>
      </div>
      <noscript>
        <p className="contact-form-note">
          Submitting opens the secure form service for confirmation. You can
          also email me directly.
        </p>
      </noscript>
    </form>
  );
}
