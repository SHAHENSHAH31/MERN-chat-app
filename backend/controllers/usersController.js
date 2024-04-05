const User= require("../model/userModel")
const sendToken = require('../utils/jwtToken.js');

exports.register= async(req,res,next)=>{
   try{
     const {username,email,password}=req.body;
     const usernameCheck= await User.findOne({name:username});
     console.log(username);
     console.log(usernameCheck);

     if(usernameCheck){
      return json({ 
         success: false, message: "Username already exists" 
      });
     }
     const emailCheck= await User.findOne({email});
      if(emailCheck){
        return res.json({
            success:false,
            message:"Email already used"
        })
     }

     const user= await User.create({
        email,
        name:username,
        password
     })
     sendToken(user,200,res);
   }
   catch(error){
     res.status(500).json({
        success:false,
        message: error
    })
   }
}


exports.login = async (req, res) => {
   try {
     console.log("hi",req.body);
     const { username, password } = req.body;
 
     const user = await User.findOne({ name:username })
       .select("+password")
 
     if (!user) {
       return res.status(400).json({
         success: false,
         message: "User does not exist",
       });
     }
 
     const isMatch = await user.matchPassword(password);
     console.log("hello",isMatch);
 
     if (!isMatch) {
       return res.status(400).json({
         success: false,
         message: "Incorrect password",
       });
     }

     console.log("how");
 
     const token = await user.getJWTToken();
 
     const options = {
       expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
       httpOnly: true,
     };
 
     res.status(200).cookie("token", token, options).json({
       success: true,
       message:"Login successfully",
       user,
       token,
     });
   } catch (error) {
     res.status(500).json({
       success: false,
       message: error.message,
     });
   }
 };



 exports.setAvatar = async (req, res) => {
  try {
    const user=await User.findByIdAndUpdate(req.params.id,{
      avatarImageSet:true,
      avatarImage:req.body.image
    })
    console.log(user);
    return res.json({
       success:true,
       isSet:true,
       user
      })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users= await User.find({_id:{$ne:req.params.id}}).select(["email","name","avatarImage","_id"]);
    return res.json(users);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};