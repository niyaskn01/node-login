const mongoose =require('mongoose')
const schema=mongoose.Schema

const empSchema=new schema({
  name:{type:String},
  designation:{type:String},
  email:{type:String},
  phone:{type:String},
  age:{type:Number},
  avatar:{type:String}
},{timestamps:true})

const Employee=mongoose.model('employeeDetails',empSchema)
module.exports =Employee