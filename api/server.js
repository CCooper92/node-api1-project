// BUILD YOUR SERVER HERE
const express = require('express')
const User = require("./users/model.js")
const server = express()

server.use(express.json())



//GET
server.get("/api/users", (req,res) => {
    User.find()
    .then(users => {
        console.log(users)
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({message: err.message})
    })
})

//GET BY ID
server.get("/api/users/:id", (req,res) => {
    const idVar = req.params.id
    User.findById(idVar)
        .then(user => {
            if(!user){
                res.status(404).json("user not found")
            }else{
                res.status(200).json(user)
            }
        })
        .catch(err => {
            res.status(500).json({message: err.message})
        })
})

//POST
server.post("/api/users", (req,res) => {
    const newUser = req.body
    if(!newUser.name || !newUser.bio){
        res.status(422).json("Name and Bio required")
    }else{
        User.insert(newUser)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            res.status(500).json({message: err.message})
        })
    }
})

//PUT
server.put("/api/users/:id", async (req,res)=>{
    const {id} = req.params
    const changes = req.body

    try{
        if(!changes.name || !changes.bio){
            res.status(422).json("Name and Bio required")
        }else{
            const updatedUser = await User.update(id,changes)
            if(!updatedUser){
                res.status(422).json("User doesn't exist")
            }else{
                res.status(201).json(updatedUser)
            }            
        }       
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

//DELETE
server.delete("/api/users/:id", async (req,res)=>{
    try{
        const {id} = req.params
        const deletedUser = await User.remove(id)
        if(!deletedUser){
            res.status(422).json("User doesn't exist")
        }else{
            res.status(201).json(deletedUser)
        }        
    }catch(err){
        res.status(500).json({message: err.message})
    }
})
//GET ENDPOINT
server.use("*",(req,res) => {
    res.status(404).json({message: "users over here"})
})
module.exports = server
