// Update Operations JavaScript

function showSuccess(message, data = null) {
    const resultsDiv = document.getElementById('results');
    let html = `
        <div class="content-box">
            <div class="alert alert-success">
                <strong>Success!</strong> ${message}
            </div>
    `;
    
    if (data) {
        html += `
            <h3>Updated Book:</h3>
            <div class="book-card">
                <h3>${data.title}</h3>
                <p class="author">by ${data.author}</p>
                <div class="info">
                    <div class="info-item"><strong>ID:</strong> ${data.id}</div>
                    <div class="info-item"><strong>Genre:</strong> ${data.genre}</div>
                    <div class="info-item"><strong>Year:</strong> ${data.year}</div>
                    <div class="info-item"><strong>Rating:</strong> ${data.rating} ⭐</div>
                </div>
                ${data.description ? `<p><strong>Description:</strong> ${data.description}</p>` : ''}
            </div>
        `;
    }
    
    html += '</div>';
    resultsDiv.innerHTML = html;
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

async function loadBookDetails() {
    const bookId = document.getElementById('updateBookId').value;
    if (!bookId) {
        showError('Please enter a book ID');
        return;
    }
    
    try {
        const response = await fetch(`/api/books/${bookId}`);
        if (!response.ok) throw new Error('Book not found');
        
        const book = await response.json();
        
        // Populate form fields
        document.getElementById('updateTitle').value = book.title;
        document.getElementById('updateAuthor').value = book.author;
        document.getElementById('updateGenre').value = book.genre;
        document.getElementById('updateYear').value = book.year;
        document.getElementById('updateDescription').value = book.description || '';
        
        // Show the form fields
        document.getElementById('book-fields').style.display = 'block';
        
        // Show current book info
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <div class="content-box">
                <div class="alert alert-info">
                    <strong>Current Book Data Loaded:</strong> ${book.title} by ${book.author}
                </div>
            </div>
        `;
    } catch (error) {
        showError(error.message);
        document.getElementById('book-fields').style.display = 'none';
    }
}

// Update Book Form Handler
document.getElementById('update-book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const bookId = document.getElementById('updateBookId').value;
    
    // Only include fields that have values
    const updates = {};
    const title = document.getElementById('updateTitle').value;
    const author = document.getElementById('updateAuthor').value;
    const genre = document.getElementById('updateGenre').value;
    const year = document.getElementById('updateYear').value;
    const description = document.getElementById('updateDescription').value;
    
    if (title) updates.title = title;
    if (author) updates.author = author;
    if (genre) updates.genre = genre;
    if (year) updates.year = parseInt(year);
    if (description) updates.description = description;
    
    if (Object.keys(updates).length === 0) {
        showError('Please modify at least one field');
        return;
    }
    
    try {
        const response = await fetch(`/api/books/${bookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update book');
        }
        
        const book = await response.json();
        showSuccess('Book updated successfully!', book);
    } catch (error) {
        showError(error.message);
    }
});

// Update Rating Form Handler
document.getElementById('update-rating-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const bookId = document.getElementById('ratingBookId').value;
    const rating = parseFloat(document.getElementById('newRating').value);
    
    try {
        const response = await fetch(`/api/books/${bookId}/rating`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update rating');
        }
        
        const book = await response.json();
        showSuccess(`Rating updated to ${rating} for "${book.title}"!`, book);
        e.target.reset();
    } catch (error) {
        showError(error.message);
    }
});
