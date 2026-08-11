const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return false;
  }

  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find(
    (user) => user.username === username && user.password === password,
  );

  if (!user) {
    return false;
  }
  return true;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here

  const { username, password } = req.body;
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, "access", { expiresIn: "1h" });
  req.session.authorization = { token, username };

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { review } = req.body;
  const book = books[isbn];
  const user = req.user;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (book.reviews) {
    book.reviews[user] = review;
  }

  const reviews = {
    ...book.reviews,
    [user]: review,
  };

  books[isbn] = {
    ...book,
    reviews: reviews,
  };

  return res.status(201).json({
    message: "success",
    book: { ...book, reviews: reviews },
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.user;
  const book = books[isbn];

  if (book.reviews) {
    delete book.reviews[user];
  }

  return res.status(200).json({
    message: `Review of ${user} user deleted successfully`,
    book: { ...book, reviews: book.reviews },
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
