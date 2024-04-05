const mongoose = require("mongoose");

const connectDatabase =()=>{
   // console.log(process.env.MONGO_URL);
    mongoose.connect(process.env.MONGO_URL).then((data)=>{
console.log(`mongodb connected with server: ${data.connection.host}`);
}).catch((err)=>{
    console.log(err);
})
}

module.exports=connectDatabase