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

module.exports = router