import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as mongoose from "mongoose";
// import { getEnvironmentVariables } from "./enviroments/environment";
// import UserRouter from "./router/UserRouter";
// import ProfileRouter from "./router/ProfileRouter";
import * as dotenv from "dotenv";
import UserRouter from "./router/UserRouter";

const dotEnv = () => {
  dotenv.config({ path: ".env" });
};

const connectToMongoDb = async (dbUri) => {
  try {
    await mongoose.connect(dbUri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Failed to connect to mongoDb", err);
  }
};

const configureApp = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use("/api/user", UserRouter);
  //   app.use("/api/profile", ProfileRouter);
  // app.use("/api/banner", BannerRouter);
};

const error404Handler = (app) => {
  app.use((req, res) => {
    res.status(404).json({
      message: "Not Found",
      status_code: 404,
    });
  });
};

const errorHandler = (error, req, res, next) => {
  const errorStatus = req.errorStatus || 500;
  res.status(errorStatus).json({
    message: error.message || "Something went wrong!",
    status_code: errorStatus,
  });
};

export const createServer = async () => {
  const app: express.Application = express();
  dotEnv();
  await connectToMongoDb(process.env.DEV_DB_URI);
  configureApp(app);

  // Define routes

  // 404 Not Found handler
  app.use(error404Handler);

  // Error handling middleware
  app.use(errorHandler);

  return app;
};
