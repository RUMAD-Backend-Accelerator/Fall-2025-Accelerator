/**
 * Demo Functions for PostgreSQL Books CRUD
 * Import these into demo.js to run specific examples
 */

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

function separator(title) {
    console.log('\n' + '='.repeat(60))
    console.log(`  ${title}`)
    console.log('='.repeat(60) + '\n')
}

// READ examples

async function showAllBooks() {
    separator('All Books')
    const result = await getAllBooks()
    if (result.success) {
        console.log(result.data)
    }
}

async function showOneBook() {
    separator('Get One Book')
    const result = await getBook(5) // The Hobbit
    if (result.success) {
        console.log(result.data)
    }
}

async function showFantasyBooks() {
    separator('Fantasy Books')
    const result = await getBooksByGenre('Fantasy')
    if (result.success) {
        console.log(result.data)
    }
}

async function searchForBooks() {
    separator('Search Books')
    const result = await searchBooks('Harry')
    if (result.success) {
        console.log(result.data)
    }
}

async function showTopBooks() {
    separator('Top Rated Books')
    const result = await getTopRatedBooks(4.5)
    if (result.success) {
        console.log(result.data)
    }
}

// CREATE examples

async function createNewBook() {
    separator('Create New Book')
    const result = await addBook({
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        year: 1954,
        rating: 4.9,
        description: 'An epic quest to destroy the One Ring.',
        comments: ['Best fantasy series ever!', 'Epic world-building.']
    })
    if (result.success) {
        console.log(result.data)
    }
}

async function addComment() {
    separator('Add Comment')
    const result = await addCommentToBook(3, 'Big Brother is watching!')
    if (result.success) {
        console.log(result.data)
    }
}

// UPDATE examples

async function editBook() {
    separator('Update Book')
    const result = await updateBook(6, {
        description: 'A coming-of-age story about teenage rebellion.',
        year: 1951
    })
    if (result.success) {
        console.log(result.data)
    }
}

async function changeRating() {
    separator('Update Rating')
    const result = await updateBookRating(7, 4.5)
    if (result.success) {
        console.log(result.data)
    }
}

// DELETE example

async function removeBook() {
    separator('Delete Book')
    
    // Create a test book first
    const created = await addBook({
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Test',
        year: 2025,
        rating: 3.0,
        description: 'Will be deleted.'
    })
    
    if (created.success) {
        console.log('Created:', created.data)
        
        // Delete it
        const deleted = await deleteBook(created.data.id)
        console.log('Deleted:', deleted)
    }
}

// SUMMARY

async function showSummary() {
    separator('Summary')
    const result = await getAllBooks()
    if (result.success) {
        console.log(result.data)
    }
}

module.exports = {
    showAllBooks,
    showOneBook,
    showFantasyBooks,
    searchForBooks,
    showTopBooks,
    createNewBook,
    addComment,
    editBook,
    changeRating,
    removeBook,
    showSummary
}
