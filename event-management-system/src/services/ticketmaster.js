const BASE = "https://app.ticketmaster.com/discovery/v2";
const KEY = import.meta.env.VITE_TM_API_KEY;

export async function fetchEvents(params = {}) {
  const query = new URLSearchParams({ apikey: KEY, size: 20, ...params });
  const res = await fetch(`${BASE}/events.json?${query}`);
  if (!res.ok) throw new Error("Failed to load events");
  const data = await res.json();
  return data._embedded?.events || [];
}

export async function fetchEventById(id) {
  const res = await fetch(`${BASE}/events/${id}.json?apikey=${KEY}`);
  if (!res.ok) throw new Error("Event not found");
  return res.json();
}

export async function fetchClassifications() {
  const res = await fetch(`${BASE}/classifications.json?apikey=${KEY}`);
  const data = await res.json();
  return data._embedded?.classifications || [];
}