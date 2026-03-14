# Unit Management Backend

Backend API for unit management system (capsule/cabin) with status tracking using Express.js, TypeScript, Prisma, and PostgreSQL.

## 🚀 Feature

- CRUD operations untuk unit management
- Status tracking dengan validasi transisi status
- Type validation (Capsule/Cabin)
- Response formatting otomatis (Title Case)
- RESTful API design
- Database PostgreSQL dengan Prisma ORM

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for development without Docker)
- npm atau yarn

## 🐳 Running with Docker

### Quick Start

**IMPORTANT:** Docker is only for backend applications. PostgreSQL must be running on the host machine.

1. **Make sure PostgreSQL is running on the host**

   ```bash
   # Cek PostgreSQL status
   psql -U postgres -c "SELECT version();"
   ```

2. **Setup environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and make sure `DATABASE_URL` uses `host.docker.internal`:

   ```env
   DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/unit_management
   PORT=3001
   ```

3. **Run Using Docker Compose**

   ```bash
   docker-compose up -d
   ```

4. **Check status services**

   ```bash
   docker-compose ps
   ```

5. **Lihat logs**
   ```bash
   docker-compose logs -f
   ```

The server will run at `http://localhost:3001`

### Docker Commands

```bash
# Start services
docker compose up -d --build

# Stop services
docker-compose down

# Stop and delete volumes (database will be deleted)
docker-compose down -v

# View logs
docker-compose logs -f app

# Restart certain services
docker-compose restart app
```

## 💻 Running Without Docker (Development)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Setup environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/unit_management
   PORT=3001
   ```

3. **Setup database (make sure PostgreSQL is running)**

   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Base URL

```
http://localhost:3001
```

### Health Check

```http
GET /
```

### Units

#### Create Unit

```http
POST /api/units
Content-Type: application/json

{
  "name": "Unit A1",
  "type": "capsule",
  "status": "available"
}
```

**Valid Types:** `capsule`, `cabin`  
**Valid Status:** `available`, `occupied`, `cleaning`, `maintenance`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Unit A1",
    "type": "Capsule",
    "status": "Available",
    "lastUpdated": "2026-03-14T14:00:00.000Z"
  }
}
```

#### Get All Units

```http
GET /api/units
GET /api/units?status=available
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Unit A1",
      "type": "Capsule",
      "status": "Available",
      "lastUpdated": "2026-03-14T14:00:00.000Z"
    }
  ]
}
```

#### Get Unit by ID

```http
GET /api/units/:id
```

#### Update Unit Status

```http
PUT /api/units/:id
Content-Type: application/json

{
  "status": "occupied"
}
```

**Status Transition Rules:**

- `available` → `occupied`, `maintenance`
- `occupied` → `cleaning`, `maintenance`
- `cleaning` → `available`, `maintenance`
- `maintenance` → `available`, `cleaning`

#### Delete Unit

```http
DELETE /api/units/:id
```

## 🗂️ Project Structure

```
.
├── src/
│   ├── controller/
│   │   └── unit.controller.ts
│   ├── routes/
│   │   └── unit.routes.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── notFound.ts
│   ├── utils/
│   │   └── statusValidation.ts
│   ├── lib/
│   │   └── prisma.ts
│   ├── app.ts
│   └── server.ts
├── prisma/
│   └── schema.prisma
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🔧 Environment Variables

| Variable       | Description                  | Default |
| -------------- | ---------------------------- | ------- |
| `DATABASE_URL` | PostgreSQL connection string | -       |
| `PORT`         | Server port                  | 3001    |

## 🛠️ Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Express.js 5
- **Language:** TypeScript
- **Database:** PostgreSQL 16
- **ORM:** Prisma 7
- **Containerization:** Docker & Docker Compose

## 📝 Database Schema

```prisma
model Unit {
  id          String   @id @default(uuid())
  name        String
  type        Type
  status      Status   @default(available)
  lastUpdated DateTime @updatedAt
}

enum Type {
  capsule
  cabin
}

enum Status {
  available
  occupied
  cleaning
  maintenance
}
```

## 🧪 Testing API

Use tools such as:

- Postman
- Thunder Client (VS Code Extension)
- curl
- HTTPie

Contoh dengan curl:

```bash
# Create unit
curl -X POST http://localhost:3001/api/units \
  -H "Content-Type: application/json" \
  -d '{"name":"Unit A1","type":"capsule","status":"available"}'

# Get all units
curl http://localhost:3001/api/units

# Update status
curl -X PATCH http://localhost:3001/api/units/{id}/status \
  -H "Content-Type: application/json" \
  -d '{"status":"occupied"}'
```

## 🐛 Troubleshooting

### Container cannot connect to database

```bash
# Check status database
docker-compose logs postgres

# Restart services
docker-compose restart
```

### Port already in use

Edit `docker-compose.yml` to change the port mapping:

```yaml
ports:
  - "3001:3001" # Change port host (3001)
```
