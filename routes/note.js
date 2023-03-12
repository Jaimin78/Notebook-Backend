const express = require('express');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();


//ROUTE 1: GET Req to fetch notes : "api/note/fetchnote" login required
router.get('/fetchnote', fetchuser, async (req,res) => {
   try {
     const notes = await Note.find({ user : req.user.id });
     res.json(notes)
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
   }
})


//ROUTE 2: POST Req to save notes : "api/note/addnote" login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter valid title').isLength({ min: 1 }),
    body('description', 'Please enter valid description').isLength({ min: 3 })
], async (req,res) => {
   const { title, description, tag } = req.body;
   try {
    //If there are error in input return bed requests and a error
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json(
            { 
              errors: errors.array() 
            });
      }
     
     const notes = new Note({
       title, description, tag, user:req.user.id
     });
     const saveNote = await notes.save();
     res.json(saveNote)
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
   }
})


//ROUTE 3: PUT Req to update notes : "api/note/updatenote" login required
router.put('/updatenote/:id', fetchuser, async (req,res) => {
   try {
     const { title, description, tag } = req.body;

     //Create a new note
     const newNote = {};
     if(title){ newNote.title = title }
     if(description){ newNote.description = description }
     if(tag){ newNote.tag = tag }
     
     //Find note to be updated 
     let note = await Note.findById(req.params.id);
     if(!note){ return res.status(404).send("Not found"); }

     //Matching existing user id with logged In user id
     if(note.user.toString() !== req.user.id){
       return res.status(404).send("Not allowed");
     }

     note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
     res.json({note});
     
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
   }
})


module.exports = router