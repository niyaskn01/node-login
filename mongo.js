const {MongoClient}=require('mongodb')
const url='mongodb://127.0.0.1:27017'
const dbName='cart2'
const client=new MongoClient(url)

async function connect(colName){
  const conn=await client.connect()
  db=conn.db(dbName)
  col=db.collection(colName)
  return col
}

module.exports=connect;