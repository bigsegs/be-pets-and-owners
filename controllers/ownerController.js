const models=require('../models/ownerModel.js')
const updateOwner=models.updateOwner;

exports.patchOwnerById=(request,response)=>{
    console.log("intocontroller");
    const id=`o${request.params.id}`;
    const name=request.body.name;
    const age=request.body.age;
    updateOwner(id,name,age).then((updatedOwner)=>{
        console.log(updatedOwner)
        response.status(201).send(updatedOwner)
    })
    

}