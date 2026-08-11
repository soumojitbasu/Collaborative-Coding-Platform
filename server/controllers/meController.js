const User=require("../models/User");

const meController=async(req,res)=>{
  const {id}=req.user;
  try{
    const user=await User.findById(id);
    if(!user){
      return res.status(404).json({
        message:"User not found"
      });
    }
     return res.status(200).json({
      message:"User found",
      user:{
        id:user._id,
        email:user.email,
        role:user.role,
      }
    });
  } catch (error) {
    return res.status(500).json({
      message:"Internal Server Error"
    });
  }
};
module.exports={
  meController
};