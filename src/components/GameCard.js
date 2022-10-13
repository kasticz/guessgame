
import { useRef } from "react";
import {useRouter} from 'next/router'
import styles from "./GameCard.module.sass";

export default function GameCard(props) {
  const router = useRouter()
  const item = props.item;
  const cardRef = useRef()
  function toWiki(){
    router.push(``)

  }



  return (
    
    <div onClick={toWiki} ref={cardRef} data-moving='false' data-moved='false' data-placedcard data-index={props.i + 1} className={`${styles.card} ${styles.playedCard}`}>
      <a target='_blank' href={`https://en.wikipedia.org/wiki/${item.title}`}>
      <span className={styles.cardTitle}>{item.title.split("_").join(" ")}</span>
      <span className={styles.cardDescr}>{item.descr}</span>
      <div  data-index={props.i}
        style={{
          backgroundImage: `url(${item.image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "50% 10%",
        }}
        className={styles.imageWrapper}
      ></div>
      <span className={`${styles.guessType} ${item.guessResult ? styles.correct : styles.wrong}`}>{`Год ${item.choosedGuess[0]} ${item.answer[0]}`}</span>
      </a>
    </div>
    
  );
}
