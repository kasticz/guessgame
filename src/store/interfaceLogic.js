import { timelineActions } from "./store";


let scrollInterval;
export let timelinePosition = 0;
let timelineScrolled = false;

let scrollCheckCard

export function onMouseDown(e, card, styles, dispatch, item) {
  const cardCheck = card?.dataset?.newcard === "true";

  if (!cardCheck) {
    return;
  }
  scrollCheckCard = card
  scrollInterval = setInterval(() => {
    moveTimeline()
  }, 300);
  const allCards = document
    .querySelector("[data-timeline]")
    .querySelectorAll("[data-placedcard]");
  card.style.cursor = "grabbing";

  card.style.position = "absolute";
  card.style.zIndex = "5000";

  const cardCoords = card.getBoundingClientRect();

  const xDiff = e.clientX - cardCoords.x;
  const yDiff = e.clientY - cardCoords.y;

  let elementsNearby = [];

  function dragCard(e) {
    card.style.top = `${e.clientY - yDiff}px`;
    card.style.left = `${e.clientX - xDiff}px`;
    const cardCoords = card.getBoundingClientRect();
    card.style.display = "none";

    const leftElem = document
      .elementFromPoint(cardCoords.left - 100, cardCoords.top + 100)
      ?.closest("[data-placedcard]");
    const rightElem = document
      .elementFromPoint(cardCoords.right + 100, cardCoords.top + 100)
      ?.closest("[data-placedcard]");
    elementsNearby[0] = leftElem;
    elementsNearby[1] = rightElem;

    let isCardUnder = findCardUnder(cardCoords);

    const elemUnder = document.elementFromPoint(e.clientX, e.clientY);
    card.style.display = "flex";

    if (leftElem && !(leftElem.dataset?.moving === "true")) {
      checkIfElementShouldMove(leftElem, cardCoords, allCards);
    }
    if (rightElem && !(rightElem.dataset?.moving === "true")) {
      checkIfElementShouldMove(rightElem, cardCoords, allCards);
    }
    if (isCardUnder && !(isCardUnder.dataset?.moving === "true")) {
      checkIfElementShouldMove(isCardUnder, cardCoords, allCards);
    }

    if (elemUnder?.dataset?.notacard) {
      allCards.forEach((item) => {
        item.style.transform = "translateX(0px)";
        item.dataset.moved = false;
      });
    }
    if (!elemUnder?.dataset?.timeline) {
      if (card.classList.contains(styles.readyToDrop)) {
        card.classList.remove(styles.readyToDrop);
      }
    }
    if(elemUnder.dataset.timeline){
      card.classList.add(styles.readyToDrop)
    }
  }

  function placeCard(e) {
    scrollCheckCard = null
    clearInterval(scrollInterval)
    if (card.classList.contains(styles.readyToDrop)) {
      card.classList.remove(styles.readyToDrop);
    }
    card.style.display = "none";
    const elemUnder = document.elementFromPoint(e.clientX, e.clientY);
    card.style.display = "flex";
    card.style.cursor = "grab";
    const cardCoords = card.getBoundingClientRect();

    allCards.forEach((item) => {
      item.style.transform = "translateX(0px)";
      item.dataset.moved = false;
    });

    if (elemUnder?.dataset?.timeline) {
      if (card.classList.contains(styles.readyToDrop)) {
        card.classList.remove(styles.readyToDrop);
      }

      let finalIndex;
      if (elementsNearby[0]) finalIndex = +elementsNearby[0].dataset.index;
      if (elementsNearby[1] && !finalIndex)
        finalIndex = +elementsNearby[1].dataset.index - 1;
      if (
        !elementsNearby[0] &&
        !elementsNearby[1] &&
        cardCoords.right <= 500 &&
        !finalIndex
      )
        finalIndex = 0;
      if (
        !elementsNearby[0] &&
        !elementsNearby[1] &&
        cardCoords.right >= 500 &&
        !finalIndex
      )
        finalIndex = allCards.length;

      const month = item.choosedGuess[1].slice(item.choosedGuess.indexOf("|"));

      item.answer = [
        Number.parseInt(item.choosedGuess[1]),
        Number.parseInt(month),
      ];
      item.finalIndex = finalIndex;

      dispatch(timelineActions.addItem(item));
    }

    card.style.top = `auto`;
    card.style.left = `auto`;
    card.style.position = "static";

    document.removeEventListener(`mousemove`, dragCard);
    card.removeEventListener("mouseup", placeCard);
  }

  document.addEventListener(`mousemove`, dragCard);
  card.addEventListener("mouseup", placeCard);
}

export async function getCard(type, setItem, items, initialCard,setCookies) {
  const resp = await fetch("./api/getRandomCard", {
    method: "POST",
    body: JSON.stringify({
      type: type,
      items: items || [],
    }),
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await resp.json();

  const randomGuess = data.card
    ? data.card.years[Math.floor(Math.random() * data.card.years.length)]
    : null;
  data.card.choosedGuess = randomGuess;

  async function getImg() {
    const resp = await fetch("./api/getImage", {
      method: "POST",
      body: JSON.stringify({
        imgTitle: data.card.title,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const image = await resp.json();

    data.card.image = image.imgSource;
  }
  if (data.card) await getImg();

  const playedCards = items || []
  playedCards.push(data.card.title)

  await setCookies('playedCards',playedCards,{
    expires: new Date("December 17, 2030 03:24:00"),
  })
  

  if (initialCard) {
    return data.card;
  }
  setItem(data.card);
}

function checkIfElementShouldMove(element, cardCoords, allCards) {
  const elemCoords = element.getBoundingClientRect();

  const xDiff = elemCoords.left - cardCoords.left;

  if (xDiff < 150 && xDiff > -150 && element.dataset.moved === "false") {
    for (let i = 0; i < allCards.length; i++) {
      if (+allCards[i].dataset.index >= +element.dataset.index) {
        allCards[i].style.transform = "translateX(322px)";
        allCards[i].dataset.moving = true;
        setTimeout(() => {
          allCards[i].dataset.moving = false;
        }, 500);
        allCards[i].dataset.moved = true;
      }
    }
  } else if (xDiff < 100 && xDiff > -100 && element.dataset.moved === "true") {
    element.style.transform = "translateX(0px)";
    element.dataset.moving = true;
    setTimeout(() => {
      element.dataset.moving = false;
    }, 500);
    element.dataset.moved = false;
  }
}

function findCardUnder(cardCoords) {
  const cardUnderRight = document
    .elementFromPoint(cardCoords.left + 100, cardCoords.top + 150)
    ?.closest("[data-placedcard]");
  const cardUnderLeft = document
    .elementFromPoint(cardCoords.left - 100, cardCoords.top + 150)
    ?.closest("[data-placedcard]");
  const cardUnderExactly = document
    .elementFromPoint(cardCoords.left, cardCoords.top + 150)
    ?.closest("[data-placedcard]");

  const result = cardUnderRight || cardUnderLeft || cardUnderExactly || null;
  return result;
}

export function moveTimeline(e) {

  const cardCoords = scrollCheckCard.getBoundingClientRect()
  const timeline = document.querySelector("[data-timeline]");

  const checkScroll = window.innerWidth - cardCoords.right;
  const scrollThreshHold = window.innerWidth / 5;
  const scrollLeft =
    checkScroll > window.innerWidth - scrollThreshHold && timelinePosition < 0;
  const scrollRight =
    checkScroll < scrollThreshHold && timelinePosition > -50000;

    
  if ((scrollLeft || scrollRight) && !timelineScrolled && cardCoords.bottom > 200) {
    timelineScrolled = true;
    setTimeout(() => {
      timelineScrolled = false;
    }, 300);
    timelinePosition = scrollLeft
      ? timelinePosition + 600
      : timelinePosition - 600;
      if(timelinePosition >= -300 ) timelinePosition = 0
    timeline.style.transform = `translate(${timelinePosition}px,0)`;
  }
}
export function changeTimeLinePos(newTlPos){
  timelinePosition = newTlPos
  console.log(newTlPos)
}

function debounce(fn, delay) {
  let cd;
  return function exFunction() {
    if (!cd) {
      cd = true;
      setTimeout(() => {
        cd = false;
      }, delay);
      fn(...arguments);
    }
    return;
  };
}
