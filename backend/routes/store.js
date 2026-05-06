import express from "express";
import { supabase } from "../models/supabaseClient.js";

const router = express.Router();

router.post("/create-store", async (req, res) => {

  const { store_name } = req.body;

  const { data, error } = await supabase
    .from("stores")
    .insert({
      store_name,
      plan_type: "free",
      messages_used: 0,
      plan_limit: 100,
      billing_cycle_start: new Date()
    })
    .select();

  if (error) {
    return res.status(500).json({ error });
  }

  res.json(data);

});

export default router;
