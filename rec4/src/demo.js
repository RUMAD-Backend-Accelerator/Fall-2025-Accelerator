/**
 * PostgreSQL Books CRUD Demo - Driver File
 * 
 * Uncomment the functions below to run them.
 */

const {
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
} = require('./demoFunctions')

const pool = require('./dbClient')

async function runDemo() {
    // Hard clear - prevents scrolling back
    process.stdout.write('\x1Bc')
    console.log('\nStarting PostgreSQL Books Demo...\n')
    
    // READ examples
    // await showAllBooks()
    // await showOneBook()
    // await showFantasyBooks()
    // await searchForBooks()
    // await showTopBooks()
    
    // CREATE examples
    // await createNewBook()
    // await addComment()
    
    // UPDATE examples
    // await editBook()
    // await changeRating()
    
    // DELETE example
    await removeBook()
    
    // Summary
    // await showSummary()

    console.log('\n' + '='.repeat(60))
    console.log('  Done!')
    console.log('='.repeat(60) + '\n')
}

runDemo()
    .then(() => {
        console.log('Demo finished')
        pool.end()
        process.exit(0)
    })
    .catch(error => {
        console.error('Demo failed:', error)
        pool.end()
        process.exit(1)
    })
