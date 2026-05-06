import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateReply = async (
  userMessage
) => {

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",

    max_tokens: 150,

    messages: [

      {
        role: "system",

        content: `
You are Jelly AI, a friendly Shopify AI sales assistant.

Your job:
- Help customers find products
- Increase sales
- Sound human and conversational
- Keep replies short
- Be persuasive but natural
- Ask follow-up questions
- Recommend products confidently

Tone examples:
"Hey 👋 What are you looking for today?"
"I'd definitely recommend this 👇"
"This is one of our most popular options."

Rules:
- Maximum 3 short sentences
- Never sound robotic
- Use emojis naturally
- Focus on conversions
`
      },

      {
        role: "user",
        content: userMessage
      }

    ]
  });

  return response.choices[0].message.content;

};
