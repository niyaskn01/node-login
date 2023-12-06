const { response } = require('express')
const Employee=require('../models/employeeModel')

// show all employees
const index=(req,res,next)=>{
  Employee.find()
  .then(response =>{
    res.json({
      response
    })
  }).catch(error =>{
    req.json({
      message:'an error occured'
    })
  })
}

//list a single employee

const show=(req,res,next)=>{
  let empId=req.body.employeeID
  Employee.findById(empId)
  .then(responce=>{
    res.json({responce})
  }).catch(error=>{ 
    res.json({message:'error occured'})
  })
}


//insert an employee details

const store=(req,res,next)=>{
  let employee=new Employee({
    name:req.body.name,
    designation:req.body.designation,
    email:req.body.email,
    phone:req.body.phone,
    age:req.body.age,
  })

  if (req.file) {
    employee.avatar = req.file.path;
  }
  employee.save()
  .then(response=>{
    res.json({message:'added succesfully'})
  }).catch(error=>{
    res.json({message:'an error occured'})
  })
}


//update an employee

const update=(req,res,next)=>{
  let employeeID=req.body.employeeID

  let updateData={
    name:req.body.name,
    designation:req.body.designation,
    email:req.body.email,
    phone:req.body.phone,
    age:req.body.age
  }
  Employee.findByIdAndUpdate(employeeID,{$set:updateData})
  .then(()=>{
    res.json({message:'updated succesfully'})
  }).catch(error=>{
    res.json('error occured')
  })
}

//delete an employee

const destroy=(req,res,next)=>{
  let employeeID=req.body.employeeID
  Employee.findOneAndRemove(employeeID)
  .then(()=>{
    res.json({message:'deleted successfully'})
  }).catch(error=>{
    res.json({message:'error occured'})
  })
}

module.exports={
  index,show,update,store,destroy
}
