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
app.get("/api/books", (req, res) => {
    const genre = req.query.genre
    let booksRes = books
    if(genre) {
        booksRes = books.filter((book) => book.genre.toLowerCase() === genre.toLowerCase())
    }
    res.send(booksRes)
})

//GET using parameter
app.get("/api/books/:id", (req, res) => {
    let id;
    try {
        id = Number(req.params.id)
        if (isNaN(id)) {
            throw new Error(`id ${id} is not a number.`)
        }
    } catch (e) {
        return res.status(400).send("Invalid parameter: " + e)
    }
    const correctBook = books.find(book => book.id === id)
    if(!correctBook) {
        return res.status(404).send("Book not found")
    }
    res.send(correctBook)
})

//POST comment on book
app.post("/api/books/:id/comments", (req, res) => {
    const comment = req.body
    const id = Number(req.params.id)

    if (isNaN(id)) {
        return res.send(400).send(`id ${id} is not a number.`)
    }

    if(!comment) {
        return res.send(400).send(`Comment is required.`)
    }
    
    console.log(comment)

    const book = books.find(b => b.id === id)
    if (!book) {
        return res.status(404).send("Book not found");
    }

    book.comments.push(comment["comment"])
    
    res.send("Comment posted!")
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
}) 

