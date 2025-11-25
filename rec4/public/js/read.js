// Read Operations JavaScript

function displayResults(title, data) {
    const resultsDiv = document.getElementById('results');
    
    if (Array.isArray(data)) {
        if (data.length === 0) {
            resultsDiv.innerHTML = `
                <div class="content-box">
                    <div class="alert alert-info">No books found.</div>
                </div>
            `;
            return;
        }
        
        let html = `<div class="content-box"><h2>${title}</h2>`;
        data.forEach(book => {
            html += renderBookCard(book);
        });
        html += '</div>';
        resultsDiv.innerHTML = html;
    } else {
        resultsDiv.innerHTML = `
            <div class="content-box">
                <h2>${title}</h2>
                ${renderBookCard(data)}
            </div>
        `;
    }
}

function renderBookCard(book) {
    const comments = book.comments && book.comments.length > 0
        ? book.comments.map(c => `<li>${c}</li>`).join('')
        : '<li>No comments yet</li>';
    
    return `
        <div class="book-card">
            <h3>${book.title}</h3>
            <p class="author">by ${book.author}</p>
            <div class="info">
                <div class="info-item"><strong>ID:</strong> ${book.id}</div>
                <div class="info-item"><strong>Genre:</strong> ${book.genre}</div>
                <div class="info-item"><strong>Year:</strong> ${book.year}</div>
                <div class="info-item"><strong>Rating:</strong> ${book.rating} ⭐</div>
            </div>
            ${book.description ? `<p><strong>Description:</strong> ${book.description}</p>` : ''}
            <div class="comments">
                <strong>Comments:</strong>
                <ul>${comments}</ul>
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

function showLoading() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="content-box"><div class="loading">Loading</div></div>';
}

async function showAllBooks() {
    showLoading();
    try {
        const response = await fetch('/api/books');
        const books = await response.json();
        displayResults('All Books', books);
    } catch (error) {
        showError(error.message);
    }
}

function showOneBook() {
    const inputSection = document.getElementById('input-section');
    inputSection.style.display = 'block';
    inputSection.innerHTML = `
        <h2>Get Book by ID</h2>
        <div class="form-group">
            <label for="bookIdInput">Enter Book ID:</label>
            <input type="number" id="bookIdInput" min="1" placeholder="e.g., 5">
        </div>
        <button onclick="fetchBookById()">Get Book</button>
    `;
    document.getElementById('results').innerHTML = '';
}

async function fetchBookById() {
    const bookId = document.getElementById('bookIdInput').value;
    if (!bookId) {
        showError('Please enter a book ID');
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`/api/books/${bookId}`);
        if (!response.ok) throw new Error('Book not found');
        const book = await response.json();
        displayResults(`Book #${bookId}`, book);
    } catch (error) {
        showError(error.message);
    }
}

function showFantasyBooks() {
    const inputSection = document.getElementById('input-section');
    inputSection.style.display = 'block';
    inputSection.innerHTML = `
        <h2>Filter by Genre</h2>
        <div class="form-group">
            <label for="genreInput">Enter Genre:</label>
            <input type="text" id="genreInput" placeholder="e.g., Fantasy">
        </div>
        <button onclick="fetchBooksByGenre()">Search</button>
    `;
    // Auto-fill and search for Fantasy
    setTimeout(() => {
        document.getElementById('genreInput').value = 'Fantasy';
        fetchBooksByGenre();
    }, 100);
}

async function fetchBooksByGenre() {
    const genre = document.getElementById('genreInput').value;
    if (!genre) {
        showError('Please enter a genre');
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`/api/books/genre/${encodeURIComponent(genre)}`);
        const books = await response.json();
        displayResults(`${genre} Books`, books);
    } catch (error) {
        showError(error.message);
    }
}

function searchForBooks() {
    const inputSection = document.getElementById('input-section');
    inputSection.style.display = 'block';
    inputSection.innerHTML = `
        <h2>Search Books</h2>
        <div class="form-group">
            <label for="searchInput">Search by Title or Author:</label>
            <input type="text" id="searchInput" placeholder="e.g., Harry">
        </div>
        <button onclick="fetchSearchResults()">Search</button>
    `;
    document.getElementById('results').innerHTML = '';
}

async function fetchSearchResults() {
    const searchTerm = document.getElementById('searchInput').value;
    if (!searchTerm) {
        showError('Please enter a search term');
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`/api/books/search/${encodeURIComponent(searchTerm)}`);
        const books = await response.json();
        displayResults(`Search Results for "${searchTerm}"`, books);
    } catch (error) {
        showError(error.message);
    }
}

function showTopBooks() {
    const inputSection = document.getElementById('input-section');
    inputSection.style.display = 'block';
    inputSection.innerHTML = `
        <h2>Top Rated Books</h2>
        <div class="form-group">
            <label for="ratingInput">Minimum Rating (0-5):</label>
            <input type="number" id="ratingInput" min="0" max="5" step="0.1" value="4.5">
        </div>
        <button onclick="fetchTopRated()">Get Top Books</button>
    `;
    // Auto-fetch
    setTimeout(() => fetchTopRated(), 100);
}

async function fetchTopRated() {
    const rating = document.getElementById('ratingInput').value || 4.5;
    
    showLoading();
    try {
        const response = await fetch(`/api/books/top/${rating}`);
        const books = await response.json();
        displayResults(`Books Rated ${rating}+`, books);
    } catch (error) {
        showError(error.message);
    }
}
