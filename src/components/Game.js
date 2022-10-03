import styles from "./Game.module.sass";
import NewGameCard from "./NewGameCard";
import TimeLine from "./TimeLine";
import { useState, useEffect } from "react";
import { getCard } from "../store/interfaceLogic";
import { useDispatch, useSelector } from "react-redux";
import { timelineActions } from "../store/store";

export default function Game(props) {
  const itemPlaced = useSelector(state => state.timeline.itemPlaced)
  const [item, setItem] = useState();
  const [nextItem,setNextItem] = useState()
  const dispatch = useDispatch()
  const items = useSelector(state=> state.timeline.cards)


  useEffect(()=>{
    if(itemPlaced){
      dispatch(timelineActions.setItemPlaced())      
      setItem(nextItem)
      getCard('human',setNextItem,items)
    }
  },[itemPlaced])



  useEffect(() => {
    if (!item){
      getCard('human',setItem,items);
      getCard('human',setNextItem,items)
    } 
  }, []);
  // useEffect(()=>{
  //   if(itemPlayed){
  //     setItemPlayed(false)
  //     setItem(nextItem)
  //     getCard('human',setNextItem)
  //   }

  // },[itemPlayed])

  return (
    <div className={styles.game}>
      <NewGameCard  item={item}/>
      <TimeLine/>
    </div>
  );
}
