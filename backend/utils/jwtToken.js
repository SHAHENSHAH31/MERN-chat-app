// create token and save in cookie

const sendToken=(user,statusCode,res)=>{
    const token=user.getJWTToken();
    // options for cookie
    var expiryDate = new Date(Number(new Date()) + 5*24*60*60*1000); 
    const options ={
       expires:expiryDate,
       httpOnly:true,
    };
    res.status(statusCode).cookie("token",token,options).json({
       success:true,
       user,
       token,
    });
   };
   
   module.exports=sendToken;