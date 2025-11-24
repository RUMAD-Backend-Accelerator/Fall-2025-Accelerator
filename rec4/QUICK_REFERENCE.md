# 🚀 REC4 Quick Reference Card

## One-Line Commands

### Start Demo Environment
```bash
cd rec4 && docker-compose -f docker-compose.demo.yml up --build
```

### Start Beta Environment
```bash
cd rec4 && docker-compose -f docker-compose.beta.yml up --build
```

### Stop Everything
```bash
cd rec4 && docker-compose -f docker-compose.demo.yml down && docker-compose -f docker-compose.beta.yml down
```

## Essential Commands

| Task | Command |
|------|---------|
| **Start demo** | `./start.sh demo` |
| **Start beta** | `./start.sh beta` |
| **Stop demo** | `./stop.sh demo` |
| **Stop beta** | `./stop.sh beta` |
| **Stop all** | `./stop.sh all` |
| **Clean demo** | `./stop.sh demo --clean` |
| **Clean all** | `./stop.sh all --clean` |

## Database Access

### Demo Environment
```bash
# From container
docker exec -it books-db-demo psql -U postgres -d booksdb

# From host
psql -h localhost -p 5432 -U postgres -d booksdb
```

### Beta Environment
```bash
# From container
docker exec -it books-db-beta psql -U postgres -d booksdb_beta

# From host
psql -h localhost -p 5433 -U postgres -d booksdb_beta
```

## View Logs

```bash
# All logs (demo)
docker-compose -f docker-compose.demo.yml logs -f

# App logs only
docker-compose -f docker-compose.demo.yml logs -f app

# Database logs only
docker-compose -f docker-compose.demo.yml logs -f postgres
```

## Common Tasks

### Customize Demo Functions
1. Edit `src/demo.js`
2. Uncomment functions you want to run
3. Rebuild: `docker-compose -f docker-compose.demo.yml up --build`

### Reset Database
```bash
docker-compose -f docker-compose.demo.yml down -v
docker-compose -f docker-compose.demo.yml up --build
```

### Run Both Environments Simultaneously
```bash
# Terminal 1
./start.sh demo

# Terminal 2
./start.sh beta
```

### Check Container Status
```bash
docker ps
```

### Remove Everything
```bash
./stop.sh all --clean
docker system prune -a  # Optional: clean all Docker resources
```

## File Locations

| What | Where |
|------|-------|
| **Application code** | `src/` |
| **Database schema** | `sql/init.sql` |
| **Demo config** | `docker-compose.demo.yml` |
| **Beta config** | `docker-compose.beta.yml` |
| **Container definition** | `Dockerfile` |
| **Dependencies** | `package.json` |

## Environment Variables

### Demo
- DB_HOST=postgres
- DB_PORT=5432
- DB_NAME=booksdb
- DB_USER=postgres
- DB_PASSWORD=postgres

### Beta
- DB_HOST=postgres
- DB_PORT=5432 (internal)
- DB_NAME=booksdb_beta
- DB_USER=postgres
- DB_PASSWORD=postgres_beta_secure_password

## Ports

| Environment | External Port | Internal Port | Database |
|-------------|--------------|---------------|----------|
| **Demo** | 5432 | 5432 | booksdb |
| **Beta** | 5433 | 5432 | booksdb_beta |

## Container Names

| Environment | App Container | DB Container |
|-------------|--------------|--------------|
| **Demo** | books-app-demo | books-db-demo |
| **Beta** | books-app-beta | books-db-beta |

## Troubleshooting

### Port already in use
```bash
lsof -i :5432
# Kill the process or use different port
```

### Database not ready
```bash
docker exec books-db-demo pg_isready -U postgres
```

### View container errors
```bash
docker-compose -f docker-compose.demo.yml logs postgres
```

### Rebuild from scratch
```bash
docker-compose -f docker-compose.demo.yml down -v
docker-compose -f docker-compose.demo.yml build --no-cache
docker-compose -f docker-compose.demo.yml up
```

## Files You Can Edit

✅ **Safe to modify:**
- `src/demo.js` - Change which functions run
- `src/demoFunctions.js` - Modify demo functions
- `src/booksCrud.js` - Add/modify CRUD operations
- `sql/init.sql` - Change schema or seed data
- `.env.demo` / `.env.beta` - Environment variables

⚠️ **Requires rebuild:**
- `Dockerfile` - Container definition
- `package.json` - Dependencies

🔧 **Advanced:**
- `docker-compose.*.yml` - Container orchestration

## Sample Data

The database is pre-loaded with 10 books:
1. The Great Gatsby
2. Pride and Prejudice
3. 1984
4. To Kill a Mockingbird
5. The Hobbit
6. The Catcher in the Rye
7. The Alchemist
8. Harry Potter and the Sorcerer's Stone
9. The Fault in Our Stars
10. Sapiens: A Brief History of Humankind

## Resources

- 📖 Full guide: `README.md`
- 🏗️ Architecture: `ARCHITECTURE.md`
- 📋 Migration details: `MIGRATION_SUMMARY.md`
- 🆘 Issues: Check Docker logs

---

**Quick Reference** | November 21, 2025
