import Head from "next/head";
import peopleImg from "../src/images/people.png";
import eventsImg from "../src/images/events.png";
import objectsImg from "../src/images/objects.png";
import allImg from "../src/images/all.png";
import styles from "./index.module.sass";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Game from "../src/components/Game";
import HowToPlay from "../src/components/HowToPlay";
import { qwe } from "../src/store/cards";

export default function Home(props) {
  const [preGame, setPreGame] = useState(true);
  const [choosenType, setChoosenType] = useState(null);
  const [cookies] = useCookies(["bestResult"]);
  const [bestRes, setBestRes] = useState();
  const [cookiesAccepted, setCookiesAccepted] = useCookies(["cookiesAccepted"]);
  const [cookiesAccepted2, setCookiesAccepted2] = useState(null);
  const [howTo, setHowTo] = useState(false);

  function startGame() {
    setPreGame(false);
  }
  useEffect(() => {
    if (cookies.bestResult) setBestRes(cookies.bestResult);
  }, [cookies.bestResult, preGame]);
  useEffect(() => {
    setCookiesAccepted2(cookiesAccepted.cookiesAccepted);
  }, [cookiesAccepted]);

  // const i = props.info.query.pages[0].revisions[0].slots.main.content.slice(
  //   0,
  //   5000
  // );

  // console.log(i)

  // async function sendCards(){
  //   fetch('./api/postCards',{
  //     method:'POST',
  //     body:JSON.stringify({cards:qwe}),
  //     headers:{
  //       'Content-type':'application/json'
  //     }
  //   })
  // }

  return (
    <main className={styles.game}>
      {preGame ? (
        <div className={styles.mainPage}>
          <div className={styles.uiWrapper}>
            <h1>Что было раньше?</h1>
            <div className={styles.bestRes}>
              Ваш лучший результат - {bestRes || 0}
            </div>
            <div className={styles.chooseWrapper}>
              <h2>Выберите категорию</h2>
              <div className={styles.categoriesWrapper}>
                <div
                  onClick={() => {
                    setChoosenType("human");
                  }}
                  className={`${styles.category} ${
                    choosenType === "human" ? styles.big : ""
                  }`}
                >
                  <img src={peopleImg.src} alt="" />
                  <h3>Люди</h3>
                </div>
                <div
                  onClick={() => {
                    setChoosenType("event");
                  }}
                  className={`${styles.category} ${
                    choosenType === "event" ? styles.big : ""
                  }`}
                >
                  <img src={eventsImg.src} alt="" />
                  <h3>События</h3>
                </div>
                <div
                  onClick={() => {
                    setChoosenType("object");
                  }}
                  className={`${styles.category} ${
                    choosenType === "object" ? styles.big : ""
                  }`}
                >
                  <img src={objectsImg.src} alt="" />
                  <h3>Объекты материального мира</h3>
                </div>
                <div
                  onClick={() => {
                    setChoosenType("all");
                  }}
                  className={`${styles.category} ${
                    choosenType === "all" ? styles.big : ""
                  }`}
                >
                  <img src={allImg.src} alt="" />
                  <h3>Всё вместе</h3>
                </div>
              </div>
            </div>
            <div className={styles.buttonsWrapper}>
              <button
                onClick={() => {
                  setHowTo(true);
                }}
                className={styles.uiButton}
              >
                Как играть?
              </button>
              <button onClick={startGame} className={styles.uiButton}>
                Начать игру
              </button>
            </div>
            {/* <button onClick={sendCards}></button> */}
          </div>
          <div className={styles.support}>
            Сделано с помощью{" "}
            <a target='_blank' href="https://www.mediawiki.org/wiki/MediaWiki">
              <img
                src="https://www.mediawiki.org/static/images/mobile/copyright/mediawiki.svg"
                alt=""
              />
              MediaWiki
            </a>
          </div>
        </div>
      ) : (
        <Game toMain={setPreGame} choosenType={choosenType || "all"} />
      )}
      {!cookiesAccepted2 && cookiesAccepted2 !== null && (
        <div className={styles.cookies}>
          <p>Для работы приложения используются cookie-файлы</p>
          <button
            onClick={() => {
              setCookiesAccepted("cookiesAccepted", true, {
                expires: new Date("December 17, 2030 03:24:00"),
              });
            }}
          >
            Принять
          </button>
        </div>
      )}
      {howTo && <HowToPlay setHowTo={setHowTo} />}
    </main>
  );
}

// export async function getServerSideProps() {
//   const resp = await fetch(
//     "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&titles=Lord_of_the_Flies&formatversion=2&rvprop=content&rvslots=*",
//     {
//       method: "GET",
//       headers: {
//         Origin: "en.wikipedia.org ",
//       },
//     }
//   );

//   const data = await resp.json();

//   return {
//     props: {
//       info: data,
//     },
//   };
// }
