# Notes API

A REST API for managing notes, built with Express, Prisma, and SQLite.

---

## Requirements

- Node.js v18+
- npm

---

## Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

The default `.env` works out of the box for local development:

```
DATABASE_URL="file:./dev.db"
```

3. Generate the Prisma client:

```bash
npx prisma generate
```

4. Run migrations to create the database:

```bash
npm run db:migrate
```

Or on a fresh clone where no migration name has been set yet:

```bash
npm run db:migrate -- --name init
```
---

## Running the server

**Development** (with auto-restart on file changes):

```bash
npm run dev
```

**Production:**

```bash
npm start
```

The server runs at `http://localhost:3000` by default. Set a `PORT` environment variable to override.

---

## Testing

Run the full test suite:

```bash
npm test notes.test.js
```

Run tests with coverage report:

```bash
npm run test:coverage
```

---

## Database

Open Prisma Studio to browse and edit data visually:

```bash
npm run db:studio
```

To create a new migration after changing `prisma/schema.prisma`:

```bash
npm run db:migrate
```

---

## Endpoints

### Health

| Method | Path      | Description        | Status |
|--------|-----------|--------------------|--------|
| GET    | /health   | Server health check | 200   |

### Notes

| Method | Path          | Description              | Status codes   |
|--------|---------------|--------------------------|----------------|
| GET    | /notes        | List all notes           | 200            |
| GET    | /notes/:id    | Get a single note        | 200, 404       |
| POST   | /notes        | Create a new note        | 201, 400       |
| PUT    | /notes/:id    | Update a note            | 200, 400, 404  |
| DELETE | /notes/:id    | Delete a note            | 204, 404       |

### GET /notes — Query Parameters

| Parameter | Type   | Description                              | Example               |
|-----------|--------|------------------------------------------|-----------------------|
| tag       | string | Filter by tag                            | `?tag=work`           |
| q         | string | Case-insensitive search in title/content | `?q=meeting`          |
| page      | number | Page number (starts at 1)                | `?page=2`             |
| limit     | number | Results per page                         | `?limit=10`           |
| sort      | string | Sort by field and direction              | `?sort=title:asc`     |

Sortable fields: `title`, `content`, `tag`, `createdAt`, `updatedAt`

Paginated response shape:

```json
{
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "data": [...]
}
```

### POST /notes — Request Body

```json
{
  "title": "string (required, max 100 chars)",
  "content": "string (required, max 5000 chars)",
  "tag": "string (optional)"
}
```

### PUT /notes/:id — Request Body

All fields are optional. Only provided fields are updated.

```json
{
  "title": "string (max 100 chars)",
  "content": "string (max 5000 chars)",
  "tag": "string"
}
```
