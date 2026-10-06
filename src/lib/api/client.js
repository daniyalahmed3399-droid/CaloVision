import { API_BASE_URL } from "../config";
import { endpoints } from "./endpoints";
import { ApiError, friendlyMessage } from "./errors";

// Fills :placeholders in the path from `params`; on GET the rest become a
// query string.
function buildUrl(endpoint, params = {}) {
  const used = new Set();

  const path = endpoint.path.replace(/:([A-Za-z]+)/g, (_, key) => {
    used.add(key);
    return encodeURIComponent(params[key] ?? "");
  });

  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([key, value]) => !used.has(key) && value !== undefined && value !== "")
      .map(([key, value]) => [key, String(value)])
  ).toString();

  return endpoint.method === "GET" && query ? `${path}?${query}` : path;
}

// The one place network requests are made. Components never call fetch.
export async function request(name, { body, token, params } = {}) {
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
    response = await fetch(`${API_BASE_URL}${buildUrl(endpoint, params)}`, {
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
