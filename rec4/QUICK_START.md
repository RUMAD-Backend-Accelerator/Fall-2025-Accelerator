# 🚀 QUICK START - Web Interface

## In 3 Simple Steps:

### 1️⃣ Start Docker
```bash
cd rec4
./start.sh demo
```

### 2️⃣ Open Browser
Visit: **http://localhost:3000**

### 3️⃣ Start Exploring!
- Click on "Read Operations" to browse books
- Try "Create Operations" to add a book
- Experiment with Update and Delete

---

## 📺 What You'll See

### Home Page
- Purple gradient background
- 4 navigation cards:
  - 🔍 Read Operations
  - ➕ Create Operations
  - ✏️ Update Operations
  - 🗑️ Delete Operations

### Read Page (Recommended First)
Click "Show All Books" to see 10 pre-loaded books including:
- The Great Gatsby
- Harry Potter
- The Hobbit
- 1984
- ...and more!

### Create Page
Fill out the form to add your own book:
- Title, Author, Genre
- Year, Rating
- Description

### Update Page
1. Enter a book ID (try 1-10)
2. Click "Load Book"
3. Modify any fields
4. Click "Update Book"

### Delete Page
⚠️ **Use the "Run Test Delete" button first!**
- Safely demonstrates delete functionality
- Creates and deletes a test book
- No risk to sample data

---

## 🛑 To Stop

Press `Ctrl+C` in the terminal, then:
```bash
docker-compose -f docker-compose.demo.yml down
```

---

## 💡 Pro Tips

1. **Start with Read** - Browse the books first
2. **Create Test Data** - Add books with "TEST" in the title
3. **Use Test Delete** - Practice safely before real deletes
4. **Open DevTools (F12)** - See API calls in Network tab
5. **Check Terminal** - Watch server logs for activity

---

## 🎯 URLs

| What | Where |
|------|-------|
| **Home Page** | http://localhost:3000/ |
| **Read Page** | http://localhost:3000/read.html |
| **Create Page** | http://localhost:3000/create.html |
| **Update Page** | http://localhost:3000/update.html |
| **Delete Page** | http://localhost:3000/delete.html |
| **API Docs** | See WEB_INTERFACE_GUIDE.md |

---

## ❓ Troubleshooting

**Can't connect?**
- Check Docker is running: `docker ps`
- Ensure port 3000 is free: `lsof -i :3000`

**No data showing?**
- Check terminal for errors
- Wait for "Connected to PostgreSQL database" message
- Refresh browser

**Want to reset everything?**
```bash
docker-compose -f docker-compose.demo.yml down -v
docker-compose -f docker-compose.demo.yml up --build
```

---

## 📚 More Help

- **Full Guide**: README.md
- **Detailed Usage**: WEB_INTERFACE_GUIDE.md
- **Commands**: QUICK_REFERENCE.md

---

**That's it! You're ready to explore the web interface! 🎉**
