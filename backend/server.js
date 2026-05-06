import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import chatRoutes from "./routes/chat.js";
import planRoutes from "./routes/plan.js";
import usageRoutes from "./routes/usage.js";
import storeRoutes from "./routes/store.js";
import authRoutes from "./routes/auth.js";
import testRoutes from "./routes/test.js";

dotenv.config();

const app = express();

/* =========================================
   MIDDLEWARE
========================================= */

app.use(cors());

app.use(express.json());

/* =========================================
   API ROUTES
========================================= */

app.use("/api", chatRoutes);

app.use("/api", planRoutes);

app.use("/api/usage", usageRoutes);

app.use("/api", storeRoutes);

/* =========================================
   SHOPIFY AUTH ROUTES
========================================= */

app.use("/", authRoutes);

/* =========================================
   TEST ROUTES
========================================= */

app.use("/", testRoutes);

/* =========================================
   HEALTH CHECK
========================================= */

app.get("/", (req, res) => {

  res.send(
    "Jelly AI Backend Running 🚀"
  );

});

/* =========================================
   START SERVER
========================================= */

app.listen(process.env.PORT, () => {

  console.log(
    `Server running on port ${process.env.PORT}`
  );

});
