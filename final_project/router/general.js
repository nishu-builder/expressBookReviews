const express = require('express');
let books = require("./booksdb.js");
let { isValid, users } = require("./auth_users.js");
const general_routes = express.Router();


general_routes.post("/register", (req,res) => {
  const user = req.body.user;
  if (!(user.username && user.password)) {
    return res.status(400).json({message: 'Invalid body'});
  }
  if (users.find(u => u.username === user.username)) {
    return res.status(400).json({message: 'Already exists'});
  }
  users.push({username: req.body.user.username, password: req.body.user.password});
  return res.status(201).json({message: 'Created'});
});

async function fetch_books() {
  return await new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 500)});
}

// Get the book list available in the shop
general_routes.get('/', async function (req, res) {
  return res.status(200).json(await fetch_books());
});

// Get book details based on ISBN
general_routes.get('/isbn/:isbn', async function (req, res) {
  const book = await fetch_books()[req.params.isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});  
  }
  return res.status(200).send(book);
 });
  
// Get book details based on author
general_routes.get('/author/:author', async function (req, res) {
  return res.status(200).send(await fetch_books().filter(b => b.author === req.params.author));
});

// Get all books based on title
general_routes.get('/title/:title',async function (req, res) {
  return res.status(200).send(await fetch_books().filter(b => b.title === req.params.title));
});

//  Get book review
general_routes.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});  
  }
  return res.status(200).send(book.reviews);
});

module.exports.general_routes = general_routes;
