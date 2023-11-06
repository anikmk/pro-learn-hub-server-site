const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const addJobCollection = client.db("proLabHub").collection("addJobs");
    const bidFormCollection = client.db("proLabHub").collection("bidFormData");
    // all courcess categorys
    app.get('/courses/:category',async(req,res)=>{
      const category = req.params.category;
      console.log(category)
      const result = await coursesCollection.find({category}).toArray();
      res.send(result)
    })


    app.get('/course/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const result = await coursesCollection.findOne(query);
     
      res.send(result)
    })

    // bid form collection
    app.get('/bidform',async(req,res,)=>{
      console.log(req.query.buyerEmail)
      let query = {};
      if(req.query?.buyerEmail){
        query = {buyerEmail:req.query.buyerEmail}
      }
      const result = await bidFormCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/bidform',async(req,res)=>{
      const  userBidData = req.body;
      const result = await bidFormCollection.insertOne(userBidData);
      res.send(result)
    })
    // all add job 
    app.get('/addjobs',async(req,res)=>{
      let query = {}
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await addJobCollection.find(query).toArray();
      res.send(result)
    })
    app.post('/addjobs',async(req,res)=>{
      const jobs = req.body;
      const result = await addJobCollection.insertOne(jobs);
      res.send(result)
    })

    app.patch('/addjobs/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updatedJob = req.body;
      console.log(updatedJob)
      const updateDoc = {
        $set: {
          status: updatedJob.status
        }
      };
      const result = await addJobCollection.updateOne(filter,updateDoc);
      res.send(result)

    })
    app.delete('/addjobs/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const result = await addJobCollection.deleteOne(query);
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