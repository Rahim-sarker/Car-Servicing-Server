const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT ||5000
const cors = require('cors')

app.use(cors())
app.use(express.json())
require('dotenv').config()

app.get('/', (req, res) => {
  res.send('Hello Rahim Sarker your Server is running')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dnwxwtz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//     console.log("Database Connected")
//   client.close();
// });



async function run() {
  try {
    await client.connect();
    
    const serviceCollection = client.db("geniuscar").collection("services");

    app.get('/service', async(req,res)=>{
       const query = {}
       const cursor = serviceCollection.find(query);
       const result = await cursor.toArray();
       res.send(result);
    })

    app.get('/service/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const service =  await serviceCollection.findOne(query);
      res.send(service);
    })


    //POST API
    app.post('/service', async(req,res)=>{
       const newService = req.body;
       const result = await serviceCollection.insertOne(newService);
       res.send(result);
    })

    //Delete api
    app.delete('/service/:id', async(req,res)=>{
       const id = req.params.id;
       const query = {_id: ObjectId(id)}
       const result = await serviceCollection.deleteOne(query);
       res.send(result);
    })

    
  } finally {
   
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})