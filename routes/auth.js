const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();

//SECRET TOKEN
const JWT_SECRET = 'jaiminiswèbdev';

//Post req to create a user : "/api/auth/createuser" without sign up
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
        return res.status(400).json({error: "Wrong Credential"})
      }
      
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);
      
      //create user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });
      const data= {
        user:{
          id:user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET)
      res.json({authToken})
      
    }catch(error){
       console.log(error.message);
       res.status(500).send("Internal Server Error")
    }
})



//POST Req to Login Validation: /api/auth/login 
router.post('/login', [
    body('email', 'Wrong Credential').isEmail(),
    body('password', 'Wrong Credential').exists()
],async (req,res) => {
  //If there are error return bed requests and error
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(
          { 
            errors: errors.array() 
          });
    }
    const {email, password} = req.body;
    try{
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({Error:"Please try to login with correct Credential"})
      }
      let passwordCompare = await bcrypt.compare(password, user.password)
      if(!passwordCompare){     
        return res.status(400).json({Error:"Please try to login with correct Credential"})
      }
      
      const data= {
        user:{
          id:user.id
        }
      }      
      const authToken = jwt.sign(data, JWT_SECRET)
      
      res.json({authToken})
      
    }catch(error){
       console.log(error.message);
       res.status(500).send("Internal Server Error")
    }
  
})


//POST Req to get User data : "api/auth/getuser" login required 
router.post('/getuser',fetchuser, async (req,res) => {
  try{
    let userId = req.user.id;
    //it will return user data not including password
    const user = await User.findById(userId).select('-password')
    res.send(user)
  }catch(error){
       console.log(error.message);
       res.status(500).send("Internal Server Error")
    }
  
})

module.exports = router