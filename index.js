// Create Express Application
const express = require("express");
const app = express();
const routes = require("./routes");
const PORT = 8081;
const REMOVEDB = true;
const path = require("path");

// Initialize Database
const fileSystem = require("fs");
const sqlite3 = require("sqlite3").verbose();

const dbFile = path.join("./eindproject.db");
if (REMOVEDB) fileSystem.unlinkSync(dbFile);
const dbFileExists = fileSystem.existsSync(dbFile);
const database = new sqlite3.Database(dbFile);

global.database = database;

// Create Database Tables
const SQLUsers =
  "CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, firstName TEXT, deleted INTEGER DEFAULT 0);";
const SQLNotes =
  "CREATE TABLE Notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, userId INTEGER, deleted INTEGER DEFAULT 0, FOREIGN KEY(userId) REFERENCES Users(id));";
const SQLCategories =
  "CREATE TABLE Categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, color TEXT, userId INTEGER, deleted INTEGER DEFAULT 0, FOREIGN KEY(userId) REFERENCES Users(id));";
const SQLTrash =
  "CREATE TABLE Trash (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, itemId INTEGER, deleted INTEGER DEFAULT 0);";
const SQLNotesCategories =
  "CREATE TABLE Notes_Categories (noteId INTEGER, categoryId INTEGER, FOREIGN KEY(noteId) REFERENCES Notes(id), FOREIGN KEY(categoryId) REFERENCES Categories(id));";

database.serialize(() => {
  if (!dbFileExists) {
    database.run(SQLUsers);
    database.run(SQLNotes);
    database.run(SQLCategories);
    database.run(SQLTrash);
    database.run(SQLNotesCategories);
  }
});

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

// Connect routes
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Eindwerk - Backend listening on port ${PORT}`);
  console.log(`Delete Database on run: ${REMOVEDB}`);
});
