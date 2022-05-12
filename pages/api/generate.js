import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const completion = await openai.createCompletion("text-davinci-002", {
    prompt: generatePrompt(req.body.prompty),
    temperature: 0.6,
    max_tokens: 64,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}

function generatePrompt(prompty) {
  const capitalizedPrompty =
    prompty[0].toUpperCase() + prompty.slice(1).toLowerCase();
  return `Create a JavaScript object with three keys.

Prompty: You walk to the bank. 
Ideas:{"context": "You walk to the bank. The bank is a bustling building. Many people are entering and exiting with wads of cash in their hands.",
"leftButton": "Go inside the bank.", 
"rightButton": "Throw a rock at the window."}
Prompty: A customer introduces themself to you.
Ideas:{"context": "A customer introduces themself to you. The customer has long blonde hair and a beautiful smile.",
"leftButton": "Politely say Hello", 
"rightButton": "Scoff and walk away"}
Prompty: ${capitalizedPrompty}
Ideas:`;
}
