import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCard } from "../store/interfaceLogic";
import { timelineActions } from "../store/store";
import GameCard from "./GameCard";
import styles from "./TimeLine.module.sass";

export default function TimeLine(props) {
  const dispatch = useDispatch()

  const cards = useSelector(state=> state.timeline.cards)

  useEffect(()=>{
    async function placeInitialCard(){
      const item = await getCard(props.type,null,cards,true)
      const month = item.choosedGuess[1].slice(item.choosedGuess.indexOf('|'))   
      item.answer = [Number.parseInt(item.choosedGuess[1]),Number.parseInt(month)]
      dispatch(timelineActions.addItem(item))
    }
    if(cards.length === 0){
      placeInitialCard()
    }
  },[cards])


  const cardsComp = cards.map((item,index)=>{
    return <GameCard i={index} key={Math.random()} item={item}/>
  })





  return (
    <div  className={styles.timeLineWrapper}>
      <div data-timeline={true} className={styles.timeLine}>
        {cardsComp}
      </div>
    </div>
  );
}
