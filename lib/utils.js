// lib/utils.js
export async function fetchData(data = {}) {
  try {
    const response = await fetch('/api/fetchData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
