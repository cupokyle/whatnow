export async function fetchData(url = '', data = {}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'model': 'gpt-3.5-turbo-0125',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const textResponse = await response.text();

    // Removing markdown code block syntax (```json and ```)
    const jsonResponseText = textResponse.replace(/```json\n|\n```/g, '');

    try {
      return JSON.parse(jsonResponseText);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      throw new Error('Received data is not valid JSON');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}