const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const axios = require('axios');
const public_users = express.Router();
const _books = Object.values(books);

const base_url = 'http://localhost:5000';

//Function to check if the user exists
const doesExist = username => {
  let userswithsamename = users.filter(user => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

function createSuccessMessage(data) {
  return { message: 'success', data: data };
}

function createFailureMessage() {
  return { message: 'Book Not Found' };
}

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: 'User successfully registred. Now you can login' });
    } else {
      return res.status(404).json({ message: 'User already exists!' });
    }
  }
  return res.status(404).json({ message: 'Unable to register user.' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(createSuccessMessage(_books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let book = _books.filter(function (_book) {
    return _book.ISBN === isbn;
  });
  if (book) return res.status(200).json(createSuccessMessage(book));
  return res.status(404).json(createFailureMessage());
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let book = _books.filter(function (_book) {
    return _book.author === author;
  });
  if (book) return res.status(200).json(createSuccessMessage(book));
  return res.status(404).json(createFailureMessage());
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let book = _books.filter(function (_book) {
    return _book.title === title;
  });
  if (book) return res.status(200).json(createSuccessMessage(book));
  return res.status(404).json(createFailureMessage());
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let book = _books.find(function (_book) {
    return _book.ISBN === isbn;
  });
  if (book) return res.status(200).json(createSuccessMessage(book.reviews));
  return res.status(404).json(createFailureMessage());
});

// Function to make a request to the given endpoint and return a promise
const fetchData = endpoint => {
  return axios
    .get(`${base_url}${endpoint}`)
    .then(response => console.log(response.data))
    .catch(error => console.log(error));
};

fetchData('/'); // Task 10
fetchData('/isbn/978-3-16-148410-2'); // Task 11
fetchData('/author/Unknown'); // Task 12
fetchData('/title/Fairy tales'); // Task 13

module.exports.general = public_users;
