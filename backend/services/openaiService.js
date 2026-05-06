import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateReply = async (userMessage) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 150,
    messages: [
      {
        role: "system",
        content: "You are a friendly human-like sales assistant. Be short, persuasive, and helpful."
      },
      {
        role: "user",
        content: userMessage
      }
    ]
  });

  return response.choices[0].message.content;
};
