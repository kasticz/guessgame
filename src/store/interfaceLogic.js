import { timelineActions } from "./store";
import getRandomType from "./types";

let scrollInterval;
export let timelinePosition = 0;
let timelineScrolled = false;

let scrollCheckCard;

export function onMouseDown(e, card, styles, dispatch, item) {
  const cardCheck = card?.dataset?.newcard === "true";

  if (!cardCheck) {
    return;
  }
  scrollCheckCard = card;

  const allCards = document
    .querySelector("[data-timeline]")
    .querySelectorAll("[data-placedcard]");
    scrollInterval = setInterval(() => {
      moveTimeline(allCards);
    }, 300);
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

    const leftElem = findCardToTheLeft(cardCoords);
    const rightElem = findCardToTheRight(cardCoords);
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
    if (elemUnder?.dataset?.timeline) {
      card.classList.add(styles.readyToDrop);
    }
  }

  function placeCard(e) {
    scrollCheckCard = null;
    clearInterval(scrollInterval);
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
    card.style.display = "none";
    setTimeout(() => {
      card.style.display = "flex";
    }, 100);

    document.removeEventListener(`mousemove`, dragCard);
    card.removeEventListener("mouseup", placeCard);
  }

  document.addEventListener(`mousemove`, dragCard);
  card.addEventListener("mouseup", placeCard);
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
  } else if (xDiff < 100 && xDiff > -150 && element.dataset.moved === "true") {
    element.style.transform = "translateX(0px)";
    element.dataset.moving = true;
    setTimeout(() => {
      element.dataset.moving = false;
    }, 500);
    element.dataset.moved = false;
  }
}

function findCardUnder(cardCoords) {
  const cardUnderRightBottom = document
    .elementFromPoint(cardCoords.left + 100, cardCoords.top + 150)
    ?.closest("[data-placedcard]");
  const cardUnderRightTop = document
    .elementFromPoint(cardCoords.left + 100, cardCoords.top - 150)
    ?.closest("[data-placedcard]");
  const cardUnderLeftBottom = document
    .elementFromPoint(cardCoords.left - 100, cardCoords.top + 150)
    ?.closest("[data-placedcard]");
  const cardUnderLeftTop = document
    .elementFromPoint(cardCoords.left - 100, cardCoords.top - 150)
    ?.closest("[data-placedcard]");
  const cardUnderExactlyBottom = document
    .elementFromPoint(cardCoords.left, cardCoords.top + 150)
    ?.closest("[data-placedcard]");
  const cardUnderExactlyTop = document
    .elementFromPoint(cardCoords.left, cardCoords.top - 150)
    ?.closest("[data-placedcard]");

  const result =
    cardUnderRightBottom ||
    cardUnderRightTop ||
    cardUnderLeftBottom ||
    cardUnderLeftTop ||
    cardUnderExactlyBottom ||
    cardUnderExactlyTop ||
    null;
  return result;
}
function findCardToTheLeft(cardCoords) {
  const cardUnder = document
    .elementFromPoint(cardCoords.left - 100, cardCoords.top - 200)
    ?.closest("[data-placedcard]");

  const cardBelow = document
    .elementFromPoint(cardCoords.left - 100, cardCoords.top + 200)
    ?.closest("[data-placedcard]");

  const result = cardUnder || cardBelow || null;
  return result;
}

function findCardToTheRight(cardCoords) {
  const cardUnder = document
    .elementFromPoint(cardCoords.right + 100, cardCoords.top - 150)
    ?.closest("[data-placedcard]");

  const cardBelow = document
    .elementFromPoint(cardCoords.right + 100, cardCoords.top + 150)
    ?.closest("[data-placedcard]");

  const result = cardUnder || cardBelow || null;
  return result;
}

export function moveTimeline(allCards) {
  const cardCoords = scrollCheckCard.getBoundingClientRect();
  const timeline = document.querySelector("[data-timeline]");

  const checkScroll = window.innerWidth - cardCoords.right;
  const scrollThreshHold = window.innerWidth / 5;
  const scrollLeft =
    checkScroll > window.innerWidth - scrollThreshHold && timelinePosition < 0;
  const scrollRight =
    checkScroll < scrollThreshHold && timelinePosition > -50000;

  if (
    (scrollLeft || scrollRight) &&
    !timelineScrolled &&
    cardCoords.bottom > 200
  ) {
    timelineScrolled = true;
    setTimeout(() => {
      timelineScrolled = false;
    }, 300);
    timelinePosition = scrollLeft
      ? timelinePosition + 600
      : timelinePosition - 600;
    if (timelinePosition >= -300) timelinePosition = 0;
    timeline.style.transform = `translate(${timelinePosition}px,0)`;
    allCards.forEach(item => item.style.transform = 'translateX(0px)')
  }
}
export function changeTimeLinePos(newTlPos) {
  timelinePosition = newTlPos;
}

export async function getCard(
  type,
  setItem,
  items,
  initialCard,
  setCookies,
  cardsPlayed
) {
  const resp = await fetch("./api/getRandomCard", {
    method: "POST",
    body: JSON.stringify({
      type: type,
      items: items ? items[type] : [],
      cardsPlayed: cardsPlayed,
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

  async function getImg(title) {
    const resp = await fetch("./api/getImage", {
      method: "POST",
      body: JSON.stringify({
        imgTitle: title,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const image = await resp.json();
    
    if (image.imgSource) {      
      data.card.image = image.imgSource;
      return true;
    } else {
      getCard(type, setItem, items, initialCard, setCookies, cardsPlayed);
      return false;
    }
  }
  if (data.card.title) {   
    const imgRetrieved = await getImg(data.card.title);
    if (!imgRetrieved) return;
  }
  if (data.clearCookies) {
    let newCookies = { human: [], event: [], object: [] };
    if (cardsPlayed) {
      cardsPlayed.forEach((item) => {
        newCookies[item.type].push(item);
      });
    }
    items = newCookies;
  }

  if (initialCard?.first) {
    return data.card;
  }

  if (!initialCard?.second) {
    items[type].push(data.card.title);

    await setCookies("playedCards", items, {
      expires: new Date("December 17, 2030 03:24:00"),
    });
  }

  setItem(data.card);
  return data.card.title;
}

export async function placeInitialCards(
  type,
  playedCardsCookies,
  setCookies,
  setItem,
  setNextItem,
  dispatch
) {
  const cookiesObj = playedCardsCookies
    ? playedCardsCookies
    : { human: [], event: [], object: [] };

  const typeForFirst = type === "all" ? getRandomType() : type;
  const typeForSecond = type === "all" ? getRandomType() : type;
  const typeForThird = type === "all" ? getRandomType() : type;

  const itemI = await getCard(
    typeForFirst,
    null,
    cookiesObj,
    { first: true },
    setCookies
  );
  const month = itemI.choosedGuess[1].slice(itemI.choosedGuess.indexOf("|"));
  itemI.answer = [
    Number.parseInt(itemI.choosedGuess[1]),
    Number.parseInt(month),
  ];
  itemI.finalIndex = 0;
  itemI.initial = true;
  dispatch(timelineActions.addItem(itemI));

  cookiesObj[typeForFirst].push(itemI.title);

  const secondItem = await getCard(
    typeForSecond,
    setItem,
    cookiesObj,
    { second: true },
    setCookies
  );

  cookiesObj[typeForSecond].push(secondItem);

  getCard(typeForThird, setNextItem, cookiesObj, false, setCookies);
}
