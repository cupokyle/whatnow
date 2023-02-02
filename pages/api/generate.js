import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const ultimatePrompt = generatePrompt(req.body.prompty);
  const completion = await openai.createCompletion("text-davinci-003", {
    prompt: ultimatePrompt,
    temperature: 0.9,
    max_tokens: 122,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}

function generatePrompt(prompty) {
  const capitalizedPrompty =
    prompty[0].toUpperCase() + prompty.slice(1).toLowerCase();
  return `Create a JavaScript object with three keys.

Prompty: You walk to the bank. 
Ideas:{"context": "You walk to the bank. The bank is a bustling building. Many people are entering and exiting with wads of cash in their hands.",
"leftButton": "Go inside the bank to open a chequing account",
"rightButton": "Think about banks quizically",
"leftTwoButton": "Scream the word Bank until you can't breathe anymore",
"rightTwoButton": "Throw a rock at the window."}
Prompty: A customer introduces themself to you.
Ideas:{"context": "A customer introduces themself to you. The customer has long blonde hair and a beautiful smile.",
"leftButton": "Politely say Hello",
"rightButton": "Ask them if they have any games on their phone", 
"leftTwoButton": "Comment on their beautful hair",  
"rightTwoButton": "Ask them if there's any way you can help them today"}
Prompty: ${capitalizedPrompty}
Ideas:`;
}
