require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createServer } = require("http");

const { handleError } = require("./helpers/error.helper");
const { normalizePort, onServerError, onServerListening } = require("./helpers/core.helper");
const { AppConfig } = require("./config");
const routes = require("./routes");

const app = express();
const server = createServer(app);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/resources/views"));
app.use(`/${process.env.STATIC_DIR}`, express.static(path.resolve(__dirname, '../', process.env.FOLDER_ROOT)));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(routes);
app.use((err, req, res, next) => {
  handleError(err, res);
});

app.locals = {
  PAGE_TITLE: AppConfig.name,
  PAGE_URL: `${process.env.APP_URL}:${process.env.APP_PORT}`,
};

const port = normalizePort(AppConfig.port);
app.set("port", port);

server.listen(port);
server.on("listening", onServerListening.bind(this));
server.on("error", onServerError);