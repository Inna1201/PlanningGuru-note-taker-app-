const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
// generates random ID's
const { v4: uuidv4 } = require('uuid');

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for using all assets included in a public folder
app.use(express.static('public'));

// GET route to the index.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

// GET route to the notes.html page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

// GET request to view all notes
app.get('/api/notes', (req, res) => {
    // picks up the string from db.json file
    readFile('db/db.json', 'utf-8').then(rawNotes => {
        // converts data to objects array
        const notes = JSON.parse(rawNotes);
        // sends data to user
        res.json(notes);

    });
});

// POST request to add the note
app.post('/api/notes', (req, res) => {
    // picks up the string from db.json file
    readFile('db/db.json', 'utf-8').then(rawNotes => {
        // converts data to objects array
        const notes = JSON.parse(rawNotes);
        // adds ID to each new created object
        const noteObject = { title: req.body.title, text: req.body.text, id: uuidv4() }
        // adds new object to already exsisting objects array
        const noteArray = [...notes, noteObject]
        // converts data back to a string and writes to db.json file
        writeFile('db/db.json', JSON.stringify(noteArray)).then(() => {
            res.json({ msg: 'OK' })
        })
    })
});

// DELETE request to delete the note
app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id)
    // picks up the string from db.json file
    readFile('db/db.json', 'utf-8').then(oldNotes => {
        // converts data to objects array
        const notes = JSON.parse(oldNotes)
        // removes unvanted object from array
        const newNotes = notes.filter(note => note.id !== req.params.id)
        console.log(newNotes)
        // converts back to a string and writes to db.json file




        // const newNotesArray = [...newNotes]
        // writeFile('db/db.json', JSON.stringify(newNotesArray)).then(() => {
        //     res.json({ msg: 'OK' })


        // writeFile('db/db.json', JSON.stringify(newNotes)).then(() => {
        //     res.json({ msg: 'OK' })

        // .then(newNotes => {
        //     writeFile('db/db.json', JSON.stringify(newNotes)).then(()=>{
        //         res.json({msg: 'OK'})
        //       })
        // })

        // .then(filtredNotes => {
        //     writeFile('db/db.json', JSON.stringify(filtredNotes)).then(()=>{
        //         res.json({msg: 'OK'})
        //       })
        // })
    })
})

// Listens for connections
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);