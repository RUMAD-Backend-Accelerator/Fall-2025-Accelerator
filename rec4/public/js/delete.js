// Delete Operations JavaScript

function showSuccess(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="content-box">
            <div class="alert alert-success">
                <strong>Success!</strong> ${message}
            </div>
        </div>
    `;
}

function showError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="content-box">
            <div class="alert alert-error">
                <strong>Error:</strong> ${message}
            </div>
        </div>
    `;
}

async function previewBook() {
    const bookId = document.getElementById('deleteBookId').value;
    if (!bookId) {
        showError('Please enter a book ID');
        return;
    }
    
    try {
        const response = await fetch(`/api/books/${bookId}`);
        if (!response.ok) throw new Error('Book not found');
        
        const book = await response.json();
        
        const previewDiv = document.getElementById('book-preview');
        previewDiv.innerHTML = `
            <div class="alert alert-info" style="margin-top: 1rem;">
                <h3 style="margin-top: 0;">Preview - Book to be deleted:</h3>
                <div class="book-card">
                    <h3>${book.title}</h3>
                    <p class="author">by ${book.author}</p>
                    <div class="info">
                        <div class="info-item"><strong>ID:</strong> ${book.id}</div>
                        <div class="info-item"><strong>Genre:</strong> ${book.genre}</div>
                        <div class="info-item"><strong>Year:</strong> ${book.year}</div>
                        <div class="info-item"><strong>Rating:</strong> ${book.rating} ⭐</div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        document.getElementById('book-preview').innerHTML = '';
        showError(error.message);
    }
}

// Delete Book Form Handler
document.getElementById('delete-book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const bookId = document.getElementById('deleteBookId').value;
    
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete book #${bookId}? This cannot be undone!`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/books/${bookId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete book');
        }
        
        showSuccess(`Book #${bookId} has been deleted successfully!`);
        document.getElementById('book-preview').innerHTML = '';
        e.target.reset();
    } catch (error) {
        showError(error.message);
    }
});

// Test Delete - Creates a book then deletes it
async function testDelete() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="content-box"><div class="loading">Running test delete</div></div>';
    
    try {
        // Step 1: Create a test book
        const createResponse = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Test Book for Deletion',
                author: 'Test Author',
                genre: 'Test',
                year: 2025,
                rating: 3.0,
                description: 'This book will be automatically deleted to demonstrate the delete function.'
            })
        });
        
        if (!createResponse.ok) throw new Error('Failed to create test book');
        const createdBook = await createResponse.json();
        
        // Show created book
        resultsDiv.innerHTML = `
            <div class="content-box">
                <div class="alert alert-success">
                    <strong>Step 1:</strong> Created test book
                </div>
                <div class="book-card">
                    <h3>${createdBook.title}</h3>
                    <p class="author">by ${createdBook.author}</p>
                    <div class="info">
                        <div class="info-item"><strong>ID:</strong> ${createdBook.id}</div>
                        <div class="info-item"><strong>Genre:</strong> ${createdBook.genre}</div>
                    </div>
                </div>
                <div class="loading">Deleting in 2 seconds</div>
            </div>
        `;
        
        // Wait 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Step 2: Delete the book
        const deleteResponse = await fetch(`/api/books/${createdBook.id}`, {
            method: 'DELETE'
        });
        
        if (!deleteResponse.ok) throw new Error('Failed to delete test book');
        
        // Show success
        resultsDiv.innerHTML = `
            <div class="content-box">
                <div class="alert alert-success">
                    <strong>Test Complete!</strong><br><br>
                    <strong>Step 1:</strong> Created test book "${createdBook.title}" (ID: ${createdBook.id})<br>
                    <strong>Step 2:</strong> Successfully deleted the test book<br><br>
                    The delete operation is working correctly! ✅
                </div>
            </div>
        `;
    } catch (error) {
        showError('Test failed: ' + error.message);
    }
}
