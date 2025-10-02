const mongoose =require("mongoose");
const colors=require("colors");


//make connection with  mongoDb Database
const connectDB = async()=>{
    try {
        
       await mongoose.connect(process.env.MONGO_URI);
       console.log(
        `Connected to mongoDb Database ${mongoose.connection.host}`.bgGreen.white
        
       )
    } catch (error) {
        console.log(`MongoDb Database Error ${error}`.bgRed.white);
    }
}

//expprt the  module 
module.exports=connectDB;