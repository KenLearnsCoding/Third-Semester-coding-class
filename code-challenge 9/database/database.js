// Access the mongodb database


const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;


class Database {
    collections = {
        messages: null
    };
    client = null;
    database = null;
    initialized = false;

    // This database setup logic is extracted out of the main server file
    // This function will make a connection to the database server, get the database, and create/fetch the collections we listed inside the collections variable above
    async setup() {
        // assign mongodb access to client variable 
        this.client = await new mongodb.MongoClient('mongodb+srv://traingheosuoinho:n01404222@database.dpskht9.mongodb.net/?retryWrites=true&w=majority').connect();
        // assign the database to database variable 
        this.database = await this.client.db('database');
        // assign the collections to listCollections variable
        let listedCollections = await this.database.listCollections({}, { nameOnly: true }).toArray();
        // get the names of the collections
        let names = listedCollections.map((collection) => {
            return collection.name;
        });

        // loop through the collections variable and check if the collection exists in the database
        Object.keys(this.collections).forEach(async (key) => {
            if (names.includes(key)) {
                this.collections[key] = await this.database.collection(key);
                console.log(`Collection - ${key} was fetched`);
            } else {
                this.collections[key] = await this.database.createCollection(key);
                console.log(`Collection - ${key} was created`);
            }
        });
        this.initialized = true;
        console.log("Database initialized.");
    }
}
// export to grant permission to other files to use these 2 variables
module.exports = { Database, ObjectId };
