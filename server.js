

// GIVEN a note-taking application
// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page
// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the  note’s text in the right-hand column
// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page
// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column
// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column

// The application should have a db.json file on the back end that will be used to store and retrieve notes using the fs module.

// The following HTML routes should be created:



// Import the needed libraries/modules
const fs = require('fs');  // Imports the file system module for reading/writing files
const express = require('express');
// let db = require('./db/db.json');
const bodyParser = require("body-parser");  // For reading the body of post requests
const PORT = 3001;  // Specify on which port the Express.js server will run
const path = require('path');  // Import built-in Node.js package 'path' to resolve path of files that are located on the server

// Initialize the Express application
const app = express();  // Initialize an instance of Express.js
app.use(bodyParser.json());  // For reading incoming JSON data from the client
app.use(express.static('public'));  // Static middleware pointing to the public folder


// ROUTES

// GET /notes should return the notes.html file.  
app.get('/notes', (req, res) => {
    console.log("/notes get request received...")
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});

// GET /api/notes should read the db.json file and return all saved notes as JSON. 
app.get('/api/notes', (req, res) => {
    console.log("/api/notes get request received...")
    //res.json(db)  // Should change to fs.read to avoid caching XXXXXXXXXXXXXXXXXXXXX

    fs.readFile("./db/db.json", function(err, data) {
      
      // Check for errors
      if (err) throw err;

      console.log("Sending notes to client: ")
      console.log(data)
     
      // Send the data
      res.json(JSON.parse(data));

    });
    
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you). 
app.post('/api/notes', (req, res) => {
    console.log("/api/notes POST request received...")

    // Receive the incoming note (it will be json object)
    let newNote = req.body;
    console.log(newNote);

    // Read the current db file
    fs.readFile("./db/db.json", function(err, data) {
      
      // Check for errors
      if (err) throw err;
     
      // Converting to JSON
      let dbData = JSON.parse(data);
      console.log(dbData); 

    // Find the highest id in the db...
    // Loop through objects in dbData and find highest id
    // for (let i=0; ....) -- "counting" for loop -- good when you need a counter
    // for (let element of collection) .... -- when you just need to loop through objects
    let maxId = 0;
    for (let note of dbData) {
      // if the note's id is > maxId, then set maxId = note's id
      if (note.id > maxId)
      {
        maxId = note.id;
      } 
    }

    // Assign the new note the next higher id
    newNote.id = maxId +1

    // Add the new note object to the db array
    dbData.push(newNote)

    // Save the db array to the db.json file
    const dataToWrite = JSON.stringify(dbData, null, 4);
    fs.writeFile("./db/db.json", dataToWrite, (err) => {
      
      // Check for errors
      if (err) throw err;
  
      // Respond with a 200? Need to study the current code here.
      res.status(200).json("note added");

    });

  });


});


// GET * should return the index.html file.
app.get('*', (req, res) => {
    console.log("/default request received...")
    res.sendFile(path.join(__dirname, 'public/index.html'))
});


// Start listening....
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);



