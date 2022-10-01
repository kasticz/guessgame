

export default async function handler(req, res) {
    const imgTitle = req.body.imgTitle
    
    const resp = await fetch(
       `http://en.wikipedia.org/w/api.php?action=query&titles=${imgTitle}&prop=pageimages&format=json&pithumbsize=300`,
        {
          method: "GET",
          headers: {
            Origin: "en.wikipedia.org ",
          },
        }
      );
      const data = await resp.json();
      

      const imgPre = data.query.pages;
      const imgSource = imgPre[Object.keys(imgPre)[0]].thumbnail.source;

     





    res.status(200).json({ imgSource})
  }
  