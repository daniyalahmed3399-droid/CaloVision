"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

import { useAuth } from "../../lib/store/useAuth";
import AuthHeading from "./AuthHeading";
import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import TextField from "../ui/TextField";
import { toUserMessage } from "../../lib/api/errors";
import { validateEmail } from "../../lib/validation";
import { FEATURES } from "../../lib/config";

export default function LoginForm() {
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {
      email: validateEmail(form.email),
      password: form.password ? "" : "Enter your password.",
    };

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) return;

    setSubmitting(true);
    setFormError("");

    try {
      // On success the auth slice stores the session and AuthGate redirects
      // to the dashboard, onboarding, or the page the user came from.
      await login({ email: form.email.trim(), password: form.password });
    } catch (error) {
      setFormError(toUserMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <>
      <AuthHeading
        eyebrow="Welcome back"
        title="Log in to CaloVision"
        description="Pick up where you left off."
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
          autoComplete="current-password"
          placeholder="Your password"
          icon={<Lock size={17} />}
          value={form.password}
          onChange={update("password")}
          error={errors.password}
        />

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-[#3c9705] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? "Logging in…" : "Log in"}
        </Button>

        {FEATURES.googleAuth && (
          <Button variant="secondary" className="w-full">
            Continue with Google
          </Button>
        )}
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        New to CaloVision?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#3c9705] hover:underline"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
