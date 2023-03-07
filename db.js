const mongoose = require('mongoose');
const uri = "mongodb+srv://Jaimin:jaimin@jaimin.qjzvkio.mongodb.net/Notebook?retryWrites=true&w=majority";

const connectDb = () => {
  mongoose.set('strictQuery', true)
  mongoose.connect(uri, (err) => {
    if (err) {
      console.log(err)
    }else{
      console.log("Connected Successfully to Database")
    }
  })
}

module.exports = connectDb;