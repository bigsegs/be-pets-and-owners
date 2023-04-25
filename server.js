const fs = require("fs/promises");
const express = require("express");
const path = require("path");
const app = express();

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/owners", (req, res) => {
  fs.readdir(`${__dirname}/data/owners/`, "utf8", (err, files) => {
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
      fs.readFile(`${__dirname}/data/owners/${file}`, "utf8", (err, data) => {
        if (!err) {
          array.push(JSON.parse(data));
          console.log(array);
        }
        count++;
        if (count === files.length) {
          res.send(array);
        }
      });
    });
  });
});

app.get("/owners/:id/pets", (req, res) => {
  const { id } = req.params;
  const petDataArr = [];
  fs.readdir(`./data/pets`, "utf8").then((fileNames) => {
    const allFilesRead = fileNames.map((file) => {
      return fs.readFile(`./dat/pets/${file}`, "utf8").then((fileContents) => {
        const content = JSON.parse(fileContents);
        if (content.owner === `o${id}`) {
          petDataArr.push(content);
        }
      });
    });
    Promise.all(allFilesRead).then(() => {
      res.status(200).send(petDataArr);
    });
  });
});
//o1 has 1,4, 11

app.get("/owners/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile(`${__dirname}/data/owners/o${id}.json`, "utf8", (err, data) => {
    if (err) {
      res.status(404).send("file not found");
    } else {
      res.send(JSON.parse(data));
    }
  });
});
app.get("/api/pets", (req, res) => {
  const { temperament } = req.query;
  fs.readdir("./data/pets")
    .then((petFiles) => {
      const readAllPetFiles = petFiles.map((petFile) => {
        return fs.readFile(`./data/pets/${petFile}`, "utf8");
      });
      return Promise.all(readAllPetFiles);
    })
    .then((petsContents) => {
      const allPets = petsContents.map((petContent) => {
        return JSON.parse(petContent);
      });
      if (temperament) {
        const filteredPets = allPets.filter((pet) => {
          return pet.temperament === temperament;
        });
        res.status(200).send({ pets: filteredPets });
      } else {
        res.status(200).send({ pets: allPets });
      }
    });
});
app.listen(9090, () => {
  console.log("listening on 9090...");
});
/*
Build the following endpoint:

/GET /api/pets?temperament=grumpy responds
Considerations:

responds with an array containing the data of every owner (hint: you will need to use fs.readdir to read all of the file names in the owners folder)
*/
