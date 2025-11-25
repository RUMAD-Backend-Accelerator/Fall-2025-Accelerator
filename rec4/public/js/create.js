// Create Operations JavaScript

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
            <h3>Created Book:</h3>
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

// Create Book Form Handler
document.getElementById('create-book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        genre: document.getElementById('genre').value,
        year: parseInt(document.getElementById('year').value),
        rating: parseFloat(document.getElementById('rating').value),
        description: document.getElementById('description').value || null,
        comments: []
    };
    
    try {
        const response = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create book');
        }
        
        const book = await response.json();
        showSuccess('Book created successfully!', book);
        e.target.reset();
    } catch (error) {
        showError(error.message);
    }
});

// Add Comment Form Handler
document.getElementById('add-comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const bookId = document.getElementById('bookId').value;
    const comment = document.getElementById('comment').value;
    
    try {
        const response = await fetch(`/api/books/${bookId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add comment');
        }
        
        const book = await response.json();
        showSuccess(`Comment added to "${book.title}"!`, book);
        e.target.reset();
    } catch (error) {
        showError(error.message);
    }
});
