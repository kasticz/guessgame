import {MongoClient} from 'mongodb'

export default async function handler(req, res) {
    const cards = req.body.cards

    const client = await MongoClient.connect(
        `mongodb+srv://kastic:8R8HDozRYn7ociS6@cluster0.wtiqv.mongodb.net/?retryWrites=true&w=majority`
      );
    const db = client.db();

    for(let card of cards){
        await db.collection('guessGame').insertOne(card)
    }
    client.close()

    

    



    res.status(200).json({ name: 1 })
  }
  