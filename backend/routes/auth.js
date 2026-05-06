import express from "express";

import { supabase }
from "../models/supabaseClient.js";

const router = express.Router();

/* =========================================
   AUTH ROUTE
========================================= */

router.get("/auth", async (req, res) => {

  const shop = req.query.shop;

  if (!shop) {

    return res
      .status(400)
      .send("Missing shop parameter");

  }

  const redirectUrl =

    `https://${shop}/admin/oauth/authorize` +

    `?client_id=${process.env.SHOPIFY_API_KEY}` +

    `&scope=${process.env.SHOPIFY_SCOPES}` +

    `&redirect_uri=${process.env.SHOPIFY_APP_URL}/auth/callback`;

  res.redirect(redirectUrl);

});

/* =========================================
   CALLBACK
========================================= */

router.get("/auth/callback", async (req, res) => {

  const { shop, code } = req.query;

  try {

    console.log("SHOP:", shop);

    const response = await fetch(

      `https://${shop}/admin/oauth/access_token`,

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          client_id:
            process.env.SHOPIFY_API_KEY,

          client_secret:
            process.env.SHOPIFY_API_SECRET,

          code

        })

      }

    );

    const data =
      await response.json();

    console.log(
      "ACCESS TOKEN RESPONSE:",
      data
    );

    /* =====================================
       SAVE STORE
    ===================================== */

    const { error } =
      await supabase
        .from("stores")
        .insert({

          store_name: shop,

          access_token:
            data.access_token,

          plan: "starter",

          messages_used: 0

        });

    console.log(
      "SUPABASE ERROR:",
      error
    );

    res.send(
      "Jelly AI Installed Successfully 🚀"
    );

  } catch (error) {

    console.error(
      "AUTH ERROR:",
      error
    );

    res
      .status(500)
      .send("OAuth failed");

  }

});

export default router;
