// console.log("Hello world");
const express = require('express');
const app = express();
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const { response } = require('express');

let db = null;
const dbPath = path.join(__dirname, "goodreads.db");
const initializeDbBAndServer = async () => {
    try {
        db = await open({
            filename : dbPath,
            driver: sqlite3.Database
        });
        app.listen(3000, () => {
            console.log("http://localhost:3000/");
        });
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    };
};
initializeDbBAndServer();

// get books
app.get("/books/", async(request, response) => {
    const { offset, limit, search_q="password", order, order_by} = request.query;
    const getbooksQuery = `
    SELECT 
    * 
    FROM 
    author
    WHERE
    book LIKE '%${search_q}%'
    ORDER BY ${order_by} ${order}
    LIMIT ${limit} OFFSET ${offset};`;
    const booksArray = await db.all(getbooksQuery);
    response.send(booksArray);
});

// get book
app.get("/books/:no/", async(request, response) => {
    const { id } = request.params;
    const getbooksQuery = `
    SELECT 
    * 
    FROM 
    author
    WHERE
    no = ${id};`;
    const book = await db.get(getbooksQuery);
    response.send(book);
});

//add book
app.use(express.json());
app.post("/books/" , async(request, response) => {
    const bookDetails = request.body;
    const { id, writter, book } = bookDetails;
    const addBookQuery = `
    INSERT INTO author(id, writter, book) VALUES ( '${id}', '${writter}' , '${book}' );
    `;
    const dbResponse = await db.run(addBookQuery);
    const bookId = dbResponse.lastID;
    response.send({ bookId : bookId });
});

//update book
app.put("/books/:bookId/", async(request, response) => {
    const { bookId } = request.params;
    const bookDetails = request.body;
    const { book } = bookDetails;
    const updateBookQuery = `
    UPDATE author SET book = '${book}' WHERE id = ${bookId};
    `; 
    await db.run(updateBookQuery);
    response.send("book updated successfully");
});

// delete book
app.delete("/books/:bookId/", async(request, response) =>{
    const { bookId } = request.params;
    const deleteBookQuery = `
    DELETE FROM author WHERE id = ${bookId}
    `;
    await db.run(deleteBookQuery);
    response.send("book deleted successfully");
});
