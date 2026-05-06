import express from "express";
import dotenv from "dotenv";

import chatRoutes from "./routes/chat.js";
import planRoutes from "./routes/plan.js";
import usageRoutes from "./routes/usage.js";
import storeRoutes from "./routes/store.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api", chatRoutes);
app.use("/api", planRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api", storeRoutes);

app.get("/", (req, res) => {
  res.send("Jelly AI Backend Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
