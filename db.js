import { MongoClient } from 'mongodb';

async function main() {
    //const MongoClient = require('mongodb').MongoClient;
    const uri =
      'mongodb+srv://shaunfoster:!=Silvia1212@cowhelper.ddke6jt.mongodb.net/?retryWrites=true&w=majority&appName=CoWHelper'
    const client = new MongoClient(uri);

  // Connect to the client and query
  await client.connect();
  findListings(client, 5);
  client.close();
  }
  main().catch(console.error);

  async function findListings(client, resultsLimit) {
    const cursor = client
      .db('sample_mflix')
      .collection('comments')
      .find()
      .limit(resultsLimit);
  
    const results = await cursor.toArray();
    if (results.length > 0) {
      console.log(`Found ${results.length} listing(s):`);
      results.forEach((result, i) => {
        date = new Date(result.last_review).toDateString();
  
        console.log();
        console.log(`${i + 1}. name: ${result.name}`);
        console.log(`   _id: ${result._id}`);
        console.log(`   bedrooms: ${result.bedrooms}`);
        console.log(`   bathrooms: ${result.bathrooms}`);
        console.log(
          `   most recent review date: ${new Date(
            result.last_review
          ).toDateString()}`
        );
      });
    }
  }

const connectionString = 'mongodb+srv://shaunfoster:<password>@cowhelper.ddke6jt.mongodb.net/?retryWrites=true&w=majority&appName=CoWHelper'