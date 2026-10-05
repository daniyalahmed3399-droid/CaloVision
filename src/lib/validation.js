import { PASSWORD_MIN_LENGTH } from "./config";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email.trim()) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(email.trim())) return "Enter a valid email address.";
  return "";
}

export function validateConfirm(password, confirm) {
  if (!confirm) return "Confirm your password.";
  if (confirm !== password) return "Passwords don't match.";
  return "";
}

// Password rules are a backend decision; these are conservative defaults.
export function validatePassword(password) {
  if (!password) return "Enter a password.";
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Include at least one letter and one number.";
  }
  return "";
}
