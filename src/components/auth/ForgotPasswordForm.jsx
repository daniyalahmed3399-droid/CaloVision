"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

import AuthHeading from "./AuthHeading";
import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import TextField from "../ui/TextField";
import { forgotPassword } from "../../lib/api/auth";
import { toUserMessage } from "../../lib/api/errors";
import { USE_MOCK_API } from "../../lib/config";
import { MOCK_RESET_CODE } from "../../lib/api/mock";
import { validateEmail } from "../../lib/validation";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailError = validateEmail(email);
    setError(emailError);

    if (emailError) return;

    setSubmitting(true);
    setFormError("");

    try {
      await forgotPassword({ email: email.trim() });
      setSentTo(email.trim());
    } catch (err) {
      setFormError(toUserMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (sentTo) {
    return (
      <>
        <AuthHeading
          eyebrow="Check your email"
          title="Reset instructions sent"
          description={`If an account exists for ${sentTo}, we've sent a reset code to it.`}
        />

        <div className="space-y-5">
          {USE_MOCK_API && (
            <FormAlert type="success">
              Mock mode: no email is sent. Use the code {MOCK_RESET_CODE}.
            </FormAlert>
          )}

          <Link
            href={`/reset-password?email=${encodeURIComponent(sentTo)}`}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-[#17251a] text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#4dbb08]"
          >
            Enter reset code
          </Link>

          <button
            type="button"
            onClick={() => setSentTo("")}
            className="w-full text-center text-sm font-semibold text-[#3c9705] hover:underline"
          >
            Use a different email
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthHeading
        eyebrow="Forgot password"
        title="Reset your password"
        description="Enter your email and we'll send you a code to set a new password."
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormAlert>{formError}</FormAlert>

        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail size={17} />}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
            setFormError("");
          }}
          error={error}
        />

        <Button type="submit" variant="green" loading={submitting} className="w-full">
          {submitting ? "Sending…" : "Send reset code"}
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to log in
      </Link>
    </>
  );
}
