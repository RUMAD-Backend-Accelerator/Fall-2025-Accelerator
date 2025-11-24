const express = require('express')
const path = require('path')
const {
    addBook,
    addCommentToBook,
    getAllBooks,
    getBook,
    getBooksByGenre,
    searchBooks,
    getTopRatedBooks,
    updateBook,
    updateBookRating,
    deleteBook
} = require('./booksCrud')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

// Root route - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

// API Routes - GET (Read)
app.get('/api/books', async (req, res) => {
    const result = await getAllBooks()
    if (result.success) {
        res.json(result.data)
    } else {
        res.status(500).json({ error: result.error })
    }
})

app.get('/api/books/:id', async (req, res) => {
    const result = await getBook(parseInt(req.params.id))
    if (result.success) {
        res.json(result.data)
    } else {
        res.status(404).json({ error: result.error })
    }
})

app.get('/api/books/genre/:genre', async (req, res) => {
    const result = await getBooksByGenre(req.params.genre)
    if (result.success) {
        res.json(result.data)
    } else {
        res.status(500).json({ error: result.error })
    }
})

app.get('/api/books/search/:term', async (req, res) => {
    const result = await searchBooks(req.params.term)
    if (result.success) {
        res.json(result.data)
    } else {
        res.status(500).json({ error: result.error })
    }
})

app.get('/api/books/top/:rating', async (req, res) => {
    const rating = parseFloat(req.params.rating)
    const result = await getTopRatedBooks(rating)
    if (result.success) {
        res.json(result.data)
    } else {
        res.status(500).json({ error: result.error })
    }
})

// API Routes - POST (Create)
app.post('/api/books', async (req, res) => {
    const result = await addBook(req.body)
    if (result.success) {
        res.status(201).json(result.data)
    } else {
        res.status(400).json({ error: result.error })
    }
})

app.post('/api/books/:id/comments', async (req, res) => {
    const result = await addCommentToBook(parseInt(req.params.id), req.body.comment)
    if (result.success) {
        res.json(result.data)
    } else {
        res.status(400).json({ error: result.error })
    }
})

// API Routes - PUT (Update)
app.put('/api/books/:id', async (req, res) => {
    const result = await updateBook(parseInt(req.params.id), req.body)
    if (result.success) {
        res.json(result.data)
    } else {
        res.status(400).json({ error: result.error })
    }
})

app.put('/api/books/:id/rating', async (req, res) => {
    const result = await updateBookRating(parseInt(req.params.id), req.body.rating)
    if (result.success) {
        res.json(result.data)
    } else {
        res.status(400).json({ error: result.error })
    }
})

// API Routes - DELETE
app.delete('/api/books/:id', async (req, res) => {
    const result = await deleteBook(parseInt(req.params.id))
    if (result.success) {
        res.json({ message: 'Book deleted successfully' })
    } else {
        res.status(400).json({ error: result.error })
    }
})

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📚 Books API available at http://localhost:${PORT}/api/books`)
})

module.exports = app
