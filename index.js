// console.log("Hello world");
const express = require('express');
const app = express();
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

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
