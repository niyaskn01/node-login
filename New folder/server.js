const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const morgan=require('morgan')

const employeeRouter=require('./routes/employeeRoutes')

mongoose.connect('mongodb://127.0.0.1:27017/employee', { useNewUrlParser: true, useUnifiedTopology: true })
const db=mongoose.connection

db.on('error',(err)=>{
  console.log(err)
})

db.once('open',()=>{
  console.log('Database connection established')
})

const app=express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use('/images',express.static('images'))

app.listen(3000,()=>{
  console.log('port 3000 is running')
})

app.use('/api/employee',employeeRouter)
