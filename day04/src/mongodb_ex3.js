const { MongoClient } = require("mongodb");

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);
const dbName = "vehicle";
const collectionName = "car";

async function run() {
  try {
    
    // Get the database and collection on which to run the operation
    const database = client.db(dbName);
    const cars = database.collection(collectionName);

    // Query for movies that have a runtime less than 15 minutes
    const query = {};

    const options = {
      // Sort returned documents in ascending order by title (A->Z)
      sort: { name: 1 },
      // Include only the `title` and `imdb` fields in each returned document
      //projection: { _id: 0, name: 1, company: 1 },
    };

    // Execute query 
    const cursor = cars.find(query, options);

    // Print a message if no documents were found
    if ((await cars.countDocuments(query)) === 0) {
      console.log("No documents found!");
    }

    // Print returned documents
    for await (const doc of cursor) {
      console.dir(doc);
    }

  } finally {
    await client.close();
  }
}

run().catch(console.dir);