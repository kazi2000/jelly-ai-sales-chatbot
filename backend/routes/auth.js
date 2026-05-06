import express from "express";

import { supabase }
from "../models/supabaseClient.js";

import { createScriptTag }
from "../services/scriptTagService.js";

const router = express.Router();

/* =========================================
   STEP 1 — REDIRECT TO SHOPIFY INSTALL
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
   STEP 2 — SHOPIFY CALLBACK
========================================= */

router.get("/auth/callback", async (req, res) => {

  const { shop, code } = req.query;

  try {

    /* =========================================
       EXCHANGE CODE FOR ACCESS TOKEN
    ========================================= */

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

    const accessToken =
      data.access_token;

    /* =========================================
       SAVE STORE IN SUPABASE
    ========================================= */

    await supabase
      .from("stores")
      .upsert({

        store_name: shop,

        access_token: accessToken,

        plan_type: "free",

        messages_used: 0,

        plan_limit: 100,

        billing_cycle_start:
          new Date()

      });

    console.log(
      "Store Installed:",
      shop
    );

    /* =========================================
       CREATE SHOPIFY SCRIPT TAG
    ========================================= */

    await createScriptTag(
      shop,
      accessToken
    );

    console.log(
      "Widget Installed Successfully"
    );

    /* =========================================
       SUCCESS RESPONSE
    ========================================= */

    res.send(
      "Jelly AI Installed Successfully 🚀"
    );

  } catch (error) {

    console.error(error);

    res
      .status(500)
      .send("OAuth failed");

  }

});

export default router;
