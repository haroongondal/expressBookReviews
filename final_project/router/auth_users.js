const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const reviewIdCounter = require('./reviewCounter.js');
const regd_users = express.Router();

let users = [];

const isValid = username => {
  //returns boolean
  //write code to check is the username is valid
};

//Function to check if the user is authenticated
const authenticatedUser = (username, password) => {
  let validusers = users.filter(user => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};
//only registered users can login
regd_users.post('/login', (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password
      },
      'access',
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username
    };
    return res.status(200).send('User successfully logged in');
  } else {
    return res
      .status(208)
      .json({ message: 'Invalid Login. Check username and password' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const user = req.user;
  let id = reviewIdCounter.getCounter();
  reviewIdCounter.incrementCounter();
  let response = {};
  if (review) {
    Object.keys(books).forEach(key => {
      if (books[key].ISBN === isbn) {
        response = {
          id,
          user: user.username,
          review
        };
        books[key].reviews.push(response);
      }
    });
    console.log('books: ', JSON.stringify(books));
    return res
      .status(200)
      .json({ message: 'Review Successfully submitted', data: response });
  }
});

// Update a book review
regd_users.put('/auth/review/:reviewID/:isbn', (req, res) => {
  const reviewId = req.params.reviewID;
  const isbn = req.params.isbn;
  const newReview = req.body.review;
  const user = req.user;
  let response = {};
  if (newReview) {
    Object.keys(books).forEach(key => {
      if (books[key].ISBN === isbn && books[key].reviews.length > 0) {
        books[key].reviews.find((rev, index) => {
          if (rev.id == reviewId && rev.user === user.username) {
            response = {
              id: reviewId,
              user: user.username,
              review: newReview
            };
            books[key].reviews[index] = response;
          }
        });
      }
    });
    if (response.id)
      return res
        .status(200)
        .json({ message: 'Review Updated successfully', data: response });
    else return res.status(404).json({ message: 'Review Not Found' });
  }
});

// Delete a book review
regd_users.delete('/auth/review/:reviewID/:isbn', (req, res) => {
  const reviewId = req.params.reviewID;
  const isbn = req.params.isbn;
  const user = req.user;
  let response = {};
  Object.keys(books).forEach(key => {
    if (books[key].ISBN === isbn && books[key].reviews.length > 0) {
      books[key].reviews.find((rev, index) => {
        if (rev.id == reviewId && rev.user === user.username) {
          response = {
            id: reviewId
          };
          books[key].reviews.splice(index, 1);
        }
      });
    }
  });
  console.log('books: ' + JSON.stringify(books));
  if (response.id)
    return res.status(200).json({ message: 'Review deleted successfully' });
  else return res.status(404).json({ message: 'Review Not Found' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
