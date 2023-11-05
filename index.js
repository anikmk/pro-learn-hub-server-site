const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());
// mongodb connected source code



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@anik.34iapyi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coursesCollection = client.db("proLabHub").collection("courses");
    const addJobCollection = client.db("proLabHub").collection("addJobs")
    // all courcess categorys
    app.get('/courses/:category',async(req,res)=>{
      const category = req.params.category;
      console.log(category)
      const result = await coursesCollection.find({category}).toArray();
      res.send(result)
    })

    // all add job 
    app.get('/addjobs',async(req,res)=>{
      console.log(req.query.email)
      let query = {}
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await addJobCollection.find(query).toArray();
      res.send(result)
    })
    app.post('/addjobs',async(req,res)=>{
      const jobs = req.body;
      console.log(jobs)
      const result = await addJobCollection.insertOne(jobs);
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// default get and listen
app.get('/',(req,res)=>{
    res.send('Pro Lab Hub server site Running:')
})

app.listen(port,()=>{
    console.log(`server site running on port: ${port}`)
})