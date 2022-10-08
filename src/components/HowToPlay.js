import { Fragment } from "react";
import how1 from "../images/how1.png";
import how2 from "../images/how2.gif";
import how3 from "../images/how3.png";
import styles from "./HowToPlay.module.sass";

export default function HowToPlay(props) {
  return (
    <Fragment>
      <div
        onClick={() => {
          props.setHowTo(false);
        }}
        className={styles.howOverlay}
      ></div>
      <div className={styles.howContent}>
        <p className={styles.howTitle}>"Что было раньше?" - викторина, где будут протестированы Ваши знания исторических дат</p>
        <div className={styles.howStep}>
          <p>
            Вам будет дана карточка человека/события/объекта. Изучите её
            название (1), краткое описание (2) и предположите, когда произошло
            событие в нижней части карточки (3).
          </p>
          <img src={how1.src} alt="" />
        </div>
        <div className={styles.howStep}>
          <p>
            Возьмите карточку и разместите её на временной линии относительно
            уже существующих в правильном хронологическом порядке.
          </p>
          <img className={styles.gif} src={how2.src} alt="" />
        </div>
        <div className={styles.howStep}>
          <p>
            После того, как вы разместите карточку, цвет её события поменяется
            либо на зелёный(размещено правильно) либо на красный(размещено
            неправильно), а также появится новая карточка. У вас есть 3 жизни, когда их количество опустится до
            0, игра закончится.
          </p>
          <img src={how3.src} alt="" />
        </div>
        <button
          onClick={() => {
            props.setHowTo(false);
          }}
        >
          Понятно
        </button>
      </div>
    </Fragment>
  );
}
