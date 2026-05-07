// comment-api.test.js
const request = require("supertest");
const createApp = require("./comment-api");

describe("Comments API", () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  // Create comment
  describe("POST /comments", () => {
    test("creates a comment with text and author", async () => {
      const res = await request(app)
        .post("/comments")
        .send({ text: "Test post", author: "Khirru" });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(Number),
        text: "Test post",
        author: "Khirru",
      });
    });

    test("returns 400 when text is missing", async () => {
      const res = await request(app)
        .post("/comments")
        .send({ author: "Khirru" });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    test("returns 400 when author is missing", async () => {
      const res = await request(app)
        .post("/comments")
        .send({ text: "Test post" });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  // Get all comments
  describe("GET /comments", () => {
    test("returns all comments", async () => {
      await request(app)
        .post("/comments")
        .send({ text: "Test post 1", author: "Khirru" });
      await request(app)
        .post("/comments")
        .send({ text: "Test post 2", author: "Clyde" });

      const res = await request(app).get("/comments");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({
        text: "Test post 1",
        author: "Khirru",
      });
      expect(res.body[1]).toMatchObject({
        text: "Test post 2",
        author: "Clyde",
      });
    });

    test("returns an empty array when there are no comments", async () => {
      const res = await request(app).get("/comments");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  // Get specific comment
  describe("GET /comments/:id", () => {
    test("returns a single comment by id", async () => {
      const created = await request(app)
        .post("/comments")
        .send({ text: "Test post", author: "Khirru" });
      const { id } = created.body;

      const res = await request(app).get(`/comments/${id}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ id, text: "Test post", author: "Khirru" });
    });

    test("returns 404 for a non-existent id", async () => {
      const res = await request(app).get("/comments/999");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });
});
