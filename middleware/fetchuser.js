
const jwt = require('jsonwebtoken');

//SECRET TOKEN
const JWT_SECRET = 'jaiminiswèbdev';

const fetchuser = (req,res,next) => {
    //Get the user from jwt token and add id to req object
    const token = req.header('auth-token');
    if(!token){
      res.status(401).send({error: "please authenticate using valid token"});
    }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user
    //After middleware execute this line will run /getuser callback function
    next();
  } catch (error) {
    res.status(401).send({error: "please authenticate using valid token"});
  }
}

module.exports = fetchuser;