const mongoose= require("mongoose");

const connectDatabase= ()=>{
    mongoose.connect("mongo://localhost:27017/TaskApp",{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true}).then((data)=>{
        console.log(`mongodb connected with server${data.connection.host}`);
    }).catch((err)=>{
        console,log(err);
    })
}

module.exports= connectDatabase;