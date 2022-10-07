import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getCard, onMouseDown } from "../store/interfaceLogic";
import { timelineActions } from "../store/store";
import styles from "./GameCard.module.sass";

export default function NewGameCard(props) {
  const cardRef = useRef()
  const dispatch = useDispatch()
  const item = props.item







  return (
    <div data-notacard className={styles.cardWrapper}>
      {item?.image ? (
        <div ref={cardRef} data-newcard={true} draggable={false}  onMouseDown={(e)=>{onMouseDown(e,cardRef.current,styles,dispatch,item)}} className={styles.card}>
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
    </div>
  );
}
