const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (!isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const getBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };

    const bookList = await getBooks();
    return res
      .status(200)
      .json({ books: bookList, message: "Books retrieved successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving books", error: error.message });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];

    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        if (book) {
          resolve(book);
        } else {
          reject(new Error("Book not found"));
        }
      });
    };

    const result = await getBookByISBN(isbn);

    return res
      .status(200)
      .json({ books: result, message: "Book retrieved successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving books", error: error.message });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const author = req.params.author;

    const getBooksByAuthor = (author) => {
      return new Promise((resolve) => {
        const filteredBooks = Object.values(books).filter(
          (book) => book.author.toLowerCase() === author.toLowerCase(),
        );

        if (filteredBooks) {
          resolve(filteredBooks);
        } else {
          reject(new Error("Books not found"));
        }
      });
    };

    const result = await getBooksByAuthor(author);

    return res
      .status(200)
      .json({ books: result, message: "Books retrieved successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving books", error: error.message });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title;

    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(
          (book) => book.title.toLowerCase() === title.toLowerCase(),
        );

        if (filteredBooks) {
          resolve(filteredBooks);
        } else {
          reject(new Error("Books not found"));
        }
      });
    };

    const result = await getBooksByTitle(title);

    return res
      .status(200)
      .json({ books: result, message: "Books retrieved successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving books", error: error.message });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  const data = {
    [isbn]: {
      reviews: book.reviews,
    },
  };

  return res.status(200).json({
    books: data,
    message: "Book reviews retrieved successfully",
  });
});

module.exports.general = public_users;
