const multer=require('multer')
const path=require('path')

const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./images')
  },
  filename:function(req,file,cb){
    let ext=path.extname(file.originalname)
    cb(null,Date.now()+ext)
  }
})

const upload=multer({
  storage:storage,
  fileFilter:function(req,file,cb){
    if(file.mimetype === 'image/png' ||
       file.mimetype === 'image/jpeg'  
    ){
      cb(null,true)
    }else{
      console.log('only jpg or png')
      cb(null,false)
    }
  },
  limits:{
    fileSize:1024 * 1024 *100
  }
})

module.exports=upload