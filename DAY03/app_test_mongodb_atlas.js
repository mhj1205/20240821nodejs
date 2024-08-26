const { MongoClient } = require('mongodb');

// MongoDB URI with embedded credentials
const uri = "mongodb+srv://comstudynews:12345@cluster0.vu3uh.mongodb.net/myDatabase";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("testdb");
    const collection = database.collection("testcol");

    // 새 문서 저장
    const doc = { name: "김범준", age: 23 };
    const result = await collection.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);

    // 저장 된 문서 가져 오기
    const query = { _id: result.insertedId };
    const fetch = await collection.findOne(query);
    console.log("Fetched document:", fetch);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);