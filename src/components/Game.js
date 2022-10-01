import styles from "./Game.module.sass";
import GameCard from "./GameCard";

export default function Game(props) {
  const years = [
    ["начала правления", "-27|1"],
    ["рождения", "-63|9"],
    ["смерти", "14|8"],
  ];
  return (
    <div className={styles.game}>
      <GameCard
        descr={"First Roman emperor"}
        title={"Augustus"}
        guessType={"Год начала правления"}
      />
    </div>
  );
}
