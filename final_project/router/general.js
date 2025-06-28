const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');

// Using async/await
async function fetchBooks() {
  try {
    const response = await axios.get('http://localhost:5000/books');
    console.log(response.data);
  } catch (error) {
    console.error("Error (async/await):", error.message);
  }
}

async function fetchBookByISBNAsync(isbn) {
    try {
      const response = await axios.get(`http://localhost:5000/books/isbn/${isbn}`);
      console.log(`Book details for ISBN ${isbn} (async/await):`);
      console.log(response.data);
    } catch (error) {
      console.error(`Error fetching book by ISBN (async/await):`, error.message);
    }
  }
  
  // Function using Promise callbacks
  function fetchBookByISBNPromise(isbn) {
    axios.get(`http://localhost:5000/books/isbn/${isbn}`)
      .then(response => {
        console.log(`Book details for ISBN ${isbn} (Promise):`);
        console.log(response.data);
      })
      .catch(error => {
        console.error(`Error fetching book by ISBN (Promise):`, error.message);
      });
  }

  async function fetchBooksByAuthorAsync(author) {
    try {
      const response = await axios.get(`http://localhost:5000/books/author/${author}`);
      console.log(`Books by author "${author}" (async/await):`);
      console.log(response.data);
    } catch (error) {
      console.error(`Error fetching books by author (async/await):`, error.message);
    }
  }

  async function fetchBooksByTitleAsync(title) {
    try {
      const response = await axios.get(`http://localhost:5000/books/title/${title}`);
      console.log(`Books with title "${title}" (async/await):`);
      console.log(response.data);
    } catch (error) {
      console.error(`Error fetching book by title (async/await):`, error.message);
    }
  }

// Using Promise callback
function fetchBooksWithPromises() {
  axios.get('http://localhost:5000/books')
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Error (Promises):", error.message);
    });
}

fetchBooks();
fetchBooksWithPromises();
fetchBookByISBNAsync(1);
fetchBookByISBNPromise(1);

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
      if (!doesExist(username)) {
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const results = Object.values(books).filter(
    (book) => book.author === author
  );
  res.send(results);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const results = Object.values(books).filter(
    (book) => book.title === title
  );
  return res.send(results);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn]
  res.send(book.reviews);
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
