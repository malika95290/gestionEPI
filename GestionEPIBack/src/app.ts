//********** Imports **********//
import express from "express";
import cors from "cors";
import * as middlewares from "./middlewares";

import epiController from "./pages/epiController";
import controleController from "./pages/controleController";
import userController from "./pages/userController";
// import controleController from "./pages/controleController";

require("dotenv").config();

//********** Server **********//
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
// Initializing express.
const app = express();
// Enable CORS
app.use(cors(options));
// Middleware to parse json throught requests.
app.use(express.json());

//Routes de l'API
app.use('/api/epis', epiController);
app.use('/api/controles/', controleController)
app.use('/api/users/', userController)

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
