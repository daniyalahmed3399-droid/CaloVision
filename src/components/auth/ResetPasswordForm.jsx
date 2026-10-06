"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, KeyRound, Lock, Mail } from "lucide-react";

import AuthHeading from "./AuthHeading";
import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import TextField from "../ui/TextField";
import { resetPassword } from "../../lib/api/auth";
import { ApiError, toUserMessage } from "../../lib/api/errors";
import {
  validateConfirm,
  validateEmail,
  validatePassword,
} from "../../lib/validation";

export default function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();

  // Email and code can arrive pre-filled from the forgot-password step or
  // from a reset link.
  const [form, setForm] = useState({
    email: params.get("email") || "",
    code: params.get("code") || params.get("token") || "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {
      email: validateEmail(form.email),
      code: form.code.trim() ? "" : "Enter the code we sent you.",
      password: validatePassword(form.password),
      confirm: validateConfirm(form.password, form.confirm),
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    setFormError("");

    try {
      await resetPassword({
        email: form.email.trim(),
        code: form.code.trim(),
        password: form.password,
      });

      setDone(true);
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors.code) {
        setErrors({ code: error.fieldErrors.code });
      } else {
        setFormError(toUserMessage(error));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf5df] text-[#4dbb08]">
          <CheckCircle2 size={32} />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900">
          Password changed
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          You can now log in with your new password.
        </p>

        <Button
          variant="green"
          className="mt-8 w-full"
          onClick={() => router.push("/login")}
        >
          Back to log in
        </Button>
      </div>
    );
  }

  return (
    <>
      <AuthHeading
        eyebrow="Reset password"
        title="Choose a new password"
        description="Enter the code from your email and set a new password."
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormAlert>{formError}</FormAlert>

        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          icon={<Mail size={17} />}
          value={form.email}
          onChange={update("email")}
          error={errors.email}
        />

        <TextField
          label="Reset code"
          autoComplete="one-time-code"
          inputMode="numeric"
          placeholder="Enter code"
          icon={<KeyRound size={17} />}
          value={form.code}
          onChange={update("code")}
          error={errors.code}
        />

        <TextField
          label="New password"
          type="password"
          autoComplete="new-password"
          icon={<Lock size={17} />}
          value={form.password}
          onChange={update("password")}
          error={errors.password}
        />

        <TextField
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          icon={<Lock size={17} />}
          value={form.confirm}
          onChange={update("confirm")}
          error={errors.confirm}
        />

        <Button type="submit" variant="green" loading={submitting} className="w-full">
          {submitting ? "Saving…" : "Set new password"}
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
