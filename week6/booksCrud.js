const supabase = require('./supabaseClient')

/**
 * Books CRUD Operations using Supabase
 * Similar to the week3 express demo, but using Supabase instead of in-memory storage
 */

// ==================== CREATE Operations ====================

/**
 * Create a new book
 * @param {Object} bookData - Book data (title, author, genre, year, rating, description)
 * @returns {Object} Created book or error
 */
async function createBook(bookData) {
    try {
        const { data, error } = await supabase
            .from('books')
            .insert([{
                title: bookData.title,
                author: bookData.author,
                genre: bookData.genre,
                year: bookData.year,
                rating: bookData.rating,
                description: bookData.description,
                comments: bookData.comments || []
            }])
            .select()
            .single()

        if (error) throw error
        
        console.log('✅ Book created successfully:', data.title)
        return { success: true, data }
    } catch (error) {
        console.error('❌ Error creating book:', error.message)
        return { success: false, error: error.message }
    }
}

/**
 * Add a comment to a book
 * @param {number} bookId - Book ID
 * @param {string} comment - Comment text
 * @returns {Object} Updated book or error
 */
async function addComment(bookId, comment) {
    try {
        // First, get the current book to access its comments array
        const { data: book, error: fetchError } = await supabase
            .from('books')
            .select('comments')
            .eq('id', bookId)
            .single()

        if (fetchError) throw fetchError
        if (!book) throw new Error('Book not found')

        // Add new comment to the existing comments array
        const updatedComments = [...(book.comments || []), comment]

        // Update the book with the new comments array
        const { data, error: updateError } = await supabase
            .from('books')
            .update({ comments: updatedComments })
            .eq('id', bookId)
            .select()
            .single()

        if (updateError) throw updateError

        console.log('✅ Comment added successfully')
        return { success: true, data }
    } catch (error) {
        console.error('❌ Error adding comment:', error.message)
        return { success: false, error: error.message }
    }
}

// ==================== READ Operations ====================

/**
 * Get all books
 * @returns {Array} Array of all books
 */
async function getAllBooks() {
    try {
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .order('id', { ascending: true })

        if (error) throw error

        console.log(`✅ Retrieved ${data.length} books`)
        return { success: true, data }
    } catch (error) {
        console.error('❌ Error getting books:', error.message)
        return { success: false, error: error.message }
    }
}

/**
 * Get a book by ID
 * @param {number} id - Book ID
 * @returns {Object} Book object or error
 */
async function getBookById(id) {
    try {
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        
        console.log('✅ Book found:', data.title)
        return { success: true, data }
    } catch (error) {
        console.error('❌ Error getting book:', error.message)
        return { success: false, error: error.message }
    }
}

/**
 * Get books by genre (similar to the query string filter in express_demo.js)
 * @param {string} genre - Genre to filter by
 * @returns {Array} Array of books matching the genre
 */
async function getBooksByGenre(genre) {
    try {
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .ilike('genre', genre) // Case-insensitive match
            .order('id', { ascending: true })

        if (error) throw error

        console.log(`✅ Found ${data.length} books in genre: ${genre}`)
        return { success: true, data }
    } catch (error) {
        console.error('❌ Error getting books by genre:', error.message)
        return { success: false, error: error.message }
    }
}

/**
 * Search books by title or author
 * @param {string} searchTerm - Search term
 * @returns {Array} Array of matching books
 */
async function searchBooks(searchTerm) {
    try {
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`)
            .order('id', { ascending: true })

        if (error) throw error

        console.log(`✅ Found ${data.length} books matching: ${searchTerm}`)
        return { success: true, data }
    } catch (error) {
        console.error('❌ Error searching books:', error.message)
        return { success: false, error: error.message }
    }
}

/**
 * Get books with rating above a certain threshold
 * @param {number} minRating - Minimum rating
 * @returns {Array} Array of highly rated books
 */
async function getHighlyRatedBooks(minRating = 4.5) {
    try {
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .gte('rating', minRating)
            .order('rating', { ascending: false })

        if (error) throw error

        console.log(`✅ Found ${data.length} books with rating >= ${minRating}`)
        return { success: true, data }
    } catch (error) {
        console.error('❌ Error getting highly rated books:', error.message)
        return { success: false, error: error.message }
    }
}

// ==================== UPDATE Operations ====================

/**
 * Update a book's information
 * @param {number} id - Book ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated book or error
 */
async function updateBook(id, updates) {
    try {
        const { data, error } = await supabase
            .from('books')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        console.log('✅ Book updated successfully:', data.title)
        return { success: true, data }
    } catch (error) {
        console.error('❌ Error updating book:', error.message)
        return { success: false, error: error.message }
    }
}

/**
 * Update a book's rating
 * @param {number} id - Book ID
 * @param {number} newRating - New rating (0-5)
 * @returns {Object} Updated book or error
 */
async function updateRating(id, newRating) {
    try {
        if (newRating < 0 || newRating > 5) {
            throw new Error('Rating must be between 0 and 5')
        }

        const { data, error } = await supabase
            .from('books')
            .update({ rating: newRating })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        console.log(`✅ Rating updated to ${newRating} for: ${data.title}`)
        return { success: true, data }
    } catch (error) {
        console.error('❌ Error updating rating:', error.message)
        return { success: false, error: error.message }
    }
}

// ==================== DELETE Operations ====================

/**
 * Delete a book by ID
 * @param {number} id - Book ID
 * @returns {Object} Success status or error
 */
async function deleteBook(id) {
    try {
        // First get the book to show what we're deleting
        const { data: book } = await supabase
            .from('books')
            .select('title')
            .eq('id', id)
            .single()

        const { error } = await supabase
            .from('books')
            .delete()
            .eq('id', id)

        if (error) throw error

        console.log(`✅ Book deleted successfully: ${book?.title || id}`)
        return { success: true, message: 'Book deleted successfully' }
    } catch (error) {
        console.error('❌ Error deleting book:', error.message)
        return { success: false, error: error.message }
    }
}

/**
 * Delete all books by a specific author
 * @param {string} author - Author name
 * @returns {Object} Success status with count or error
 */
async function deleteBooksByAuthor(author) {
    try {
        const { data, error } = await supabase
            .from('books')
            .delete()
            .ilike('author', author)
            .select()

        if (error) throw error

        console.log(`✅ Deleted ${data.length} books by ${author}`)
        return { success: true, count: data.length, data }
    } catch (error) {
        console.error('❌ Error deleting books by author:', error.message)
        return { success: false, error: error.message }
    }
}

// Export all functions
module.exports = {
    // Create
    createBook,
    addComment,
    // Read
    getAllBooks,
    getBookById,
    getBooksByGenre,
    searchBooks,
    getHighlyRatedBooks,
    // Update
    updateBook,
    updateRating,
    // Delete
    deleteBook,
    deleteBooksByAuthor
}
