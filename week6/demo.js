/**
 * Supabase Books CRUD Demo
 * 
 * This file demonstrates all the CRUD operations available in booksCrud.js
 * Run this file to see examples of:
 * - Creating books
 * - Reading/querying books
 * - Updating books
 * - Deleting books
 * - Adding comments
 */

const {
    createBook,
    addComment,
    getAllBooks,
    getBookById,
    getBooksByGenre,
    searchBooks,
    getHighlyRatedBooks,
    updateBook,
    updateRating,
    deleteBook,
    deleteBooksByAuthor
} = require('./booksCrud')

// Helper function to add spacing between demos
function separator(title) {
    console.log('\n' + '='.repeat(60))
    console.log(`  ${title}`)
    console.log('='.repeat(60) + '\n')
}

// Main demo function
async function runDemo() {
    try {
        // ==================== READ Operations Demo ====================
        
        separator('DEMO 1: Get All Books')
        const allBooks = await getAllBooks()
        if (allBooks.success) {
            console.log('Total books:', allBooks.data.length)
            console.log('First 3 books:', allBooks.data.slice(0, 3).map(b => `${b.title} by ${b.author}`))
        }

        separator('DEMO 2: Get Book by ID')
        const book = await getBookById(5) // The Hobbit
        if (book.success) {
            console.log('Book Details:')
            console.log(`  Title: ${book.data.title}`)
            console.log(`  Author: ${book.data.author}`)
            console.log(`  Genre: ${book.data.genre}`)
            console.log(`  Rating: ${book.data.rating}`)
            console.log(`  Comments: ${book.data.comments.length}`)
        }

        separator('DEMO 3: Get Books by Genre - Fantasy')
        const fantasyBooks = await getBooksByGenre('Fantasy')
        if (fantasyBooks.success) {
            console.log('Fantasy books found:', fantasyBooks.data.length)
            fantasyBooks.data.forEach(b => {
                console.log(`  - ${b.title} (${b.year}) - Rating: ${b.rating}`)
            })
        }

        separator('DEMO 4: Search Books by Author/Title')
        const searchResults = await searchBooks('Harry')
        if (searchResults.success) {
            console.log('Search results for "Harry":')
            searchResults.data.forEach(b => {
                console.log(`  - ${b.title} by ${b.author}`)
            })
        }

        separator('DEMO 5: Get Highly Rated Books (>= 4.5)')
        const topBooks = await getHighlyRatedBooks(4.5)
        if (topBooks.success) {
            console.log('Top rated books:')
            topBooks.data.forEach(b => {
                console.log(`  - ${b.title}: ${b.rating} ⭐`)
            })
        }

        // ==================== CREATE Operations Demo ====================
        
        separator('DEMO 6: Create a New Book')
        const newBook = await createBook({
            title: 'The Lord of the Rings',
            author: 'J.R.R. Tolkien',
            genre: 'Fantasy',
            year: 1954,
            rating: 4.9,
            description: 'An epic high-fantasy novel about the quest to destroy the One Ring.',
            comments: ['Best fantasy series ever!', 'A masterpiece of world-building.']
        })
        if (newBook.success) {
            console.log('New book created with ID:', newBook.data.id)
            console.log('Title:', newBook.data.title)
        }

        separator('DEMO 7: Add a Comment to a Book')
        const commentResult = await addComment(3, 'Big Brother is watching you!')
        if (commentResult.success) {
            console.log('Comment added to:', commentResult.data.title)
            console.log('Total comments now:', commentResult.data.comments.length)
            console.log('Latest comment:', commentResult.data.comments[commentResult.data.comments.length - 1])
        }

        // ==================== UPDATE Operations Demo ====================
        
        separator('DEMO 8: Update Book Information')
        const updateResult = await updateBook(6, {
            description: 'A profound coming-of-age story about teenage rebellion and alienation in 1950s America.',
            year: 1951
        })
        if (updateResult.success) {
            console.log('Updated book:', updateResult.data.title)
            console.log('New description:', updateResult.data.description.substring(0, 80) + '...')
        }

        separator('DEMO 9: Update Book Rating')
        const ratingResult = await updateRating(7, 4.5)
        if (ratingResult.success) {
            console.log('Rating updated for:', ratingResult.data.title)
            console.log('New rating:', ratingResult.data.rating)
        }

        // ==================== DELETE Operations Demo ====================
        
        separator('DEMO 10: Create a Test Book (to delete later)')
        const testBook = await createBook({
            title: 'Test Book - DELETE ME',
            author: 'Test Author',
            genre: 'Test',
            year: 2025,
            rating: 3.0,
            description: 'This is a test book that will be deleted.'
        })
        
        if (testBook.success) {
            console.log('Test book created with ID:', testBook.data.id)
            
            // Wait a moment then delete it
            separator('DEMO 11: Delete the Test Book')
            const deleteResult = await deleteBook(testBook.data.id)
            if (deleteResult.success) {
                console.log('Successfully deleted test book')
            }
        }

        // ==================== Final Summary ====================
        
        separator('FINAL: Summary of All Books')
        const finalBooks = await getAllBooks()
        if (finalBooks.success) {
            console.log(`Total books in database: ${finalBooks.data.length}`)
            console.log('\nGenre breakdown:')
            const genreCounts = {}
            finalBooks.data.forEach(b => {
                genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1
            })
            Object.entries(genreCounts).forEach(([genre, count]) => {
                console.log(`  ${genre}: ${count}`)
            })
        }

        console.log('\n' + '='.repeat(60))
        console.log('  🎉 Demo completed successfully!')
        console.log('='.repeat(60) + '\n')

    } catch (error) {
        console.error('Error running demo:', error)
    }
}

// Run the demo
console.log('\n🚀 Starting Supabase Books CRUD Demo...\n')
runDemo()
    .then(() => {
        console.log('✅ Demo finished')
        process.exit(0)
    })
    .catch(error => {
        console.error('❌ Demo failed:', error)
        process.exit(1)
    })
