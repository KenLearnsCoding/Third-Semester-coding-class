
const { MongoClient } = require('mongodb');
const fs = require('fs');
const uri = "mongodb+srv://catsdb:n01404222@catsdb.sunyqht.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
    // Connect the client to the server	
    await client.connect();
    console.log('Connected to MongoDB');
   
    // Select the 'catsdb' database
    const dbName = "catsdb";
    const db = client.db(dbName);
    
    // Read the JSON files and parse before pushing them to the mongodb collections
    const jsonData_breeds = JSON.parse(fs.readFileSync('code-challenge-6/cat_breeds.json', 'utf8'));
    const jsonData_facts = JSON.parse(fs.readFileSync('code-challenge-6/cat_facts.json', 'utf8'));
    
    // Access the 'facts' and 'breeds' collections
    const breedsCollection = db.collection("breeds");
    const factsCollection = db.collection("facts");
    
    //I will add 'data' objects to the proper collections first and then add the 'image' objects with random cat URL to the 'breeds' collection

    // Save 'data' objects from the JSON file into 'facts' collection
    await factsCollection.insertMany(jsonData_facts.data);
    // Save 'data' objects from the JSON file into 'breeds' collection
    await breedsCollection.insertMany(jsonData_breeds.data);
    console.log('Data inserted into MongoDB collections.');


    // Create random 'image' URLs for 'breeds' and save them. In the breeds collection, objects are represented
    // in 1 level of the data structure, so I will use the map function to iterate through the array of objects.
    // This is also really cool when i found this algorithm (line 36-39) from internet. 
    const breedData = jsonData_breeds.breeds.map(breed => ({
        name: 'image',
        data: 'https://thecatapi.com/api/images/get?format=src&type=gif',
    }));
    //insert the 'image' objects into the 'breeds' collection
    await breedsCollection.insertMany(breedData);
  
    //close the server
     client.close();
}
run()
