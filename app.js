const debug = require("debug")("FILESTRANS:server");
const express = require("express");
const app = express();
const http = require("http");
const mongoose = require("mongoose");
const path = require("path");
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
const flash = require("express-flash");
const session = require("express-session");

const { router } = require("./routes/router");

const dbURI =
  "mongodb+srv://any1:nodejs123456@nodetuts.h71vm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
app.use(express.static("./uploads"));
app.use(express.static(path.join(`${__dirname}/public`)));
app.set("view engine", "pug");
app.set("views", path.join(`${__dirname}/views`));
app.use(express.urlencoded({ extended: true }));
app.use(flash());

app.use(
  session({
    cookie: { maxAge: 5000 },
    secret: "sl", //  change secrets..
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", router);

app.use((req, res, next) => {
  next(res.status(404).render("404", { title: "Page Not Found" }));
});

mongoose.connect(dbURI).then(() => {
  server.listen(PORT);
  server.on("error", onError);
  server.on("listening", onListening);
});

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
