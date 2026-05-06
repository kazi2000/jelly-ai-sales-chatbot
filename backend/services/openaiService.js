import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateReply = async (
  userMessage,
  products
) => {

  const productContext = products
    .map(
      (p) =>
        `${p.title} - ${p.price} - ${p.description}`
    )
    .join("\n");

  const response = await openai.chat.completions.create({

    model: "gpt-4o-mini",

    max_tokens: 150,

    messages: [

      {
        role: "system",

        content: `
You are Jelly AI, a friendly Shopify AI sales assistant.

You help customers discover products and increase sales.

Available products:
${productContext}

Rules:
- Recommend relevant products naturally
- Keep responses short
- Sound human
- Use emojis naturally
- Maximum 3 short sentences
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
