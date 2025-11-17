-- Supabase Books Table Setup
-- Run this SQL in Supabase SQL Editor to create the books table

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT NOT NULL,
    year INTEGER NOT NULL,
    rating DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 5),
    description TEXT,
    comments TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
-- For demo purposes, we'll allow all operations without authentication
CREATE POLICY "Enable all operations for all users" ON books
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create an index on genre for faster filtering
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);

-- Create an index on author for faster searching
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);

-- Insert sample data from week3 books.json
INSERT INTO books (id, title, author, genre, year, rating, description, comments) VALUES
(1, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Classic Fiction', 1925, 4.2, 'A story of wealth, love, and the elusive American Dream, set in the roaring 1920s.', ARRAY['A timeless classic!', 'Loved the symbolism and themes.']),
(2, 'Pride and Prejudice', 'Jane Austen', 'Romance', 1813, 4.5, 'Elizabeth Bennet navigates issues of manners, morality, and marriage in 19th century England.', ARRAY['My favorite book ever.', 'Elizabeth and Darcy forever 💕']),
(3, '1984', 'George Orwell', 'Dystopian', 1949, 4.4, 'A chilling portrayal of a totalitarian regime and the dangers of absolute political control.', ARRAY['Still relevant today.', 'Very thought-provoking.']),
(4, 'To Kill a Mockingbird', 'Harper Lee', 'Historical Fiction', 1960, 4.3, 'A young girl comes of age in the racially charged Deep South, guided by her father Atticus Finch.', ARRAY['Heartbreaking and inspiring.', 'Scout is such a great narrator.']),
(5, 'The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 1937, 4.7, 'Bilbo Baggins embarks on an unexpected adventure with a band of dwarves to reclaim their homeland.', ARRAY['Wholesome adventure!', 'Great for all ages.']),
(6, 'The Catcher in the Rye', 'J.D. Salinger', 'Coming-of-Age', 1951, 3.9, 'Holden Caulfield recounts his teenage experiences with alienation and loss in 1950s New York.', ARRAY['A bit moody but relatable.', 'Classic teen angst story.']),
(7, 'The Alchemist', 'Paulo Coelho', 'Philosophical Fiction', 1988, 4.1, 'A young shepherd named Santiago embarks on a journey to fulfill his personal legend.', ARRAY['Inspiring read!', 'Simple yet profound.']),
(8, 'Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'Fantasy', 1997, 4.8, 'A young boy discovers he''s a wizard and begins his adventures at Hogwarts School of Witchcraft and Wizardry.', ARRAY['Magical!', 'Childhood nostalgia.']),
(9, 'The Fault in Our Stars', 'John Green', 'Young Adult', 2012, 4.3, 'Two teenagers with cancer fall in love and search for meaning together.', ARRAY['Made me cry.', 'So emotional!']),
(10, 'Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'Non-Fiction', 2011, 4.6, 'A sweeping history of human evolution, culture, and progress from ancient times to the modern age.', ARRAY['Mind-expanding.', 'Makes you rethink everything.'])
ON CONFLICT (id) DO NOTHING;

-- Reset the sequence to continue from the highest ID
SELECT setval('books_id_seq', (SELECT MAX(id) FROM books));

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to call the function before any update
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
