const supabase = require('./supabaseClient')

// CREATE - Add new books

async function addBook(bookData) {
    const { data, error } = await supabase
        .from('books')
        .insert([bookData])
        .select()
        .single()

    if (error) {
        console.error('Error creating book:', error.message)
        return { success: false, error: error.message }
    }
    
    console.log('Book created:', data.title)
    return { success: true, data }
}

async function addCommentToBook(bookId, comment) {
    // Get the book's current comments
    const { data: book } = await supabase
        .from('books')
        .select('comments')
        .eq('id', bookId)
        .single()

    // Add the new comment
    const updatedComments = [...(book.comments || []), comment]

    // Update the book
    const { data, error } = await supabase
        .from('books')
        .update({ comments: updatedComments })
        .eq('id', bookId)
        .select()
        .single()

    if (error) {
        console.error('Error adding comment:', error.message)
        return { success: false, error: error.message }
    }

    console.log('Comment added')
    return { success: true, data }
}

// READ - Get books from the database

async function getAllBooks() {
    const { data, error } = await supabase
        .from('books')
        .select('*')

    if (error) {
        console.error('Error getting books:', error.message)
        return { success: false, error: error.message }
    }

    console.log(`Found ${data.length} books`)
    return { success: true, data }
}

async function getBook(id) {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error getting book:', error.message)
        return { success: false, error: error.message }
    }
    
    console.log('Found:', data.title)
    return { success: true, data }
}

async function getBooksByGenre(genre) {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('genre', genre)

    if (error) {
        console.error('Error getting books by genre:', error.message)
        return { success: false, error: error.message }
    }

    console.log(`Found ${data.length} ${genre} books`)
    return { success: true, data }
}

async function searchBooks(searchTerm) {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`)

    if (error) {
        console.error('Error searching:', error.message)
        return { success: false, error: error.message }
    }

    console.log(`Found ${data.length} books matching "${searchTerm}"`)
    return { success: true, data }
}

async function getTopRatedBooks(minRating = 4.5) {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .gte('rating', minRating)
        .order('rating', { ascending: false })

    if (error) {
        console.error('Error getting top books:', error.message)
        return { success: false, error: error.message }
    }

    console.log(`Found ${data.length} books rated ${minRating}+`)
    return { success: true, data }
}

// UPDATE - Modify existing books

async function updateBook(id, updates) {
    const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating book:', error.message)
        return { success: false, error: error.message }
    }

    console.log('Updated:', data.title)
    return { success: true, data }
}

async function updateBookRating(id, newRating) {
    const { data, error } = await supabase
        .from('books')
        .update({ rating: newRating })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating rating:', error.message)
        return { success: false, error: error.message }
    }

    console.log(`Updated rating for ${data.title} to ${newRating}`)
    return { success: true, data }
}

// DELETE - Remove books

async function deleteBook(id) {
    const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting book:', error.message)
        return { success: false, error: error.message }
    }

    console.log('Book deleted')
    return { success: true }
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
