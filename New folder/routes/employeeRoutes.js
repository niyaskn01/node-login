const express=require('express')
const router=express.Router()

const employeeController =require('../controllers/employeeController')
const upload=require('../middleware/upload')

router.get('/',employeeController.index)
router.post('/show',employeeController.show)
router.post('/update',employeeController.update)
router.post('/store',upload.single('avatar'),employeeController.store)
router.post('/delete',employeeController.destroy)

module.exports=router