const mongoose =require("mongoose");
const bcrypt=require("bcryptjs");
const JWT=require("jsonwebtoken");
const cookie=require("cookie");

//models
const userSchema=new mongoose.Schema({
    username: {
    type: String,
    required: [true, "Username is Required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password length should be 6 character long"],
  },
  customerId: {
    type: String,
    default: "",
  },
  subscription: {
    type: String,
    default: "",
  },
});

//hashed passward 
userSchema.pre("save",async function(next){
//update
if(!this.isModified("password")){
    next();
}

const salt=await bcrypt.genSalt(10);
this.password=await bcrypt.hash(this.password,salt);
next();
});

//match password
userSchema.methods.matchPassword = async function(password){
    // Correct order is (plain_text_password, hashed_password_from_db)
    return await bcrypt.compare(password, this.password); 
};

//SIGN TOKEN

userSchema.methods.getSignedToken = function (res) {
  const acccesToken = JWT.sign(
    { id: this._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIREIN }
  );
  const refreshToken = JWT.sign(
    { id: this._id },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: process.env.JWT_REFRESH_EXPIREIN }
  );
  res.cookie("refreshToken", `${refreshToken}`, {
     maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  // FIX 2: Return the access token to be sent in the JSON body
  return acccesToken;
};

const User = mongoose.model("User",userSchema);
module.exports=User;