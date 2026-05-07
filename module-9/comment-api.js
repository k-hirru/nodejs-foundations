// comment-api.js
const express = require("express");

function createApp() {
  const app = express();
  app.use(express.json());

  const comments = [];
  let nextId = 1;

  app.post("/comments", (req, res) => {
    const { text, author } = req.body;
    if (!text || !author) {
      return res.status(400).json({ error: "text and author are required" });
    }
    const comment = { id: nextId++, text, author };
    comments.push(comment);
    res.status(201).json(comment);
  });

  app.get("/comments", (req, res) => {
    res.json(comments);
  });

  app.get("/comments/:id", (req, res) => {
    const comment = comments.find((c) => c.id === Number(req.params.id));
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(comment);
  });

  return app;
}

module.exports = createApp;
