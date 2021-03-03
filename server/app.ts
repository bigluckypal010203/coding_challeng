import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import passport from "passport";
import cors from "cors";

import logger from "./utils/logger";
import userRouter from "./api/resurces/user/user.route";
import { auth } from "./api/libs/auth";
import { config } from "./config/index";
import { prodError, devError } from "./api/libs/errorHandler";

passport.use(auth);
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  morgan("short", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
app.use(passport.initialize());
app.use("/api/users", userRouter);

if (config.env === "prod") {
  app.use(prodError);
} else {
  app.use(devError);
}

export default app;
