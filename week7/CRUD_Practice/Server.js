/* This file builds off of our previous Express Demo but now instead of pulling books from memory, you will make operations on your 
    database to allow your client to access resources.
   
    Prereqs:
    1. Make sure your .env is configured.
    2. Create your 'books' table in Supabase -- some SQL is there in SeedBooks.js or you can manually create a table
        with Supabase's GUI.
    3. Run SeedBooks.js to fill in your table with books to save you some time.

    You will implement:
    1. Getting all books & filtering by genre
    2. Getting a book by its id
    3. Posting comments
        For this we will take a simpler approach of first getting the book that we're trying to update,
        adding the new comment, and then updating the row in the table.
        This will require 2 queries instead of 1.

    If you have time, think about better ways you could design a system for storing books and their comments.
    What if we wanted a comment to also include information about who posted it, when they posted it, etc. ?

    Also notice that now if you restart your server, your new comments will load up every time. Now these updates
    are permanent because you're using persistent storage instead of in-memory storage!

*/

const express = require('express')
const path = require('path');
const { supabase } = require('./SupabaseClient')

const app = express()
const port = 3000

//enables us to get information posted from the request body (Express 5.x)
app.use(express.json())

//return index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

//GET using query string e.g. ?genre=Dystopia
//gets all books or gets by genre
//  .../api/books?genre=Fantasy
// .../api/books

//Note: In select queries if we don't specify an order, no order is guaranteed 
app.get("/api/books", async (req, res) => {
    //get genre from query string
    const genre = req.query.genre

    //initialize books (we send all books if no query parameter is passed in)
    let books = [];

    //if ?genre is specified in path then we filter by genre
    // TO DO: get the books from the books table in our database and filter by genre

    

    //TO DO: by default get all books from the database
    try {
        if(genre) {
            const { data, error } = await supabase
                .from('books')
                .select('*')
                .eq('genre', genre)
                .order('id', { ascending: true });
            
            if (error) return res.json({ errorMessage: error.message });
            return res.send(data);        
        }

        const { data, error } = await supabase
            .from('books')
            .select('*')
            .order('id', { ascending: true });

            if (error) return res.json({ errorMessage: error.message });
            
            return res.send(data);
    } catch (error) {
        res.json({ errorMessage: error.message });
    }
})

//GET book by ID using parameter
//.../api/books/1

app.get("/api/books/:id", async (req, res) => {
    //get id from path parameters
    let id = Number(req.params.id)

    //check if id is invalid --> send error 400
    if(isNaN(id)) {
        //CORRECTION HERE changed "sendStatus" to "status"!!!
        return res.status(400).send("Invalid parameter")
    }

    //TO DO: find the correct book based on if its id (book.id) matches id
    if (id){
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .eq('id', id)
            .single();
            
            if (error) return res.json({ errorMessage: error.message });
            return res.send(data); 
    }
})

//POST comment on book
//The way that this is stored in our db --> this is an update operation
// We are updating the comments on a book row

app.post("/api/books/:id/comments", async (req, res) => {
    //get comment json from req.body
    const comment = req.body.comment

    //get bookId from path parameters
    const bookId = Number(req.params.id)

    //check if comment is null --> send error 400
    if(!comment) {
        return res.status(400).send("Comment required")
    }
    //check if bookId is invalid --> send error 400
    if(isNaN(bookId)) {
        return res.status(400).send("Invalid parameter.")
    }

    try {
        // 1. Get book
        const { data: book, error: getError } = await supabase
            .from('books')
            .select('*')
            .eq('id', bookId)
            .single();

        if (getError || !book) {
            return res.status(404).json({ errorMessage: "Book not found" });
        }

        // 2. Add new comment
        // If client sends { "text": "hello" }
        const newComment = comment;
        const updatedComments = [...book.comments, newComment];

        // 3. Update in database
        const { data: updatedData, error: updateError } = await supabase
            .from('books')
            .update({ comments: updatedComments })
            .eq('id', bookId)
            .select()
            .single();

        if (updateError) {
            return res.status(500).json({ errorMessage: updateError.message });
        }

        return res.send(updatedData);

    } catch (error) {
        return res.status(500).json({ errorMessage: error.message });
    }
});
    // Supabase doesn't natively have "push" to a column array
    // Using Supabase rpc, we can directly define a function in SQL and call it
    // rpc = remote procedure call
    // For now let's just replace the whole array but in a better implementation, you would write the SQL query for pushing to a list column value

    // Can you think of an even better way to store comments in our database?

    // TO DO: Retrieve the book by id from the database
    // CODE GOES HERE

    // TO DO: add the new comment to the retrieved book's comments
    // CODE GOES HERE

    // TO DO: Update the book in the database with the new comments
    // CODE GOES HERE

    //send updated book --> acts as a confirmation
    



app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
}) 

