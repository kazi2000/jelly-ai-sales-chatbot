import express from "express";
import { supabase } from "../models/supabaseClient.js";
import { generateReply } from "../services/openaiService.js";
import { checkUsageLimit } from "../utils/usageCheck.js";
import { resetBillingIfNeeded } from "../utils/resetBilling.js";
import { getProducts } from "../services/shopifyService.js";

const router = express.Router();

router.post("/chat", async (req, res) => {

  const {
    store_id,
    message,
    conversation_id
  } = req.body;

  try {

    // Get Store
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("*")
      .eq("id", store_id)
      .single();

    // Store not found
    if (!store || storeError) {
      return res.status(404).json({
        reply: "Store not found"
      });
    }

    // Reset Billing
    await resetBillingIfNeeded(store, supabase);

    // Usage Limit Check
    const allowed = await checkUsageLimit(store);

    if (!allowed) {
      return res.json({
        reply:
          "You have reached your usage limit. Please upgrade your plan."
      });
    }

    // Save User Message
    await supabase
      .from("messages")
      .insert({
        conversation_id,
        sender: "user",
        message
      });

    // Get Products
    const products = await getProducts();

    // AI Reply
    const aiReply = await generateReply(
      message,
      products
    );

    // Save AI Message
    await supabase
      .from("messages")
      .insert({
        conversation_id,
        sender: "ai",
        message: aiReply
      });

    // Increment Usage
    await supabase
      .from("stores")
      .update({
        messages_used:
          store.messages_used + 1
      })
      .eq("id", store_id);

    // Send Response
    res.json({
      reply: aiReply
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      reply: "Something went wrong"
    });

  }

});

export default router;
