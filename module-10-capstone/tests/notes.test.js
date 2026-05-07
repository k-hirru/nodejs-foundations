const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/db");

beforeEach(async () => {
  await prisma.note.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// POST ROUTE
describe("POST /notes", () => {
  it("creates a note and returns 201", async () => {
    const res = await request(app)
      .post("/notes")
      .send({ title: "test title", content: "test content" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      title: "test title",
      content: "test content",
    });
  });

  it("creates a note with optional tag and returns 201", async () => {
    const res = await request(app)
      .post("/notes")
      .send({ title: "test title", content: "test content", tag: "test tag" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      title: "test title",
      content: "test content",
      tag: "test tag",
    });
  });

  it("returns a 400 error when title is missing", async () => {
    const res = await request(app)
      .post("/notes")
      .send({ content: "test title" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns a 400 error when content is missing", async () => {
    const res = await request(app).post("/notes").send({ title: "test title" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns a 400 error when title over 100 characters long", async () => {
    const res = await request(app)
      .post("/notes")
      .send({ title: "a".repeat(101) });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns a 400 error when content over 5000 characters long", async () => {
    const res = await request(app)
      .post("/notes")
      .send({ title: "a", content: "test title".repeat(5001) });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

// GET ROUTE
describe("GET /notes", () => {
  it("gets all notes an returns 200", async () => {
    await request(app)
      .post("/notes")
      .send({ title: "test title 1", content: "test content 1" });
    await request(app)
      .post("/notes")
      .send({ title: "test title 2", content: "test content 2" });

    const res = await request(app).get("/notes");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[1]).toMatchObject({ // Reversed [1] and [0] because the notes are sorted by latest
      title: "test title 1",
      content: "test content 1",
    });
    expect(res.body.data[0]).toMatchObject({ // Reversed [1] and [0] because the notes are sorted by latest
      title: "test title 2",
      content: "test content 2",
    });
  });

  // Pagination tests
  it("returns paginated results when page and limit are provided", async () => {
    for (let i = 1; i <= 8; i++) {
      await request(app).post("/notes").send({ title: `note ${i}`, content: `content ${i}` });
    }

    const res = await request(app).get("/notes?page=1&limit=5");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(5);
    expect(res.body.total).toBe(8);
    expect(res.body.totalPages).toBe(2);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(5);
  });

  it("returns all notes when no pagination params are provided", async () => {
    for (let i = 1; i <= 3; i++) {
      await request(app).post("/notes").send({ title: `note ${i}`, content: `content ${i}` });
    }

    const res = await request(app).get("/notes");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.total).toBe(3);
  });

  it("returns empty data array when page exceeds total pages", async () => {
    await request(app).post("/notes").send({ title: "only note", content: "content" });

    const res = await request(app).get("/notes?page=999&limit=10");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
    expect(res.body.total).toBe(1);
  });

  // Filtering tests
  it("shows only notes with matching tag when tag filter is applied", async () => {
    await request(app).post("/notes").send({ title: "work note", content: "content", tag: "work" });
    await request(app).post("/notes").send({ title: "personal note", content: "content", tag: "personal" });
    await request(app).post("/notes").send({ title: "another work note", content: "content", tag: "work" });

    const res = await request(app).get("/notes?tag=work");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data.every((n) => n.tag === "work")).toBe(true);
  });

  it("returns no notes when tag has no matches", async () => {
    await request(app).post("/notes").send({ title: "work note", content: "content", tag: "work" });

    const res = await request(app).get("/notes?tag=nonexistent");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
    expect(res.body.total).toBe(0);
  });

  // Search tests
  it("returns notes matching search query in title or content", async () => {
    await request(app).post("/notes").send({ title: "hello world", content: "some content" });
    await request(app).post("/notes").send({ title: "other note", content: "contains hello here" });
    await request(app).post("/notes").send({ title: "unrelated", content: "nothing matching" });

    const res = await request(app).get("/notes?q=hello");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it("returns empty results when search query has no matches", async () => {
    await request(app).post("/notes").send({ title: "hello world", content: "some content" });

    const res = await request(app).get("/notes?q=nonexistent");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("performs case-insensitive search", async () => {
    await request(app).post("/notes").send({ title: "Hello World", content: "some content" });

    const res = await request(app).get("/notes?q=HELLO");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe("Hello World");
  });

  // Sorting tests
  it("sorts notes by createdAt descending by default", async () => {
    await request(app).post("/notes").send({ title: "first note", content: "content" });
    await request(app).post("/notes").send({ title: "second note", content: "content" });
    await request(app).post("/notes").send({ title: "third note", content: "content" });

    const res = await request(app).get("/notes");
    expect(res.status).toBe(200);
    expect(res.body.data[0].title).toBe("third note");
    expect(res.body.data[2].title).toBe("first note");
  });

  it("sorts notes by specified field and direction", async () => {
    await request(app).post("/notes").send({ title: "ccc note", content: "content" });
    await request(app).post("/notes").send({ title: "aaa note", content: "content" });
    await request(app).post("/notes").send({ title: "bbb note", content: "content" });

    const res = await request(app).get("/notes?sort=title:asc");
    expect(res.status).toBe(200);
    expect(res.body.data[0].title).toBe("aaa note");
    expect(res.body.data[1].title).toBe("bbb note");
    expect(res.body.data[2].title).toBe("ccc note");
  });

  it("ignores invalid sort parameters and defaults to createdAt descending", async () => {
    await request(app).post("/notes").send({ title: "first note", content: "content" });
    await request(app).post("/notes").send({ title: "second note", content: "content" });

    const res = await request(app).get("/notes?sort=invalid:asc");
    expect(res.status).toBe(200);
    expect(res.body.data[0].title).toBe("second note");
  });

  // Error handling
  it("handles invalid page parameter gracefully", async () => {
    await request(app).post("/notes").send({ title: "a note", content: "content" });

    const res = await request(app).get("/notes?page=invalid");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("handles invalid limit parameter gracefully", async () => {
    await request(app).post("/notes").send({ title: "a note", content: "content" });

    const res = await request(app).get("/notes?limit=invalid");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("handles negative page numbers correctly", async () => {
    await request(app).post("/notes").send({ title: "a note", content: "content" });

    const res = await request(app).get("/notes?page=-1");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  // Combined features
  it("combines filtering, searching, pagination, and sorting together", async () => {
    const titles = ["aaa test", "bbb test", "ccc test", "ddd test", "eee test", "fff test", "ggg test"];
    for (const title of titles) {
      await request(app).post("/notes").send({ title, content: "content", tag: "work" });
    }
    await request(app).post("/notes").send({ title: "other test", content: "content", tag: "other" });

    // page=2, limit=3, sort=title:asc → skip 3, take 3 from the 7 "work" notes sorted A-Z
    const res = await request(app).get("/notes?tag=work&q=test&page=2&limit=3&sort=title:asc");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(7);
    expect(res.body.totalPages).toBe(3);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.data[0].title).toBe("ddd test");
    expect(res.body.data[1].title).toBe("eee test");
    expect(res.body.data[2].title).toBe("fff test");
  });
});

// PUT ROUTE
describe("PUT /notes/:id", () => {
  it("updates a note and returns 200", async () => {
    const created = await request(app)
      .post("/notes")
      .send({ title: "original title", content: "original content" });

    const res = await request(app)
      .put(`/notes/${created.body.id}`)
      .send({ title: "updated title", content: "updated content" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: created.body.id,
      title: "updated title",
      content: "updated content",
    });
  });

  it("updates only the fields provided", async () => {
    const created = await request(app)
      .post("/notes")
      .send({ title: "original title", content: "original content" });

    const res = await request(app)
      .put(`/notes/${created.body.id}`)
      .send({ title: "new title" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("new title");
    expect(res.body.content).toBe("original content");
  });

  it("returns 404 when note does not exist", async () => {
    const res = await request(app)
      .put("/notes/999999")
      .send({ title: "updated title" });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 when title exceeds 100 characters", async () => {
    const created = await request(app)
      .post("/notes")
      .send({ title: "original title", content: "original content" });

    const res = await request(app)
      .put(`/notes/${created.body.id}`)
      .send({ title: "a".repeat(101) });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 when content exceeds 5000 characters", async () => {
    const created = await request(app)
      .post("/notes")
      .send({ title: "original title", content: "original content" });

    const res = await request(app)
      .put(`/notes/${created.body.id}`)
      .send({ content: "a".repeat(5001) });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

// DELETE ROUTE
describe("DELETE /notes/:id", () => {
  it("deletes a note and returns 204", async () => {
    const created = await request(app)
      .post("/notes")
      .send({ title: "to be deleted", content: "content" });

    const res = await request(app).delete(`/notes/${created.body.id}`);

    expect(res.status).toBe(204);
  });

  it("note no longer exists after deletion", async () => {
    const created = await request(app)
      .post("/notes")
      .send({ title: "to be deleted", content: "content" });

    await request(app).delete(`/notes/${created.body.id}`);

    const res = await request(app).get(`/notes/${created.body.id}`);
    expect(res.status).toBe(404);
  });

  it("returns 404 when note does not exist", async () => {
    const res = await request(app).delete("/notes/999999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});
