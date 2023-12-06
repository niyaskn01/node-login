const express=require('express')
const app=express()
const path=require('path')
const mongo=require('./mongo')
const session = require('express-session')
const cookieParser = require('cookie-parser')

app.set('view engine','ejs')
app.use((req,res,next)=>{
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
})
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}))
app.use(session({
  secret:'123123',
  resave:false,
  saveUninitialized:true
}))
app.use(cookieParser())

app.listen(3002,()=>console.log('server running'))

app.get('/' ,(req,res)=>{
 if(req.session.isLogged){
  return res.redirect('/checkagain')
 }
 else{
  res.render('login',{err:null})
 }
})
app.post('/login',async(req,res)=>{
  const {name,pass}=req.body
  try{
    const data=await mongo('userDetails')
    const validUser=await data.findOne(
      {
        username:name,userpassword:pass
      }
    )
    if(validUser){
      req.session.user=validUser
      req.session.isLogged=true
      res.redirect('/checkagain')
    }
    else{
      const error='invalid username or password'
      res.render('login',{err:error})
    }
  }catch(error){
    console.log(error)
    res.status(500).send('internal server error')
  }
})

app.get('/checkagain',middleware,(req,res)=>{
  if(req.session.user){
    res.render('home')
  }
  else{
    res.redirect('/')
  }
})

function middleware(req,res,next){
  if(req.session.user){
    return next()
  }
  else{
    res.redirect('/')
  }
}

app.post('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

app.get('/signup',(req,res)=>{
  if(req.session.signed){
    res.redirect('/signup')
  }
  else{
    res.render('signupPage',{err:null})
  }
})
app.post('/signup',async(req,res)=>{
  const {uname,email,pass1}=req.body
  try{
    const data=await mongo('userDetails')
    const userName=await data.findOne(
      {username:uname,userpassword:pass1}
      
    )
    if(userName){
      const err='user name is taken'
      res.render('signupPage',{err})
    }
    const userPassword=await data.findOne(
      {userpassword:pass1}
    )
    if(userPassword){
      const err='password is taken'
      res.render('signupPage',{err})
    }
    else{
      await data.insertOne(
        {username:uname,useremail:email,userpassword:pass1}
        )
        req.session.signed = true
        res.render('login',{err:null})
    }
  }
  catch(error){

    console.log('server down',error)
    res.status(500).send('internal server error')
  }
})