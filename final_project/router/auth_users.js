const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [{ username: 'test', password: '12345' }];

const isValid = username => {
  //returns boolean
  //write code to check is the username is valid
  return users.filter(user => user.username === username).length === 0;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return (
    users.filter(
      user => user.username === username && user.password === password
    ).length === 1
  );
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {
          username: username,
        },
        'access',
        { expiresIn: '1h' }
      );
      req.session.authorization = { accessToken };
      return res.status(200).json({ message: 'User logged in successfully' });
    } else {
      return res.status(400).json({ message: 'Username/password is wrong' });
    }
  }
  return res.status(400).json({ message: 'Username/password is missing' });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const ISBN = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  let book = books[ISBN];
  if (book) {
    book.reviews[username] = review;
    return res.status(200).json({ message: 'Review successfully posted' });
  } else {
    return res.status(400).json({ message: 'ISBN not found' });
  }
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const ISBN = req.params.isbn;
  const username = req.user.username;

  let book = books[ISBN];
  if (book) {
    delete book.reviews[username];
    return res.status(200).json({ message: 'Review successfully deleted' });
  } else {
    return res.status(400).json({ message: 'ISBN not found' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
