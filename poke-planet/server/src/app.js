import cors from "cors";
import express from "express";
import helmet from "helmet";

import { config } from "./config.js";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

export function createApp() {
  const app = express();

  app.use(helmet());

  app.use(
    cors({
      origin(origin, callback) {
        /*
         * Requests from command-line tools and tests
         * may not include an Origin header.
         */
        if (!origin || config.clientOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },

      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.use(
    express.json({
      limit: "50kb",
    }),
  );

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
    });
  });

  app.use("/api/auth", authRoutes);

  app.use("/api/game", gameRoutes);

  app.use((error, _req, res, _next) => {
    const status = Number(error.status ?? 500);

    if (status >= 500) {
      console.error(error);
    }

    res.status(status).json({
      error: status >= 500 ? "Internal server error." : error.message,
    });
  });

  return app;
}
