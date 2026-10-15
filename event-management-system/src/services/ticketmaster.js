const BASE = "https://app.ticketmaster.com/discovery/v2";
const KEY = import.meta.env.VITE_TM_API_KEY;

function getApiKey() {
  if (!KEY) {
    throw new Error(
      "Ticketmaster API key is not configured. Add VITE_TM_API_KEY to your local .env file."
    );
  }
  return KEY;
}

async function request(path, params = {}) {
  const query = new URLSearchParams({ apikey: getApiKey(), ...params });
  const response = await fetch(`${BASE}${path}?${query}`);

  if (!response.ok) {
    let message = "Ticketmaster could not complete the request.";
    try {
      const error = await response.json();
      message = error.fault?.faultstring || error.message || message;
    } catch {
      // Keep the user-facing fallback when the API does not return JSON.
    }
    throw new Error(message);
  }

  return response.json();
}

export async function fetchEvents(params = {}) {
  const data = await request("/events.json", { size: 20, ...params });
  return data._embedded?.events || [];
}

export async function fetchEventById(id) {
  return request(`/events/${encodeURIComponent(id)}.json`);
}

export async function fetchClassifications() {
  const data = await request("/classifications.json");
  return data._embedded?.classifications || [];
}