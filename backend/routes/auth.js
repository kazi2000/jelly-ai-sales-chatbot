import express from "express";

const router = express.Router();

// STEP 1 — Redirect merchant to Shopify install page

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

// STEP 2 — Shopify callback

router.get("/auth/callback", async (req, res) => {

  const { shop, code } = req.query;

  try {

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
      "Access Token:",
      data.access_token
    );

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
