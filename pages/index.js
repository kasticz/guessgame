import Head from "next/head";
import Image from "next/image";
import peopleImg from "../src/images/people.png";
import eventsImg from "../src/images/events.png";
import objectsImg from "../src/images/objects.png";
import allImg from "../src/images/all.png";
import styles from "./index.module.sass";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Game from "../src/components/Game";

export default function Home(props) {


  const [preGame, setPreGame] = useState(true);
  const [choosenType, setChoosenType] = useState(null);
  const [cookies] = useCookies(["bestResult"])
  const [bestRes,setBestRes] = useState()

  function startGame() {
    setPreGame(false);
  }
  useEffect(()=>{
    if(!bestRes && cookies.bestResult) setBestRes(cookies.bestResult) 
  },[cookies,preGame])

  // const i = props.info.query.pages[0].revisions[0].slots.main.content.slice(
  //   0,
  //   5000
  // );

  // const imgPre = props.img.query.pages;
  // const imgSource = imgPre[Object.keys(imgPre)[0]].thumbnail.source;

 
  // console.log(imgSource);
  // console.log(props.img)

  const item = {
    type: "human",
    years: [
      // ['коронации','1370|4'],
      ["рождения", "570"],
      ["смерти", "632"],
    ],
    title: "Muhammad",
    descr: "Founder and main prophet of Islam",
  };


  return (
    <main className={styles.game}>
      {preGame ? (
        <div className={styles.mainPage}>
        <div className={styles.uiWrapper}>
          <h1>Что было раньше?</h1>
          <div className={styles.bestRes}>Ваш лучший результат - {bestRes || 0}</div>
          <div className={styles.chooseWrapper}>
            <h2>Выберите категорию</h2>
            <div className={styles.categoriesWrapper}>
              <div
                onClick={() => {
                  setChoosenType("human");
                }}
                className={`${styles.category} ${choosenType === 'human' ? styles.big : ''}`}
              >
                <img src={peopleImg.src} alt="" />
                <h3>Люди</h3>
              </div>
              <div
                onClick={() => {
                  setChoosenType("events");
                }}
                className={`${styles.category} ${choosenType === 'events' ? styles.big : ''}`}
              >
                <img src={eventsImg.src} alt="" />
                <h3>События</h3>
              </div>
              <div
                onClick={() => {
                  setChoosenType("objects");
                }}
                className={`${styles.category} ${choosenType === 'objects' ? styles.big : ''}`}
              >
                <img src={objectsImg.src} alt="" />
                <h3>Объекты материального мира</h3>
              </div>
              <div
                onClick={() => {
                  setChoosenType("all");
                }}
                className={`${styles.category} ${choosenType === 'all' ? styles.big : ''}`}
              >
                <img src={allImg.src} alt="" />
                <h3>Всё вместе</h3>
              </div>
            </div>
          </div>
          <div className={styles.buttonsWrapper}>
            <button className={styles.uiButton}>Как играть?</button>
            <button onClick={startGame} className={styles.uiButton}>
              Начать игру
            </button>
          </div>
        </div>
        </div>
      ) : (
        <Game toMain={setPreGame} choosenType={choosenType || "all"} />
      )}
    </main>
  );
}

// export async function getServerSideProps() {
//   const resp = await fetch(
//     "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&titles=Francisco_Goya&formatversion=2&rvprop=content&rvslots=*",
//     {
//       method: "GET",
//       headers: {
//         Origin: "en.wikipedia.org ",
//       },
//     }
//   );

//   const resp2 = await fetch(
//     "http://en.wikipedia.org/w/api.php?action=query&titles=Augustus&prop=pageimages&format=json&pithumbsize=300",
//     {
//       method: "GET",
//       headers: {
//         Origin: "en.wikipedia.org ",
//       },
//     }
//   );

//   const data = await resp.json();
//   const data2 = await resp2.json();

//   return {
//     props: {
//       info: data,
//       img: data2,
//     },
//   };
// }
