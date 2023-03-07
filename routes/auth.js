const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();

//Post req to create a user : /api/auth/createuser without sign up
router.post('/createuser', [
    //Validating Data with custom error msg
    body('name', 'Enter valid Name').isLength({ min: 3 }),
    body('password', 'Enter valid password').isLength({ min: 5 }),
    body('email', 'Enter valid Email').isEmail()
], async (req, res) => {
    //If there are error return bed requests and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(
          { 
            errors: errors.array() 
          });
    }
    try{
      let user = await User.findOne({email: req.body.email})
      if(user){
        return res.status(400).json({error: "A user with this email already exists"})
      }
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      })
      res.json(user)
    }catch(error){
       console.log(error.message);
       res.status(500).send("Some error occurred")
    }
})

module.exports = router