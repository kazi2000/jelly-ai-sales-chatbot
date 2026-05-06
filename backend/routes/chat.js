import express from "express";
import { supabase } from "../models/supabaseClient.js";
import { generateReply } from "../services/openaiService.js";
import { checkUsageLimit } from "../utils/usageCheck.js";
import { resetBillingIfNeeded } from "../utils/resetBilling.js";
import { getProducts } from "../services/shopifyService.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { store_id, message, conversation_id } = req.body;

  try {
    // Get store
    const { data: store } = await supabase
      .from("stores")
      .select("*")
      .eq("id", store_id)
      .single();

    // Reset billing if needed
    await resetBillingIfNeeded(store, supabase);

    // Check usage limit
    const allowed = await checkUsageLimit(store);

    if (!allowed) {
      return res.json({
        reply: "You have reached your usage limit. Please upgrade your plan."
      });
    }

    // Save user message
    await supabase.from("messages").insert({
      conversation_id,
      sender: "user",
      message
    });

    // Generate AI response
    const products = await getProducts();

const aiReply = await generateReply(
  message,
  products
);

    // Save AI message
    await supabase.from("messages").insert({
      conversation_id,
      sender: "ai",
      message: aiReply
    });

    // Increment usage
    await supabase
      .from("stores")
      .update({
        messages_used: store.messages_used + 1
      })
      .eq("id", store_id);

    res.json({ reply: aiReply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
