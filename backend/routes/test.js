const response = await fetch(

  `https://${store.store_name}/admin/api/2025-01/script_tags.json`,

  {

    method: "POST",

    headers: {

      "Content-Type":
        "application/json",

      "X-Shopify-Access-Token":
        store.access_token

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
