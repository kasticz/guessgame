import {MongoClient} from 'mongodb'

export default async function handler(req, res) {
    const typeToFind = req.body.type

    const client = await MongoClient.connect(
        `mongodb+srv://kastic:8R8HDozRYn7ociS6@cluster0.wtiqv.mongodb.net/?retryWrites=true&w=majority`
      );
    const db = client.db();
    

    const allOfTypes =  await db.collection('guessGame').find({}).toArray()

    const l = allOfTypes.length
    const random =  allOfTypes[Math.floor(Math.random() * l)]



    

    



    res.status(200).json({ card: random })
  }
  