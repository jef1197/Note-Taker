const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET all notes
notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
})

// Get for a specific note
notes.get('/:id', (req, res) => {
  const noteID = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id === noteID);
      return result.length > 0
        ? res.json(result)
        : res.json('No Note with that ID');
    });
});


// POST Route for a new UX/UI tip
notes.post('/', (req, res) => {
  const { title, text} = req.body;
  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`note added successfully`);
    } else {
    res.error('Error in adding note');
  }
});

// DELETE Route for a specific tip
notes.delete('/:id', (req, res) => {
  const noteID = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteID);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);
      res.json(`Item ${noteID} has been deleted`);

    });
});



module.exports = notes;