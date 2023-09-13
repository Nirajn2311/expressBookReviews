const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: 'User registered successfully' });
    } else {
      return res.status(400).json({ message: 'Username already exists' });
    }
  }
  return res.status(400).json({ message: 'Username/password is missing' });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  return res.send(books[ISBN]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  let data = [];
  for (let i in books) {
    if (books[i].author === author) {
      data.push(books[i]);
    }
  }
  return res.send(data);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  let data = [];
  for (let i in books) {
    if (books[i].title === title) {
      data.push(books[i]);
    }
  }
  return res.send(data);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  return res.send(books[ISBN].reviews);
});

module.exports.general = public_users;
