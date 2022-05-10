import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const completion = await openai.createCompletion("text-davinci-002", {
    prompt: generatePrompt(req.body.prompty),
    temperature: 0.6,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}

function generatePrompt(prompty) {
  const capitalizedPrompty =
    prompty[0].toUpperCase() + prompty.slice(1).toLowerCase();
  return `Write a two sentence story about Howie.

Prompty: Cat
Ideas: Howie bought a new cat. The cat attacked him and he screamed.
Prompty: murder Jack Layton
Ideas: Howie believes that Jack Layton was murdered. He's always talking about it.
Prompty: ${capitalizedPrompty}
Ideas:`;
}
