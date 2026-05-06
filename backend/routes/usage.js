import express from "express";
import { supabase } from "../models/supabaseClient.js";

const router = express.Router();

router.get("/:store_id", async (req, res) => {
  const { store_id } = req.params;

  const { data } = await supabase
    .from("stores")
    .select("messages_used, plan_limit")
    .eq("id", store_id)
    .single();

  res.json(data);
});

export default router;
