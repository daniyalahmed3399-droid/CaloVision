import { API_BASE_URL } from "../config";
import { endpoints } from "./endpoints";
import { ApiError, friendlyMessage } from "./errors";

// The one place network requests are made. Components never call fetch.
export async function request(name, { body, token } = {}) {
  const endpoint = endpoints[name];

  if (!endpoint) {
    throw new ApiError(
      0,
      "This feature isn't connected to the backend yet."
    );
  }

  const headers = { "Content-Type": "application/json" };

  // Auth header format is a backend decision (guide section 25).
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint.path}`, {
      method: endpoint.method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      0,
      "Network error. Check your connection and try again."
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Empty or non-JSON body.
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message && response.status < 500
        ? data.message
        : friendlyMessage(response.status),
      data?.errors || {}
    );
  }

  return data;
}
