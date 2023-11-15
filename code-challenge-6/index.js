const { MongoClient } = require('mongodb');
const fs = require('fs');
const uri = "mongodb+srv://catsdb:n01404222@database.npb5sor.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
    // Connect the client to the server	
    // await client.connect();
    // console.log('Connected to MongoDB');
   
    // Select the 'catsdb' database
    const dbName = 'catsdb';
    const db = client.db(dbName);
    
    // Read the JSON files and parse before pushing them to the mongodb collections
    const jsonData_breeds = JSON.parse(fs.readFileSync('./cat_breeds.json'));
    const jsonData_facts = JSON.parse(fs.readFileSync('./cat_facts.json'));
    
    // Access the 'facts' and 'breeds' collections
    const breedsCollection = db.collection("breeds");
    const factsCollection = db.collection("facts");
    
    //I will add 'data' objects to the proper collections first and then add the 'image' objects with random cat URL to the 'breeds' collection

    async function getRandomCatGif() {
        const response = await fetch( "https://thecatapi.com/api/images/get?format=src&type=gif");
        return response.url;
    }
        
    for (const entry in jsonData_breeds.data) {
        
        await getRandomCatGif().then((getLink) => {
            jsonData_breeds.data[entry].image = getLink;
        });
        
    }
    
    // Save 'data' objects from the JSON file into 'facts' collection
    await factsCollection.insertMany(jsonData_facts.data);
    // Save 'data' objects from the JSON file into 'breeds' collection
    await breedsCollection.insertMany(jsonData_breeds.data);
    console.log('Data inserted into MongoDB collections.');

}
run();
