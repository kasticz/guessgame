import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const typeToFind = req.body.type;
  const playedItems = req.body.items || [];

  const client = await MongoClient.connect(
    `mongodb+srv://kastic:8R8HDozRYn7ociS6@cluster0.wtiqv.mongodb.net/?retryWrites=true&w=majority`
  );
  const db = client.db();




  const allOfTypes = await db
    .collection("guessGame")
    .find({ title: { $nin: playedItems }, type: typeToFind })
    .toArray();
  client.close();

  const l = allOfTypes.length;
  let random = allOfTypes[Math.floor(Math.random() * l)];

  let ifAlreadyInPlay = playedItems.find((item) => item === random.title);

  while (ifAlreadyInPlay) {
    random = allOfTypes[Math.floor(Math.random() * l)];
    ifAlreadyInPlay = playedItems.find((item) => item === random.title);
  }
  console.log(l)

  res.status(200).json({ card: random, clearCookies : l  < 4});
}
