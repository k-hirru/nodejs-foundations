const express = require("express");
const morgan = require("morgan");
const notesRouter = require("./routes/notes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(notesRouter);
app.use(errorHandler);

module.exports = app;

