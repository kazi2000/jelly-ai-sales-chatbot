import express from "express";
import { supabase } from "../models/supabaseClient.js";

const router = express.Router();

const plans = {
  starter: { limit: 1000 },
  growth: { limit: 5000 },
  pro: { limit: 150000 }
};

router.post("/upgrade-plan", async (req, res) => {
  const { store_id, selected_plan } = req.body;

  const plan = plans[selected_plan];

  if (!plan) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  await supabase
    .from("stores")
    .update({
      plan_type: selected_plan,
      plan_limit: plan.limit,
      messages_used: 0,
      billing_cycle_start: new Date()
    })
    .eq("id", store_id);

  res.json({ success: true });
});

export default router;
