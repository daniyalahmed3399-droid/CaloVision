// A single error type for every failed API call, carrying a message that is
// safe to show to the user (never raw server output).

export class ApiError extends Error {
  constructor(status, message, fieldErrors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const FRIENDLY_BY_STATUS = {
  401: "Your session has expired. Please log in again.",
  403: "You don't have access to this.",
  404: "We couldn't find what you were looking for.",
  429: "Too many attempts. Please wait a moment and try again.",
};

export function friendlyMessage(status) {
  if (FRIENDLY_BY_STATUS[status]) return FRIENDLY_BY_STATUS[status];
  if (status >= 500) {
    return "Something went wrong on our side. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

// RTK Query mutations reject with a plain { status, message, fieldErrors }
// object (see lib/store/api.js). This turns it into what a form needs.
export function toFormError(error) {
  return {
    message:
      error?.message || "Something went wrong. Please try again.",
    fieldErrors: error?.fieldErrors || {},
  };
}

export function toUserMessage(error) {
  if (error instanceof ApiError) return error.message;
  return "Something went wrong. Please try again.";
}
