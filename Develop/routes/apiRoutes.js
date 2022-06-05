const db = require("../db/db.json");
const fs = require("fs");
var path = require("path");

module.exports = function (app) {
  // Read the db.json file
  let objectsList = JSON.parse(fs.readFileSync("./db/db.json", "utf8", (err) => {
    if (err) throw err;
  }));

  // API GET Requests
  app.get("/api/notes", function (req, res) {
    return res.json(objectsList)
  })

  // API POST Requests
  app.post("/api/notes", function (req, res) {
    let newNote = { title: req.body.title, text: req.body.text }; // New object built with 
    newNote.id = objectsList.length.toString(); // convert to string and add to note

    objectsList.push(newNote); // Add new object to objects list

    fs.writeFile("./db/db.json", JSON.stringify(objectsList), (err) => {
      if (err) throw err;
    });
    res.json(objectsList);
  });

  // API DELETE Requests  
  app.delete("/api/notes/:id", function (req, res) {
    let idSelected = JSON.parse(req.params.id);   // Get the id selected by the user
    // New array of objects by filtering out the object with the selected id
    objectsList = objectsList.filter((e) => {
      return e.id != idSelected;
    });
    // Reassign object.id to array index of objectsList
    objectsList.forEach((val, index) => {
      val.id = index.toString();
    });

    fs.writeFile("./db/db.json", JSON.stringify(objectsList), (err) => {
      if (err) throw err;
    });
    res.end(); // Shorten the response
  });

  /* EXTRA FOR FUTURE DEVELOPMENT:
  //API PUT Requests
  app.put("/api/notes/:id", function (req, res) {
    let idSelected = JSON.parse(req.params.id);
    let note = objectsList.filter((e) => {
      return e.id == idSelected;
    });
    console.log("note to update:", details);   // FOR TESTING
    note = { title: req.body.title, text: req.body.text };
    objectsList.forEach((val) => {
      if (val.id == idSelected) {
        console.log("Object matching id", val);   // FOR TESTING
        val = note;
      };
    });
    fs.writeFile("./db/db.json", JSON.stringify(objectsList), (err) => {
      if (err) throw err;
    });
    res.send(note);
  });
  */
};
