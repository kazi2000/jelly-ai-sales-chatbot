import express from "express";

import { supabase }
from "../models/supabaseClient.js";

const router = express.Router();

router.get("/test-script", async (req, res) => {

  try {

    const { data: store }
      = await supabase
        .from("stores")
        .select("*")
        .eq(
          "store_name",
          "ai-sales-agent-4fl5bdta.myshopify.com"
        )
        .single();

    const response = await fetch(

      `https://${store.store_name}/admin/api/2024-01/script_tags.json`,

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

    const data =
      await response.json();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

});

export default router;
