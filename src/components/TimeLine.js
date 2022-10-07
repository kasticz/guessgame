import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTimeLinePos, getCard, timelinePosition } from "../store/interfaceLogic";
import { timelineActions } from "../store/store";
import GameCard from "./GameCard";
import styles from "./TimeLine.module.sass";

export default function TimeLine(props) {


  const cards = useSelector(state=> state.timeline.cards)
  const tlRef = useRef()



  const cardsComp = useMemo(()=>{
    return cards.map((item,index)=>{
      return <GameCard i={index} key={Math.random()} item={item}/>
    })
  },[cards]) 
  useEffect(()=>{
    if(cards.length > 0){
      const lastAdded = cards.findIndex(item => item.lastAdded)
      const newTlPos = lastAdded * -300 <= -1800 ? lastAdded * -300 : 0
      tlRef.current.style.transform = `translate(${newTlPos}px,0)`
      changeTimeLinePos(newTlPos)

    }

  },[cards])


  return (
    <div   className={styles.timeLineWrapper}>
      <div ref={tlRef}  data-timeline={true} className={styles.timeLine}>
        {cardsComp}
      </div>
    </div>
  );
}
