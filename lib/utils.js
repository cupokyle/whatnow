export async function fetchData(url = '', data = {}) {
  let textResponse;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // eslint-disable-next-line no-undef
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'model': 'gpt-3.5-turbo-1106',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    textResponse = await response.text();

    try {
      const jsonResponse = JSON.parse(textResponse);
      return jsonResponse;
    } catch (e) {
      console.error('Error parsing JSON:', e);
      console.error('Received response:', textResponse);
      throw new Error('Received data is not valid JSON');
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}


  