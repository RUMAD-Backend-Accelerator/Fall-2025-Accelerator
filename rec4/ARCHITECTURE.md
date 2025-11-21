# REC4 Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         REC4 Project                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┐    ┌──────────────────────────┐
│    DEMO Environment      │    │    BETA Environment      │
│  (port 5432 external)    │    │  (port 5433 external)    │
└──────────────────────────┘    └──────────────────────────┘
          │                                    │
          ▼                                    ▼
┌─────────────────────┐          ┌─────────────────────┐
│  books-network      │          │  books-network-beta │
│  (Docker Network)   │          │  (Docker Network)   │
└─────────────────────┘          └─────────────────────┘
          │                                    │
    ┌─────┴─────┐                      ┌─────┴─────┐
    │           │                      │           │
    ▼           ▼                      ▼           ▼
┌──────┐   ┌──────┐                ┌──────┐   ┌──────┐
│ App  │   │ DB   │                │ App  │   │ DB   │
│ Demo │───│ Demo │                │ Beta │───│ Beta │
└──────┘   └──────┘                └──────┘   └──────┘
    │           │                      │           │
    │           ▼                      │           ▼
    │    ┌──────────┐                 │    ┌──────────┐
    │    │ Volume:  │                 │    │ Volume:  │
    │    │postgres_ │                 │    │postgres_ │
    │    │data_demo │                 │    │data_beta │
    │    └──────────┘                 │    └──────────┘
    │                                 │
    └─────────────────────────────────┘
                    │
                    ▼
            ┌──────────────┐
            │ Host Machine │
            │  (Your Mac)  │
            └──────────────┘
```

## Container Details

### Demo Environment

```
┌─────────────────────────────────────────┐
│     books-db-demo (PostgreSQL)          │
├─────────────────────────────────────────┤
│ Image: postgres:15-alpine               │
│ Port: 5432 → 5432                       │
│ Database: booksdb                       │
│ User: postgres                          │
│ Volume: postgres_data_demo              │
│ Init: sql/init.sql                      │
└─────────────────────────────────────────┘
               ▲
               │ Connects via books-network
               │
┌─────────────────────────────────────────┐
│     books-app-demo (Node.js)            │
├─────────────────────────────────────────┤
│ Image: node:18-alpine (custom built)   │
│ Runs: npm run demo                      │
│ Depends: postgres (healthy)             │
│ Env: DB_HOST=postgres                   │
└─────────────────────────────────────────┘
```

### Beta Environment

```
┌─────────────────────────────────────────┐
│     books-db-beta (PostgreSQL)          │
├─────────────────────────────────────────┤
│ Image: postgres:15-alpine               │
│ Port: 5433 → 5432                       │
│ Database: booksdb_beta                  │
│ User: postgres                          │
│ Volume: postgres_data_beta              │
│ Init: sql/init.sql                      │
└─────────────────────────────────────────┘
               ▲
               │ Connects via books-network-beta
               │
┌─────────────────────────────────────────┐
│     books-app-beta (Node.js)            │
├─────────────────────────────────────────┤
│ Image: node:18-alpine (custom built)   │
│ Runs: npm run demo                      │
│ Depends: postgres (healthy)             │
│ Env: DB_HOST=postgres, NODE_ENV=beta    │
└─────────────────────────────────────────┘
```

## Application Flow

```
1. Start
   │
   ├─→ docker-compose up
   │
2. PostgreSQL Container
   │
   ├─→ Pull postgres:15-alpine image
   ├─→ Create container
   ├─→ Initialize database
   ├─→ Run sql/init.sql
   ├─→ Health check (pg_isready)
   │
3. App Container (waits for DB health)
   │
   ├─→ Build from Dockerfile
   ├─→ Copy package.json
   ├─→ npm install (pg, dotenv)
   ├─→ Copy src/ files
   ├─→ Connect to PostgreSQL
   │
4. Run Demo
   │
   ├─→ Execute src/demo.js
   ├─→ Run CRUD operations
   ├─→ Display results
   ├─→ Exit
   │
5. Container exits (app)
   PostgreSQL keeps running
```

## Data Flow

```
┌─────────────┐
│  demo.js    │  Orchestrates demo
└──────┬──────┘
       │ imports
       ▼
┌─────────────────┐
│ demoFunctions.js│  Helper functions
└──────┬──────────┘
       │ imports
       ▼
┌─────────────┐
│ booksCrud.js│  CRUD operations
└──────┬──────┘
       │ imports
       ▼
┌─────────────┐
│ dbClient.js │  PostgreSQL pool
└──────┬──────┘
       │ connects to
       ▼
┌──────────────┐
│ PostgreSQL   │  Database
│   Container  │
└──────────────┘
       │
       ▼
┌──────────────┐
│ Docker Volume│  Persistent storage
└──────────────┘
```

## Network Isolation

```
Host Machine (Your Mac)
│
├─→ Port 5432 → books-network → books-db-demo
│                    │
│                    └─→ books-app-demo
│
└─→ Port 5433 → books-network-beta → books-db-beta
                     │
                     └─→ books-app-beta

Both environments are completely isolated:
- Separate networks
- Separate volumes
- Separate databases
- Can run simultaneously
```

## Week6 vs REC4 Comparison

```
┌──────────────────────────┐     ┌──────────────────────────┐
│   Week6 (Supabase)       │     │   REC4 (Docker)          │
└──────────────────────────┘     └──────────────────────────┘
           │                                  │
           ▼                                  ▼
┌──────────────────────────┐     ┌──────────────────────────┐
│  Node.js Application     │     │  Node.js Container       │
└──────────────────────────┘     └──────────────────────────┘
           │                                  │
           │ Supabase SDK                     │ pg (node-postgres)
           │ Query Builder                    │ Raw SQL
           ▼                                  ▼
┌──────────────────────────┐     ┌──────────────────────────┐
│  Supabase Client         │     │  PostgreSQL Pool         │
└──────────────────────────┘     └──────────────────────────┘
           │                                  │
           │ HTTPS/REST API                   │ Direct connection
           ▼                                  ▼
┌──────────────────────────┐     ┌──────────────────────────┐
│  Supabase Cloud          │     │  PostgreSQL Container    │
│  - Hosted PostgreSQL     │     │  - Local PostgreSQL      │
│  - Auth                  │     │  - No auth needed        │
│  - RLS                   │     │  - No RLS                │
│  - REST API              │     │  - Direct queries        │
└──────────────────────────┘     └──────────────────────────┘
           │                                  │
           ▼                                  ▼
┌──────────────────────────┐     ┌──────────────────────────┐
│  Cloud Storage           │     │  Docker Volume           │
└──────────────────────────┘     └──────────────────────────┘
```

## File Organization

```
rec4/
│
├── Configuration Files
│   ├── docker-compose.demo.yml    ← Demo orchestration
│   ├── docker-compose.beta.yml    ← Beta orchestration
│   ├── Dockerfile                 ← App container definition
│   ├── .env.demo                  ← Demo environment vars
│   └── .env.beta                  ← Beta environment vars
│
├── Application Code
│   └── src/
│       ├── demo.js                ← Entry point
│       ├── demoFunctions.js       ← Demo helpers
│       ├── booksCrud.js           ← CRUD operations
│       └── dbClient.js            ← Database connection
│
├── Database
│   └── sql/
│       └── init.sql               ← Schema + seed data
│
├── Scripts
│   ├── start.sh                   ← Quick start
│   └── stop.sh                    ← Quick stop
│
└── Documentation
    ├── README.md                  ← Main guide
    ├── MIGRATION_SUMMARY.md       ← Migration details
    └── ARCHITECTURE.md            ← This file
```

---

**Visual Guide Created**: November 21, 2025  
**Purpose**: Help understand the Docker architecture and data flow
