
import styles from "./GameCard.module.sass";

export default function GameCard(props) {
  const item = props.item;
  return (
    <div data-placedcard data-index={props.i} className={`${styles.card} ${styles.playedCard}`}>
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
      <span className={styles.guessType}>{item.answer[0]}</span>
    </div>
  );
}
