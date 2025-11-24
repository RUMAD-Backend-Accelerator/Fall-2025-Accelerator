# 🌐 Web Interface Guide

## Overview

The REC4 Books Demo now features a complete web-based interface for all CRUD operations. This guide explains how to use each page and what to expect.

## Accessing the Application

### Demo Environment
```bash
docker-compose -f docker-compose.demo.yml up --build
```
- **URL**: http://localhost:3000
- **Database**: booksdb (port 5432)

### Beta Environment
```bash
docker-compose -f docker-compose.beta.yml up --build
```
- **URL**: http://localhost:3001
- **Database**: booksdb_beta (port 5433)

## Page-by-Page Guide

### 🏠 Home Page (`/`)

The landing page provides navigation to all CRUD operation categories:

- **Read Operations** 🔍 - Browse and search books
- **Create Operations** ➕ - Add new books and comments
- **Update Operations** ✏️ - Modify existing books
- **Delete Operations** 🗑️ - Remove books

**Features:**
- Clean, card-based navigation
- Quick overview of available operations
- Information about the demo

---

### 🔍 Read Operations (`/read.html`)

Interactive page for querying the database.

**Available Operations:**

1. **Show All Books**
   - Click the button to display all 10 books
   - No input required
   - Shows complete book details with ratings and comments

2. **Get Book by ID**
   - Enter a book ID (1-10)
   - Retrieves one specific book
   - Example: Enter `5` to get "The Hobbit"

3. **Show Fantasy Books**
   - Automatically searches for Fantasy genre
   - You can change the genre in the input field
   - Try: Fantasy, Romance, Dystopian, etc.

4. **Search Books**
   - Search by title or author name
   - Case-insensitive partial matching
   - Example: Enter "Harry" to find Harry Potter

5. **Show Top Rated Books**
   - Default minimum rating: 4.5
   - Adjust the rating slider
   - Shows books sorted by rating (highest first)

**How Results Are Displayed:**
- Each book appears in a styled card
- Information shown: Title, Author, Genre, Year, Rating, Description
- Comments are listed below each book
- Color-coded information badges

---

### ➕ Create Operations (`/create.html`)

Add new data to the database.

**Create New Book Form:**

Required fields:
- **Title** - Book title
- **Author** - Author name
- **Genre** - Genre category
- **Year** - Publication year (1000-2100)
- **Rating** - Rating (0-5, allows decimals like 4.5)

Optional fields:
- **Description** - Book description

**Process:**
1. Fill out the form
2. Click "Create Book"
3. Success message shows the created book with its new ID
4. Form resets automatically

**Add Comment to Book:**

1. Enter a book ID
2. Type your comment
3. Click "Add Comment"
4. See the updated book with your comment

**Tips:**
- The database auto-generates IDs
- Comments are stored as an array
- Ratings are validated (0-5 range)

---

### ✏️ Update Operations (`/update.html`)

Modify existing books in the database.

**Update Book Details:**

1. **Load Book First:**
   - Enter book ID
   - Click "Load Book"
   - Form fields populate with current values

2. **Modify Fields:**
   - Change any fields you want to update
   - Leave fields blank to keep current values
   - Available fields: Title, Author, Genre, Year, Description

3. **Submit Changes:**
   - Click "Update Book"
   - See the updated book details
   - Confirmation message appears

**Update Book Rating:**

Simple form for changing just the rating:
1. Enter book ID
2. Enter new rating (0-5)
3. Click "Update Rating"
4. Instant update confirmation

**Notes:**
- Updating is partial - you don't need to re-enter all fields
- Rating updates don't affect other fields
- Load function helps you see current values

---

### 🗑️ Delete Operations (`/delete.html`)

Remove books from the database (use with caution!).

**⚠️ Warning Display:**
- Red warning box alerts you that deletions are permanent
- No undo functionality

**Delete Book Form:**

1. **Preview First (Recommended):**
   - Enter book ID
   - Click "Preview Book"
   - See exactly which book will be deleted

2. **Confirm Deletion:**
   - Click "Delete Book"
   - Browser confirmation dialog appears
   - Must confirm to proceed

3. **Complete:**
   - Success message confirms deletion
   - Preview clears
   - Form resets

**Test Delete Operation:**

Safe way to test the delete functionality:
1. Click "Run Test Delete" button
2. Automatically creates a test book
3. Shows the created book details
4. Waits 2 seconds
5. Deletes the test book
6. Confirms both operations worked

**Safety Features:**
- Preview before deletion
- Browser confirmation required
- Test function for safe practice
- Visual warnings throughout

---

## REST API Endpoints

All operations are also available via REST API:

### Read
```bash
GET  /api/books              # All books
GET  /api/books/:id          # One book
GET  /api/books/genre/:genre # Books by genre
GET  /api/books/search/:term # Search books
GET  /api/books/top/:rating  # Top rated books
```

### Create
```bash
POST /api/books              # Create book
POST /api/books/:id/comments # Add comment
```

### Update
```bash
PUT  /api/books/:id          # Update book
PUT  /api/books/:id/rating   # Update rating
```

### Delete
```bash
DELETE /api/books/:id        # Delete book
```

### Example API Usage

Using `curl`:
```bash
# Get all books
curl http://localhost:3000/api/books

# Get book by ID
curl http://localhost:3000/api/books/5

# Create a book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Book",
    "author": "Author Name",
    "genre": "Fiction",
    "year": 2025,
    "rating": 4.0,
    "description": "A great book"
  }'

# Add comment
curl -X POST http://localhost:3000/api/books/1/comments \
  -H "Content-Type: application/json" \
  -d '{"comment": "Great book!"}'

# Update book
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"description": "Updated description"}'

# Delete book
curl -X DELETE http://localhost:3000/api/books/11
```

---

## Sample Data

The database comes pre-loaded with 10 books:

1. **The Great Gatsby** - F. Scott Fitzgerald (Classic Fiction, 1925)
2. **Pride and Prejudice** - Jane Austen (Romance, 1813)
3. **1984** - George Orwell (Dystopian, 1949)
4. **To Kill a Mockingbird** - Harper Lee (Historical Fiction, 1960)
5. **The Hobbit** - J.R.R. Tolkien (Fantasy, 1937)
6. **The Catcher in the Rye** - J.D. Salinger (Coming-of-Age, 1951)
7. **The Alchemist** - Paulo Coelho (Philosophical Fiction, 1988)
8. **Harry Potter and the Sorcerer's Stone** - J.K. Rowling (Fantasy, 1997)
9. **The Fault in Our Stars** - John Green (Young Adult, 2012)
10. **Sapiens** - Yuval Noah Harari (Non-Fiction, 2011)

Each book includes:
- Title, Author, Genre, Year, Rating
- Description
- Comments array (2-3 comments per book)

---

## Tips & Best Practices

### For Learning
1. Start with **Read Operations** to see the data
2. Try **Create** to add your own book
3. Use **Update** to modify what you created
4. Practice **Delete** on test books only

### For Development
1. Use browser DevTools (F12) to see API calls
2. Check the Network tab for request/response details
3. Console shows any JavaScript errors
4. Inspect elements to understand the structure

### For Testing
1. Use the "Test Delete" button instead of deleting real books
2. Create test books with obvious names like "TEST BOOK"
3. Keep book IDs 1-10 for the original sample data
4. Delete any test books you create when done

### Troubleshooting
1. If a page doesn't load, check the terminal logs
2. Refresh the browser if data seems stale
3. Check Docker containers are running: `docker ps`
4. Verify database connection in logs

---

## Design Features

### Styling
- **Gradient Background** - Purple gradient for modern look
- **Card-Based Layout** - Clean, organized information display
- **Responsive Design** - Works on desktop and mobile
- **Color Coding** - Different colors for different operations
- **Hover Effects** - Interactive feedback

### User Experience
- **Loading States** - Shows "Loading..." during API calls
- **Success Messages** - Green alerts for successful operations
- **Error Handling** - Red alerts with clear error messages
- **Form Validation** - HTML5 validation for required fields
- **Confirmation Dialogs** - Safety confirmations for delete operations

### Accessibility
- **Clear Navigation** - Easy to understand page structure
- **Descriptive Labels** - All form fields clearly labeled
- **Visual Feedback** - Color and text feedback for all actions
- **Keyboard Navigation** - Full keyboard support

---

## Customization

### Change Styles
Edit `public/css/style.css`:
- Modify colors, fonts, spacing
- Adjust card layouts
- Change button styles

### Modify Functionality
Edit JavaScript files in `public/js/`:
- `read.js` - Read operations logic
- `create.js` - Create operations logic
- `update.js` - Update operations logic
- `delete.js` - Delete operations logic

### Add New Pages
1. Create new HTML file in `public/`
2. Add corresponding JS file in `public/js/`
3. Link from `index.html`
4. Add API endpoints in `src/server.js` if needed

---

**Web Interface Guide** | PostgreSQL Books Demo with Docker
