const mongoose=require('mongoose')
const schema=mongoose.Schema

const userSchema=new schema({
  name:{
    type:String
  },
  email:{
    type:String
  },
  phone:{
    type:String
  },
  password:{
    type:String
  }
},{timestamps:true})

const User = mongoose.model('userDet',userSchema)

module.exports= User;