const express = require('express')
const path = require('path');

const app = express()
const port = 3000

//enables us to get information posted from the request body (Express 5.x)
app.use(express.json())

//list of books
let books = require('./books.json')

//return index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

//GET using query string e.g. ?genre=Dystopia
//gets all books or gets by genre
//  .../api/books?genre=Fantasy
// .../api/books
app.get("/api/books", (req, res) => {
    //get genre from query string
    const genre = req.query.genre

    //initialize books (we send all books if no query parameter is passed in)
    let bookRes = books;

    //if ?genre is specified in path then we filter by genre
    if(genre) {
        bookRes = books.filter(book => book.genre.toLowerCase() === genre.toLowerCase())
    }

    //send filtered or non-filtered books
    res.send(bookRes)
})

//GET book by ID using parameter
//.../api/books/1

app.get("/api/books/:id", (req, res) => {
    //get id from path parameters
    let id = Number(req.params.id)

    //check if id is invalid --> send error 400
    if(isNaN(id)) {
        //CORRECTION HERE changed "sendStatus" to "status"!!!
        return res.status(400).send("Invalid parameter")
    }
    //find the correct book based on if its id (book.id) matches id
    const correctBook = books.find(book => book.id === id)
    res.send(correctBook)
})

//POST comment on book
app.post("/api/books/:id/comments", (req, res) => {
    //get comment json from req.body
    const comment = req.body

    //get bookId from path parameters
    const bookId = Number(req.params.id) 

    //console.log(comment)

    //check if comment is null --> send error 400
    if(!comment) {
        return res.status(400).send("Comment required")
    }
    //check if bookId is invalid --> send error 400
    if(isNaN(bookId)) {
        return res.status(400).send("Invalid parameter.")
    }

    // Find book that equals bookId in our books array
    const book = books.find(book => book.id === bookId)

    // If book not found --> send error 404
    if(!book) {
        return res.status(404).send("Book not found.")
    }

    //push comment to book.comments
    book.comments.push(comment.comment)

    //send updated book --> acts as a confirmation
    res.send({data: book})
})


app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
}) 

