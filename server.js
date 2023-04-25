const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/owners/' , (req, res) => {
    fs.readdir(`${__dirname}/data/owners/`, 'utf8', (err, files) => {
        if (err) {
          res.status(404).send("dir not found");
          return;
        }
        let array = [];
        let count = 0;
        if (files.length === 0) {
          res.send(array);
          return;
        }
        files.forEach((file) => {
          fs.readFile(`${__dirname}/data/owners/${file}`, 'utf8', (err, data) => {
            if (!err) {  
            
              array.push(JSON.parse(data));
              console.log(array)
            }
            count++;
            if (count === files.length) {
              res.send(array);
            }
          });
        });
      });
    })

app.get("/owners/:id", (req, res) => {
  const id = req.params.id;


  fs.readFile(`${__dirname}/data/owners/o${id}.json`, 'utf8', (err, data) => {
    if (err) {
        res.status(404).send('file not found')
    } else {
        res.send(JSON.parse(data));
    }
  })  
});

app.listen(9090, () => {
  console.log("listening on 9090...");
});
/*
Build the following endpoint:

GET /owners
Considerations:

responds with an array containing the data of every owner (hint: you will need to use fs.readdir to read all of the file names in the owners folder)
*/
