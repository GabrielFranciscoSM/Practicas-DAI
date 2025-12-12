//const { MongoClient } = require("mongodb");
import { MongoClient } from "mongodb";

// Replace the uri string with your connection string
const uri = "mongodb://root:example@localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('dai');
    const test = database.collection('test');

    // Queries for a movie that has a title value of 'Back to the Future'
    var data = await test.find({});
    console.log(await data.toArray())

    // for await (const doc of data) {
    //     console.log(doc);
    // }


  } finally {
    await client.close();
  }
}
run().catch(console.dir);