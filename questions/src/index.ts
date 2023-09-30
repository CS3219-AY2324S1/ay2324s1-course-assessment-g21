import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import cors, { CorsOptions } from "cors";
import http from "http";
import mongoose from "mongoose";
import router from "./router";

const MONGO_URL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/questions";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", console.error);

const corsOptions: CorsOptions = {
  origin: "*",
};

const app = express();

app.use(cors(corsOptions));
app.use(compression());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(4000, () => {
  console.log("Server is listening on port 4000");
});

app.use("/api/v1/", router());