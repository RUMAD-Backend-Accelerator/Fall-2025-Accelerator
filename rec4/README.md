# REC4: PostgreSQL Books CRUD Demo with Docker

This project is a Dockerized version of the week6 Supabase demo, migrated to use standalone PostgreSQL with Docker containers. It features a **web-based interface** for demonstrating CRUD operations on a books database using Node.js, Express, and PostgreSQL.

## 📋 Overview

- **Source**: Migrated from `week6/` Supabase demo
- **Database**: PostgreSQL 15 (Alpine)
- **Backend**: Node.js 18 with Express.js + `pg` library
- **Frontend**: Interactive HTML/CSS/JavaScript web interface
- **Environments**: Demo and Beta configurations

## 🌐 Web Interface

The application now features a full web interface instead of command-line demos. Access it through your browser to interact with all CRUD operations:

- **Home Page**: Navigation to different operation categories
- **Read Operations**: Browse, search, and filter books
- **Create Operations**: Add new books and comments
- **Update Operations**: Modify book details and ratings
- **Delete Operations**: Remove books (with safety features)

## 🏗️ Project Structure

```
rec4/
├── docker-compose.demo.yml    # Demo environment configuration
├── docker-compose.beta.yml    # Beta environment configuration
├── Dockerfile                 # Node.js application container
├── package.json              # Node.js dependencies
├── .env.demo                 # Demo environment variables (template)
├── .env.beta                 # Beta environment variables (template)
├── src/
│   ├── server.js            # Express API server
│   ├── demo.js              # Original CLI demo (still available)
│   ├── demoFunctions.js     # Demo helper functions
│   ├── booksCrud.js         # CRUD operations
│   └── dbClient.js          # PostgreSQL connection pool
├── public/                   # Frontend files
│   ├── index.html           # Main landing page
│   ├── read.html            # Read operations page
│   ├── create.html          # Create operations page
│   ├── update.html          # Update operations page
│   ├── delete.html          # Delete operations page
│   ├── css/
│   │   └── style.css        # Shared styles
│   └── js/
│       ├── read.js          # Read operations logic
│       ├── create.js        # Create operations logic
│       ├── update.js        # Update operations logic
│       └── delete.js        # Delete operations logic
└── sql/
    └── init.sql             # Database initialization script
```

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose installed on your system
- No need for Node.js or PostgreSQL locally - Docker handles everything!

### Running the Demo Environment

1. **Navigate to the rec4 directory**:
   ```bash
   cd rec4
   ```

2. **Start the containers**:
   ```bash
   docker-compose -f docker-compose.demo.yml up --build
   ```

   This will:
   - Create a PostgreSQL container with the books database
   - Initialize the database with sample data from week6
   - Build and run the Node.js Express application
   - Start the web server on port 3000

3. **Access the web interface**:
   - Open your browser and go to: **http://localhost:3000**
   - Navigate through the different CRUD operation pages
   - Interact with the database through the web interface

4. **Stop the containers**:
   ```bash
   # Press Ctrl+C in the terminal, then:
   docker-compose -f docker-compose.demo.yml down
   ```

5. **Clean up (remove volumes)**:
   ```bash
   docker-compose -f docker-compose.demo.yml down -v
   ```

### Running the Beta Environment

1. **Start the beta environment**:
   ```bash
   docker-compose -f docker-compose.beta.yml up --build
   ```

   Beta environment differences:
   - Uses port `5433` for database (externally)
   - Uses port `3001` for web interface
   - Separate database name: `booksdb_beta`
   - Separate Docker volumes
   - Can run simultaneously with demo environment

2. **Access the beta web interface**:
   - Open your browser and go to: **http://localhost:3001**

3. **Stop the beta environment**:
   ```bash
   docker-compose -f docker-compose.beta.yml down
   ```

## 🔧 Configuration

### Environment Variables

Both environments use environment variables defined in their respective compose files:

**Demo** (`.env.demo`):
- `DB_HOST=postgres`
- `DB_PORT=5432`
- `DB_NAME=booksdb`
- `DB_USER=postgres`
- `DB_PASSWORD=postgres`

**Beta** (`.env.beta`):
- `DB_HOST=postgres`
- `DB_PORT=5432` (internal)
- `DB_NAME=booksdb_beta`
- `DB_USER=postgres`
- `DB_PASSWORD=postgres_beta_secure_password`

### Customizing the Demo

The original CLI demo is still available:

1. **Run CLI demo instead of web server**:
   Edit `docker-compose.demo.yml` and change the command:
   ```yaml
   command: ["npm", "run", "demo"]
   ```

2. **Edit which CLI functions run**:
   Modify `src/demo.js` and uncomment the functions you want:
   ```javascript
   // READ examples
   await showAllBooks()
   await showOneBook()
   
   // CREATE examples
   await createNewBook()
   
   // etc.
   ```

3. **Customize the web interface**:
   - Edit HTML files in `public/` directory
   - Modify styles in `public/css/style.css`
   - Update JavaScript logic in `public/js/` files

4. **Rebuild and restart**:
   ```bash
   docker-compose -f docker-compose.demo.yml up --build
   ```

## 🗄️ Database Access

### Connect to PostgreSQL directly

**Demo environment**:
```bash
docker exec -it books-db-demo psql -U postgres -d booksdb
```

**Beta environment**:
```bash
docker exec -it books-db-beta psql -U postgres -d booksdb_beta
```

### Connect from host machine

**Demo** (port 5432):
```bash
psql -h localhost -p 5432 -U postgres -d booksdb
```

**Beta** (port 5433):
```bash
psql -h localhost -p 5433 -U postgres -d booksdb_beta
```

Password: `postgres` (demo) or `postgres_beta_secure_password` (beta)

## 📊 Available CRUD Operations

All operations from week6 are available through both the web interface and REST API:

### READ Operations
- **Show All Books** - `GET /api/books` - List all books in the database
- **Get One Book** - `GET /api/books/:id` - Retrieve a specific book by ID
- **Filter by Genre** - `GET /api/books/genre/:genre` - Get books by genre (e.g., Fantasy)
- **Search Books** - `GET /api/books/search/:term` - Search by title or author
- **Top Rated Books** - `GET /api/books/top/:rating` - Get highly rated books (e.g., 4.5+)

### CREATE Operations
- **Create New Book** - `POST /api/books` - Add a new book to the database
- **Add Comment** - `POST /api/books/:id/comments` - Add a comment to a book

### UPDATE Operations
- **Update Book Details** - `PUT /api/books/:id` - Modify book information
- **Update Rating** - `PUT /api/books/:id/rating` - Change a book's rating

### DELETE Operations
- **Delete Book** - `DELETE /api/books/:id` - Remove a book from the database

### Web Pages
- **`/`** - Home page with navigation
- **`/read.html`** - Read operations interface
- **`/create.html`** - Create operations interface
- **`/update.html`** - Update operations interface
- **`/delete.html`** - Delete operations interface

## 🔄 Differences from Week6

| Aspect | Week6 (Supabase) | REC4 (PostgreSQL + Docker) |
|--------|------------------|----------------------------|
| Database | Supabase (cloud) | PostgreSQL (local Docker) |
| Client Library | `@supabase/supabase-js` | `pg` (node-postgres) |
| Backend | Node.js scripts | Express.js REST API |
| Interface | Command-line | Web browser |
| Authentication | Supabase Auth | Not required (local) |
| RLS | Enabled | Not needed (local) |
| Queries | Supabase Query Builder | Raw SQL |
| Setup | Cloud configuration | Docker Compose |
| Environments | Single | Demo & Beta |
| Port Access | N/A | 3000 (demo), 3001 (beta) |

## 🐛 Troubleshooting

### Container fails to start
```bash
# Check logs
docker-compose -f docker-compose.demo.yml logs

# Ensure ports aren't in use
lsof -i :5432
```

### Database connection errors
```bash
# Restart the database container
docker-compose -f docker-compose.demo.yml restart postgres

# Check database health
docker exec books-db-demo pg_isready -U postgres
```

### Reset database
```bash
# Stop containers and remove volumes
docker-compose -f docker-compose.demo.yml down -v

# Start fresh
docker-compose -f docker-compose.demo.yml up --build
```

### View real-time logs
```bash
# All services
docker-compose -f docker-compose.demo.yml logs -f

# Just the app
docker-compose -f docker-compose.demo.yml logs -f app

# Just the database
docker-compose -f docker-compose.demo.yml logs -f postgres
```

## 🎯 Quick Commands

```bash
# Build and run demo (web interface on port 3000)
docker-compose -f docker-compose.demo.yml up --build

# Run in detached mode (background)
docker-compose -f docker-compose.demo.yml up -d

# View logs
docker-compose -f docker-compose.demo.yml logs -f app

# Stop containers
docker-compose -f docker-compose.demo.yml down

# Clean everything (including volumes)
docker-compose -f docker-compose.demo.yml down -v

# Run beta environment (web interface on port 3001)
docker-compose -f docker-compose.beta.yml up --build

# Access web interfaces
# Demo: http://localhost:3000
# Beta: http://localhost:3001
```

## 📝 Notes

- The `week6/` directory remains unchanged
- All files are created only in `rec4/`
- PostgreSQL data persists in Docker volumes
- Each environment (demo/beta) has isolated data
- The app container exits after running the demo (use `-d` flag to keep running)

## 🎓 Learning Objectives

This migration demonstrates:
1. Converting Supabase SDK to native PostgreSQL
2. Dockerizing Node.js applications with PostgreSQL
3. Multi-container orchestration with Docker Compose
4. Managing multiple environments with Docker
5. Database initialization in Docker
6. PostgreSQL connection pooling with `pg`
7. Building REST APIs with Express.js
8. Creating interactive web interfaces for database operations
9. Frontend-backend integration patterns
10. CRUD operations through both API and UI

## 🚀 Getting Started (Quick Start)

1. **Ensure Docker is running** on your machine

2. **Navigate to rec4**:
   ```bash
   cd rec4
   ```

3. **Start the demo environment**:
   ```bash
   docker-compose -f docker-compose.demo.yml up --build
   ```

4. **Open your browser** and visit:
   ```
   http://localhost:3000
   ```

5. **Explore the interface**:
   - Click on different operation categories
   - Try creating a book
   - Search and filter books
   - Update ratings
   - Test the delete functionality

6. **When finished**:
   ```bash
   # Press Ctrl+C in the terminal
   docker-compose -f docker-compose.demo.yml down
   ```

That's it! The web interface makes it easy to interact with all CRUD operations without writing any code.

---

**Original Source**: `week6/` - Supabase Books CRUD Demo  
**Migrated By**: REC4 Docker Migration  
**Date**: November 21, 2025
