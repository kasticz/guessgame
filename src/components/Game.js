import styles from "./Game.module.sass";
import NewGameCard from "./NewGameCard";
import TimeLine from "./TimeLine";
import { useState, useEffect } from "react";
import { getCard } from "../store/interfaceLogic";
import { useDispatch, useSelector } from "react-redux";
import { timelineActions } from "../store/store";
import { useCookies } from "react-cookie";
import heart from "../images/heart.svg";
import brokenHeart from "../images/brokenHeart.svg";

export default function Game(props) {
  const itemPlaced = useSelector((state) => state.timeline.itemPlaced);
  const [item, setItem] = useState();
  const [nextItem, setNextItem] = useState();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.timeline.cards);
  const lives = useSelector((state) => state.timeline.lives);
  const [cookies, setCookies] = useCookies(["playedCards"]);
  const [bestResult, setBestResult, removeBestResult] = useCookies([
    "bestResult",
  ]);

  useEffect(() => {
    async function getNewCard() {
      dispatch(timelineActions.setItemPlaced());
      if (nextItem) setItem(nextItem);

      getCard(
        props.choosenType,
        setNextItem,
        cookies.playedCards,
        false,
        setCookies
      );
    }
    if (itemPlaced) {
      getNewCard();
    }
  }, [itemPlaced]);

  useEffect(() => {
    async function placeInitialCard() {
      const item = await getCard(
        props.choosenType,
        null,
        cookies.playedCards,
        true,
        setCookies
      );
      const month = item.choosedGuess[1].slice(item.choosedGuess.indexOf("|"));
      item.answer = [
        Number.parseInt(item.choosedGuess[1]),
        Number.parseInt(month),
      ];
      item.finalIndex = 0;
      item.initial = true;
      dispatch(timelineActions.addItem(item));
      getCard(
        props.choosenType,
        setItem,
        cookies.playedCards,
        false,
        setCookies
      );
      getCard(
        props.choosenType,
        setNextItem,
        cookies.playedCards,
        false,
        setCookies
      );
    }
    if (!item) {
      placeInitialCard();
    }
  }, []);
  useEffect(()=>{
    if(items.length > 0 && item){
      const checkIfAlreadyInPlay = items.find(i => i.title === item.title )
      console.log(items,item,checkIfAlreadyInPlay)
      if(checkIfAlreadyInPlay){
        // getCard(props.choosenType, setItem, cookies.playedCards, false, setCookies);
      }
    }

  },[items,item])

  const hearts = [1, 2, 3].map((item, index) => {
    return (
      <img
        key={Math.random()}
        src={index < lives ? heart.src : brokenHeart.src}
        alt=""
      />
    );
  });

  function endGame() {
    if (bestResult.bestResult < items.length || !bestResult.bestResult) {
      removeBestResult("bestResult");
      setBestResult("bestResult", items.length - 1, {
        expires: new Date("December 17, 2030 03:24:00"),
      });
    }

    dispatch(timelineActions.endGame());
    props.toMain(true);
  }

  return (
    <div data-notacard className={styles.game}>
      <div className={styles.heartsWrapper}>{hearts}</div>
      <NewGameCard item={item} />
      <TimeLine />
      {lives === 0 && (
        <div className={styles.gameOverModal}>
          <div className={styles.gameOverWrapper}>
            <div className={styles.gameOver}>Игра окончена</div>

            <div className={styles.gameOver}>
              Ваш результат - {items.length - 1}
            </div>
            <button className={styles.toMain} onClick={endGame}>
              Вернуться на главную страницу
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
