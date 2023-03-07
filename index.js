const connectDb = require('./db');
const express = require('express');
connectDb()
const app = express();

app.use(express.json())

//Available routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(5000, () => {
  console.log("Server started")
})