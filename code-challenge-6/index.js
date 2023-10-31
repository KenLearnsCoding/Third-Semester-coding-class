
const { MongoClient, ServerApiVersion } = require('mongodb');
const axios = require('axios');
const fs = require('fs');
const uri = "mongodb+srv://catsdb:n01404222@catsdb.sunyqht.mongodb.net/?retryWrites=true&w=majority";
const dbName = 'catsdb';

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
    console.log('Connected to MongoDB');

    // Select the 'catsdb' database
    const db = client.db(dbName);

    // Read the JSON files and parse push them to the mongodb collections
    const jsonData_breeds = JSON.parse(fs.readFileSync('code-challenge-6/cat_breeds.json', 'utf8'));
    const jsonData_facts = JSON.parse(fs.readFileSync('code-challenge-6/cat_facts.json', 'utf8'));
    
    // Create or access the 'facts' and 'breeds' collections
    const factsCollection = db.collection('facts');
    const breedsCollection = db.collection('breeds');

    // Save 'data' objects from the JSON file into 'facts' collection
    await factsCollection.insertMany(jsonData_facts.data);
    await breedsCollection.insertMany(jsonData_breeds.breeds);
    console.log('Data inserted into MongoDB collections.');

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
