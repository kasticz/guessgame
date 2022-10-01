import { Fragment, useEffect, useState } from "react";
import styles from "./GameCard.module.sass";

export default function GameCard(props) {
  const [img, setImg] = useState();
  const [item, setItem] = useState();

  useEffect(() => {
    async function getCard() {
      const resp = await fetch("./api/getCard", {
        method: "POST",
        body: JSON.stringify({
          type: "human",
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await resp.json();

      const randomGuess = data.card
        ? data.card.years[Math.floor(Math.random() * data.card.years.length)]
        : null;
      data.card.choosedGuess = randomGuess;

      async function getImg() {
        const resp = await fetch("./api/getImage", {
          method: "POST",
          body: JSON.stringify({
            imgTitle: data.card.title,
          }),
          headers: {
            "Content-type": "application/json",
          },
        });
        const image = await resp.json();
        data.card.image = image.imgSource;
      }
      if (data.card) await getImg();



      setItem(data.card);


    }
    if (!item) getCard();
  }, []);

  useEffect(() => {}, [item]);

  console.log(item);

  return (
    <Fragment>
      {item?.image ? (
        <div className={styles.card}>
          <span className={styles.cardTitle}>
            {item.title.split("_").join(" ")}
          </span>
          <span className={styles.cardDescr}>{item.descr}</span>
          <div
            style={{
              backgroundImage: `url(${item.image})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "50% 10%",
            }}
            className={styles.imageWrapper}
          ></div>
          <span
            className={styles.guessType}
          >{`Год ${item.choosedGuess[0]}`}</span>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </Fragment>
  );
}
