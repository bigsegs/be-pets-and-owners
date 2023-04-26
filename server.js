
const fs = require("fs/promises");
const express = require("express");

const app = express();
app.use(express.json())

const controllers=require('./controllers/ownerController.js');
const patchOwnerById=controllers.patchOwnerById


app.get("/", (req, res) => res.send("Hello World!"));

app.get("/owners", (req, res) => {
  fs.readdir(`${__dirname}/data/owners/`, "utf8").then((files) => {
   console.log(files)
    let array = [];
    let count = 0;
    if (files.length === 0) {
      res.send(array);
      return;
    }
    files.forEach((file) => {
      fs.readFile(`${__dirname}/data/owners/${file}`, "utf8").then((data) => {
        
          array.push(JSON.parse(data));
          console.log(array);
       
        count++;
        if (count === files.length) {
          res.send(array);
        }
      });
    });
  });
});


// -----------------------------------------------------


app.get("/owners/:id/pets", (req, res) => {
  const { id } = req.params;
  const petDataArr = [];
  fs.readdir(`./data/pets`, "utf8").then((fileNames) => {
    const allFilesRead = fileNames.map((file) => {
      return fs.readFile(`./data/pets/${file}`, "utf8").then((fileContents) => {
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

//----------------------------------------

app.get("/owners/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile(`${__dirname}/data/owners/o${id}.json`, "utf8").then((data) => {
      res.send(JSON.parse(data));
    
  });
});

//------------------------------------------


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

//----------------------------------------------------------------------------
// GET /pets/:id
// Considerations:
// responds with the data of the relevant pet

app.get("/pets/:id",(request,response)=>{
  const id=request.params.id;
  fs.readdir('./data/pets') //
  .then((petFiles)=>{  //with the array of the names of all the files in pets..
    const readPetFiles=petFiles.map((pet)=>{//use map to read each file into readPetFiles
      return fs.readFile(`./data/pets/${pet}`,'utf8');
      
    })  //all files now 'promised' to be read at some point, put into an
        //array and passed to promise all which only returns when all have been fullfilled
    return Promise.all(readPetFiles);// return completed promises to next .then
  }).then((readFiles) => { //readFiles is in JSON format at this point
    const allPets = readFiles.map((petContent) => {
      return JSON.parse(petContent); // Parse all files using map individually
    });                             // because you cant parse the whole array
    // allPets is now an js array of objects..
    foundPet=allPets.filter((pets)=> { 
      console.log(id);

      return (pets.id===`p${id}`|| pets.id===id);
    })
    if(foundPet.length!=0){
    response.status(201).send({pet:foundPet[0]});
    }
    else{
      response.status(404).send("Pet not found")
    }
  })
})

//-------------------------------------------------------------------------------

// This is the first time you will need to process the request body... 
// don't forget to use express.json() to access the request body!
// In the next set of tasks you will have to think 
// about what an appropriate url should be for this endpoint
// Build the following endpoint:
// PATCH
// Considerations:​

// Update an owners name and age
// What does a request need
// What should a response look like

// owner id, owner name, owner age
app.patch('/api/owner/:id', patchOwnerById)
 // client sends endpoint with /owner/:id
 // and a body conaining info that needs patching 
//------------------------------------------------------

app.listen(9090, () => {
  console.log("listening on 9090...");
});

