 const mongoose = require("mongoose");
 const jwt= require("jsonwebtoken");
 const bcrypt=require("bcrypt");

 const userSchema= new mongoose.Schema({
    name:{
        type:String,
        require:[true,"Please Enter Your Name"],
        maxLength:[30,"Name cannot exceed 30 characters"],
        minLength:[4,"Name should have 4 characters"]
    },
    email:{
        type:String,
        require:[true,"Please Enter Your Email"],
        unique:true,
    },
    password:{
        type:String,
        require:[true,"Please Enter Your Password"],
        select:false
    },
    avatarImageSet:{
        type:Boolean,
        default:false,
    },
    avatarImage:{
        type:String,
        default:false,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },

   

    
 });


 userSchema.pre("save", async function(next){
    this.password= await bcrypt.hash(this.password,10);
 })

 userSchema.methods.getJWTToken= async function(){
    console.log(process.env.JWT_SECRET)
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
      expiresIn:'5d',
    })
  }

  userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

 module.exports= mongoose.model("User",userSchema);