"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

import { useAuth } from "./AuthProvider";
import AuthHeading from "./AuthHeading";
import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import TextField from "../ui/TextField";
import { ApiError, toUserMessage } from "../../lib/api/errors";
import {
  validateConfirm,
  validateEmail,
  validatePassword,
} from "../../lib/validation";
import { FEATURES, PASSWORD_MIN_LENGTH } from "../../lib/config";

export default function SignUpForm() {
  const { signUp } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm: validateConfirm(form.password, form.confirm),
      consent: form.consent
        ? ""
        : "Please accept the Terms and Privacy Policy to continue.",
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    setFormError("");

    try {
      // On success AuthGate sends the new user to onboarding.
      await signUp({ email: form.email.trim(), password: form.password });
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors.email) {
        setErrors({ email: error.fieldErrors.email });
      } else {
        setFormError(toUserMessage(error));
      }

      setSubmitting(false);
    }
  };

  return (
    <>
      <AuthHeading
        eyebrow="Get started"
        title="Create your account"
        description="It takes a minute. We'll personalise your targets next."
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormAlert>{formError}</FormAlert>

        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail size={17} />}
          value={form.email}
          onChange={update("email")}
          error={errors.email}
        />

        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          icon={<Lock size={17} />}
          value={form.password}
          onChange={update("password")}
          error={errors.password}
          hint={`At least ${PASSWORD_MIN_LENGTH} characters with a letter and a number.`}
        />

        <TextField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          icon={<Lock size={17} />}
          value={form.confirm}
          onChange={update("confirm")}
          error={errors.confirm}
        />

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={update("consent")}
              aria-invalid={Boolean(errors.consent)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#4dbb08]"
            />
            <span>
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-semibold text-[#3c9705] hover:underline"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-semibold text-[#3c9705] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {errors.consent && (
            <p className="mt-1.5 text-xs font-medium text-red-600">
              {errors.consent}
            </p>
          )}
        </div>

        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? "Creating account…" : "Create account"}
        </Button>

        {FEATURES.googleAuth && (
          <Button variant="secondary" className="w-full">
            Sign up with Google
          </Button>
        )}
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#3c9705] hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
