export async function fetchRoles() {
  const response = await fetch('/api/roles');
  if (!response.ok) {
    throw new Error('Unable to load role library');
  }
  return response.json();
}

export async function fetchSuggestions(payload) {
  const response = await fetch('/api/ai/suggestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Unable to generate suggestions');
  }

  return response.json();
}
