const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const getNotes = () => readFile('./db/db.json', 'utf8').then(rawNotes => [].concat(JSON.parse(rawNotes)));
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.get("/" , (req, res) => {
    res.sendFile(path.join (__dirname, "./public/index.html"));
});
app.get("/notes" , (req, res) => {
    res.sendFile(path.join (__dirname, "./public/notes.html"));
});
app.get("/api/notes", (req, res) => {
    getNotes().then(notes => res.json(notes));
});
app.post("/api/notes", (req, res) => {
    getNotes().then(notes => {
        
        const newNote = {title: req.body.title, text: req.body.text};
        const noteArray = [...notes, newNote]
        writeFile("./db/db.json", JSON.stringify(noteArray)).then (() => res.json({msg: "Donesies"}))
    });
     
});
// Go for the bonus yo! Need to have an ID, UUID is a good npm package cory says, 

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

