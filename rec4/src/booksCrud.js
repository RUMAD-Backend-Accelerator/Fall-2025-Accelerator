const pool = require('./dbClient')

// CREATE - Add new books

async function addBook(bookData) {
    try {
        const query = `
            INSERT INTO books (title, author, genre, year, rating, description, comments)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `
        const values = [
            bookData.title,
            bookData.author,
            bookData.genre,
            bookData.year,
            bookData.rating,
            bookData.description || null,
            bookData.comments || []
        ]
        
        const result = await pool.query(query, values)
        const data = result.rows[0]
        
        console.log('Book created:', data.title)
        return { success: true, data }
    } catch (error) {
        console.error('Error creating book:', error.message)
        return { success: false, error: error.message }
    }
}

async function addCommentToBook(bookId, comment) {
    try {
        // Get the book's current comments
        const getQuery = 'SELECT comments FROM books WHERE id = $1'
        const getResult = await pool.query(getQuery, [bookId])
        
        if (getResult.rows.length === 0) {
            return { success: false, error: 'Book not found' }
        }
        
        const book = getResult.rows[0]
        const updatedComments = [...(book.comments || []), comment]
        
        // Update the book
        const updateQuery = `
            UPDATE books
            SET comments = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `
        const updateResult = await pool.query(updateQuery, [updatedComments, bookId])
        const data = updateResult.rows[0]
        
        console.log('Comment added')
        return { success: true, data }
    } catch (error) {
        console.error('Error adding comment:', error.message)
        return { success: false, error: error.message }
    }
}

// READ - Get books from the database

async function getAllBooks() {
    try {
        const query = 'SELECT * FROM books ORDER BY id'
        const result = await pool.query(query)
        const data = result.rows
        
        console.log(`Found ${data.length} books`)
        return { success: true, data }
    } catch (error) {
        console.error('Error getting books:', error.message)
        return { success: false, error: error.message }
    }
}

async function getBook(id) {
    try {
        const query = 'SELECT * FROM books WHERE id = $1'
        const result = await pool.query(query, [id])
        
        if (result.rows.length === 0) {
            return { success: false, error: 'Book not found' }
        }
        
        const data = result.rows[0]
        console.log('Found:', data.title)
        return { success: true, data }
    } catch (error) {
        console.error('Error getting book:', error.message)
        return { success: false, error: error.message }
    }
}

async function getBooksByGenre(genre) {
    try {
        const query = 'SELECT * FROM books WHERE genre = $1 ORDER BY id'
        const result = await pool.query(query, [genre])
        const data = result.rows
        
        console.log(`Found ${data.length} ${genre} books`)
        return { success: true, data }
    } catch (error) {
        console.error('Error getting books by genre:', error.message)
        return { success: false, error: error.message }
    }
}

async function searchBooks(searchTerm) {
    try {
        const query = `
            SELECT * FROM books
            WHERE title ILIKE $1 OR author ILIKE $1
            ORDER BY id
        `
        const pattern = `%${searchTerm}%`
        const result = await pool.query(query, [pattern])
        const data = result.rows
        
        console.log(`Found ${data.length} books matching "${searchTerm}"`)
        return { success: true, data }
    } catch (error) {
        console.error('Error searching:', error.message)
        return { success: false, error: error.message }
    }
}

async function getTopRatedBooks(minRating = 4.5) {
    try {
        const query = `
            SELECT * FROM books
            WHERE rating >= $1
            ORDER BY rating DESC, id
        `
        const result = await pool.query(query, [minRating])
        const data = result.rows
        
        console.log(`Found ${data.length} books rated ${minRating}+`)
        return { success: true, data }
    } catch (error) {
        console.error('Error getting top books:', error.message)
        return { success: false, error: error.message }
    }
}

// UPDATE - Modify existing books

async function updateBook(id, updates) {
    try {
        // Build dynamic update query
        const fields = []
        const values = []
        let paramCount = 1
        
        for (const [key, value] of Object.entries(updates)) {
            fields.push(`${key} = $${paramCount}`)
            values.push(value)
            paramCount++
        }
        
        if (fields.length === 0) {
            return { success: false, error: 'No fields to update' }
        }
        
        values.push(id) // Add id as the last parameter
        const query = `
            UPDATE books
            SET ${fields.join(', ')}, updated_at = NOW()
            WHERE id = $${paramCount}
            RETURNING *
        `
        
        const result = await pool.query(query, values)
        
        if (result.rows.length === 0) {
            return { success: false, error: 'Book not found' }
        }
        
        const data = result.rows[0]
        console.log('Updated:', data.title)
        return { success: true, data }
    } catch (error) {
        console.error('Error updating book:', error.message)
        return { success: false, error: error.message }
    }
}

async function updateBookRating(id, newRating) {
    try {
        const query = `
            UPDATE books
            SET rating = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `
        const result = await pool.query(query, [newRating, id])
        
        if (result.rows.length === 0) {
            return { success: false, error: 'Book not found' }
        }
        
        const data = result.rows[0]
        console.log(`Updated rating for ${data.title} to ${newRating}`)
        return { success: true, data }
    } catch (error) {
        console.error('Error updating rating:', error.message)
        return { success: false, error: error.message }
    }
}

// DELETE - Remove books

async function deleteBook(id) {
    try {
        const query = 'DELETE FROM books WHERE id = $1'
        const result = await pool.query(query, [id])
        
        if (result.rowCount === 0) {
            return { success: false, error: 'Book not found' }
        }
        
        console.log('Book deleted')
        return { success: true }
    } catch (error) {
        console.error('Error deleting book:', error.message)
        return { success: false, error: error.message }
    }
}

module.exports = {
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
}
