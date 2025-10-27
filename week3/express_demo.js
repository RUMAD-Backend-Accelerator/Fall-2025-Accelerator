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
/* Insert here */
//  .../api/books?genre=Fantasy
app.get("/api/books", (req, res) => {
    const genre = req.query.genre
    console.log(genre)
    let bookRes = books;
    if(genre) {
        bookRes = books.filter(book => book.genre.toLowerCase() === genre.toLowerCase())
    }
    res.send(bookRes)
})

//GET book by ID using parameter
/*Insert here */

app.get("/api/books/:id", (req, res) => {
    let id = Number(req.params.id)
    if(isNaN(id)) {
        return res.sendStatus(400).send("Invalid parameter")
    }
    
    const correctBook = books.find(book => book.id === id)
    res.send(correctBook)
})


//POST comment on book


app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
}) 

