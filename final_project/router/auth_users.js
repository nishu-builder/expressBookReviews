const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const customer_routes = express.Router();

let users = [];

const isValid = (username) => {
  return !!username;
}

const authenticatedUser = (username,password) => {
  return users.find(u => u.username === username)?.password === password;
}

//only registered users can login
customer_routes.post("/login", (req,res) => {
  const user = req.body.user;
  if (!user) {
      return res.status(404).json({message: "Body Empty"});
  }
  if (!isValid(user.username)) {
    return res.status(400).json({message: "Invalid username"});
  }
  if (!authenticatedUser(user.username, user.password)) {
    return res.status(403).json({message: "Invalid username / password combination"});
  }
  let accessToken = jwt.sign({
      data: user
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken
  }
  return res.status(200).send("User successfully logged in");
});

// Add a book review
customer_routes.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});  
  }
  console.log(req.user);
  book.reviews[req.user.data.username] = req.body.message;
  return res.status(201).send(book);
});

// Add a book review
customer_routes.delete("/auth/review/:isbn/delete", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});  
  }
  delete book.reviews[req.user.data.username];
  return res.status(201).send(book);
});


module.exports.customer_routes = customer_routes;
module.exports.isValid = isValid;
module.exports.users = users;
