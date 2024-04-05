const express = require("express");
const cors = require("cors");
const connectDatabase=require('./config/database');
const userRoutes=require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");



const app= express();
const socket=require("socket.io");

require("dotenv").config();

app.use(cors());
app.use(express.json());
connectDatabase();
//app.use(express.urlencoded());
// router conection
app.use("/api/auth",userRoutes)
app.use("/api/messages", messageRoutes);

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is runing on Port ${process.env.PORT}`)
})


const io=socket(server,{
    cors:{
        origin:"http://localhost:3000",
        Credentials:true
    }
})

global.onlineUsers=new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      console.log(data);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });