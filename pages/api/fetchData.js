const OpenAIApi = require('openai');
const configuration = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
};
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { messages, model } = req.body;

      const completion = await openai.chat.completions.create({
        model: model,
        messages: messages,
      });

      res.status(200).json(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
