import styles from "./Game.module.sass";
import NewGameCard from "./NewGameCard";
import TimeLine from "./TimeLine";
import { useState, useEffect } from "react";
import { changeTimeLinePos, getCard, placeInitialCards } from "../store/interfaceLogic";
import { useDispatch, useSelector } from "react-redux";
import { timelineActions } from "../store/store";
import { useCookies } from "react-cookie";
import heart from "../images/heart.svg";
import brokenHeart from "../images/brokenHeart.svg";
import getRandomType from "../store/types";

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
      if (nextItem) {
        setItem(nextItem);
        setNextItem(null);
        await getCard(
          props.choosenType === "all" ? getRandomType() : props.choosenType,
          setNextItem,
          cookies.playedCards,
          false,
          setCookies,
          [...items, item]
        );
      }
      
    }
    if (itemPlaced) {
      getNewCard();
    }
  }, [itemPlaced]);



  useEffect(() => {
    if (!item && !nextItem) {
      placeInitialCards(
        props.choosenType,
        cookies.playedCards,
        setCookies,
        setItem,
        setNextItem,
        dispatch
      );
    }
  }, []);


  




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
  function moveTl(dest){
    const timeline = document.querySelector('[data-timeline]')
    timeline.style.transform = `translate(${dest}px,0px)`
    changeTimeLinePos(dest)
  }

  


  return (
    <div data-notacard className={styles.game}>
      <div className={styles.heartsWrapper}>{hearts}</div>
      <button onClick={()=>{moveTl(0)}} className={`${styles.moveTimeline} ${styles.moveTimelineBeginning}`}> Начало</button>
      <button onClick={()=>{moveTl(items.length > 6 ? ((items.length - 6) * -322) -30 : 0)}} className={`${styles.moveTimeline} ${styles.moveTimelineEnd}`}>Конец</button>
      <NewGameCard ready={nextItem} item={item} />
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
