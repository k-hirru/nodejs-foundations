const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// app.get("/slow", async (req, res, next) => {
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   throw new Error("Something went wrong");
// });

app.get("/slow", async (req, res, next) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    throw new Error("Something went wrong");
  } catch (err) {
    next(err);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Async Errors API running at http://localhost:${PORT}`);
});
