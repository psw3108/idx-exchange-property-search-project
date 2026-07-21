const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch (networkErr) {
    // fetch only throws here for network-level failures — server down, no connection, CORS block
    throw new Error('Unable to reach the server. Please check your connection or try again later.');
  }

  const text = await response.text();

  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // response wasn't valid JSON (e.g. an HTML error page from Express)
      data = null;
    }
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

export function fetchProperties(params = {}) {
  const query = new URLSearchParams(params).toString();

  return request(`/properties${query ? `?${query}` : ''}`);
}

export function fetchPropertyDetail(id) {
  return request(`/properties/${id}`);
}



