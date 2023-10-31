const { MongoClient } = require('mongodb');
const axios = require('axios');
const fs = require('fs');

// Define the MongoDB connection string and database name
const uri = 'mongodb://localhost:27017';
const dbName = 'catsdb';

// Create a MongoClient instance
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB');

    // Select the 'catsdb' database
    const db = client.db(dbName);

    // Read the JSON file and parse it
    const jsonData = JSON.parse(fs.readFileSync('your_input_file.json', 'utf8'));

    // Create or access the 'facts' and 'breeds' collections
    const factsCollection = db.collection('facts');
    const breedsCollection = db.collection('breeds');

    // Save 'data' objects from the JSON file into 'facts' collection
    await factsCollection.insertMany(jsonData.data);

    // Create random 'image' URLs for 'breeds' and save them
    const breedData = jsonData.breeds.map(breed => ({
      name: 'image',
      data: 'https://thecatapi.com/api/images/get?format=src&type=gif',
    }));

    await breedsCollection.insertMany(breedData);

    console.log('Data inserted into MongoDB collections.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the MongoDB client
    client.close();
    console.log('MongoDB connection closed.');
  }
}

main();
