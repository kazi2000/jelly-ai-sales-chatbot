import express from "express";

import { supabase }
from "../models/supabaseClient.js";

const router = express.Router();

router.get("/test-script", async (req, res) => {

  try {

    const result =
      await supabase
        .from("stores")
        .select("*");

    console.log(
      "SUPABASE RESULT:",
      result
    );

    const store =
      result.data?.[0];

    if (!store) {

      return res.status(404).json({

        error:
          "No store found"

      });

    }

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

    const data =
      await response.json();

    console.log(
      "SCRIPT TAG RESPONSE:",
      data
    );

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({

      error:
        error.message

    });

  }

});

export default router;
