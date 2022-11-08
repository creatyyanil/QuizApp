require('./models/User');
require('./models/Quiz');
require('./models/Question');
require('./models/Attempt');
require('./models/UserAnswer');

const express = require('express');
const authRoutes= require('./routes/authRoutes');
const quizRoutes= require('./routes/quizRoutes');
const mongoose= require("mongoose");
const bodyParser = require('body-parser');
const verifyAuth= require('./middlewares/verifyAuth');

mongoose.connect("mongodb://localhost:27017/TaskApp",{useNewUrlParser:true,useUnifiedTopology:true}).then((data)=>{
    // console.log(`mongodb connected with server${data.connection.host}`);
}).catch((err)=>{
    console.log(err);
})
const app= express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(authRoutes);
app.use(quizRoutes);

app.get('/',verifyAuth,(req,res)=>{
    
    res.send('Hii There');
});

app.listen(3000,()=>{

    console.log("listning on port 3000");
});

