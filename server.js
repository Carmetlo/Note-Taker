const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const getNotes = () =>
  readFile("./db/db.json", "utf8").then((rawNotes) =>
    [].concat(JSON.parse(rawNotes)));   
const app = express();
const port = process.env.PORT || 3000;
const { v4: uuidv4 } = require("uuid");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Define an endpoint to clear all notes
// app.delete("/api/notes/clear-all", (req, res) => {
//   const dbPath = path.join(__dirname, "db.json");

//   // Clear the contents of db.json
//   fs.writeFileSync(dbPath, "[]");

//   res.json({ message: "All notes cleared successfully." });
// });

// GET route to retrieve all notes
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await getNotes();
    res.json(notes);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving notes");
  }
});
// POST route to create a new note
app.post("/api/notes", (req, res) => {
  getNotes().then((notes) => {
    const newNote = {
      id: uuidv4(),
      title: req.body.title,
      text: req.body.text,
    };
    const noteArray = [...notes, newNote];
    writeFile("./db/db.json", JSON.stringify(noteArray)).then(() =>
      res.json({ msg: "Donesies" })
    );
  });
});

// DELETE route to delete a note
app.delete("/api/notes/:id", (req, res) => {
  // Add a DELETE /api/notes/:id route
  getNotes().then((notes) => {
    const noteArray = notes.filter(
      (note) => note.id !== req.params.id.toString()
    );
    writeFile("./db/db.json", JSON.stringify(noteArray)).then(() =>
      res.json({ msg: "Note deleted" })
    );
  });
});

// Start the server on the port
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
