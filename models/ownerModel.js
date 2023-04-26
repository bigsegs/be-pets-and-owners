const fs=require('fs/promises');


exports.updateOwner=(id,name,age)=>{
    console.log("into model")
    const newOwner=
    JSON.stringify({id:id,name:name,age:age},null,2);
    
    return fs.writeFile
    (`${__dirname}/../data/owners/${id}.json`,newOwner)
    .then(()=>{
        return newOwner;
    })
    
    

}