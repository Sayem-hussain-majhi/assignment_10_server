const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000 ;


// middle ware
app.use(cors());
app.use(express.json())




// mongodb
// carStore
// YMo2j4Gf0Xo428HJ
const uri = "mongodb+srv://carStore:YMo2j4Gf0Xo428HJ@cluster0.khszj4g.mongodb.net/?retryWrites=true&w=majority";

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
    // collections
    const brandCollection = client.db('carStore').collection('brands'); 
    const brandItemCollection = client.db('carStore').collection('BrandItems'); 
    const addToCartItemCollection = client.db('carStore').collection('addToCartItems'); 

    // get all brands
    app.get('/brands', async(req, res) => {
        const result = await brandCollection.find().toArray();
        res.send(result)
    })
    // get all brand items
    app.get('/brandItems', async(req, res) => {
        const result = await brandItemCollection.find().toArray();
        res.send(result)
    }) 

    // get specific info from server
    app.get('/brandItems/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await brandItemCollection.findOne(query)
      res.send(result)
    })


    app.post('/brandItems', async (req, res) =>{
      const carInfo = req.body
      const result = await brandItemCollection.insertOne(carInfo);
      res.send(result)
    })

    // Update add to cart item
    app.put('/brandItems/:id', async (req, res) =>{
      const id = req.params.id;
      const newInfo = req.body;
      const filter = {_id: new ObjectId(id)}
      const option = {upsert: true}
      const updateInfo = {
        $set:{
          brandName: newInfo.brand,
          carName: newInfo.carName,
          carImage: newInfo.carImage,
          carDetails: newInfo.carDetails,
          price: newInfo.price,
        }
      }
      const result = await addToCartItemCollection.updateOne(filter, updateInfo, option );
      res.send(result) 
    })

    // insert add to cart items
    app.post('/addToCartItems', async(req, res) =>{
      const carInfo = req.body;
      console.log(carInfo)
      const result = await addToCartItemCollection.insertOne(carInfo);
      res.send(result)
    })


    // get addToCartItems
    app.get('/addToCartItems', async (req, res) =>{
      const result = await addToCartItemCollection.find().toArray();
      res.send(result)
    })

    
    // DELETE add to cart item
    app.delete('/addToCartItems/:id', async (req, res) =>{
      const id = req.params.id;
      const cursor = {_id: new ObjectId(id)}
      const result = await addToCartItemCollection.deleteOne(cursor)
      res.send(result) 
    })

    


    app.post('/brands', async (req, res) =>{
      const carInfo = req.body
      // console.log(carInfo.brand)
      const brandName = {brandName:  (carInfo.brand)}
      if(brandName){
        
      }
      console.log(brandName)

      // const result = await brandItemCollection.insertOne(carInfo);
      // res.send(result)
    })













    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);


























app.get('/', (req, res)=>{
    res.send('server is running')
})

app.listen(port,()=>{
    console.log(`the server is running port: ${port}`)
})


