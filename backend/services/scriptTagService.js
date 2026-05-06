export const createScriptTag = async (
  shop,
  accessToken
) => {

  await fetch(

    `https://${shop}/admin/api/2024-01/script_tags.json`,

    {

      method: "POST",

      headers: {

        "Content-Type":
          "application/json",

        "X-Shopify-Access-Token":
          accessToken

      },

      body: JSON.stringify({

        script_tag: {

          event: "onload",

          src:
            "https://cdn.jsdelivr.net/gh/kazi2000/jelly-ai-sales-chatbot@main/widget/chat-widget.js"

        }

      })

    }

  );

};
