import { configureStore, createSlice } from "@reduxjs/toolkit";

const timeline = createSlice({
  name: "timeline",
  initialState: {
    cards: [],
    itemPlaced: false,
    lives: 3,
  },
  reducers: {
    addItem(state, payload) {
      const i = payload.payload;
      state.cards.push(i);
      state.cards.forEach((item) => (item.lastAdded = false));
      state.cards[state.cards.length - 1].lastAdded = true;
      state.cards.sort((a, b) => {
        return a.answer[0] - b.answer[0];
      });
      const addedItemI = state.cards.findIndex(
        (item) => item.title === payload.payload.title
      );

      state.cards[addedItemI].guessResult =
        addedItemI === payload.payload.finalIndex;

      const sameDateToLeft =
        addedItemI !== 0
          ? item.answer[0] === state.cards[addedItemI - 1].answer[0] &&
            item.answer[1] === state.cards[index - 1].answer[1]
          : false;
      const sameDateToRight =
        addedItemI !== state.cards.length - 1
          ? item.answer[0] === state.cards[addedItemI + 1].answer[0] &&
            item.answer[1] === state.cards[index - 1].answer[1]
          : false;

      if (sameDateToLeft || sameDateToRight) {
        state.cards[addedItemI].guessResult = true;
      }

      if (!payload.payload.initial) {
        state.itemPlaced = true;
      }

      const wrongAnswers = state.cards.filter(
        (item) => item.guessResult === false
      );

      state.lives = 3 - wrongAnswers.length;
    },
    setItemPlaced(state) {
      state.itemPlaced = false;
    },
    endGame(state) {
      state.cards = [];
      state.itemPlaced = false;
      state.lives = 3;
    },
  },
});

const store = configureStore({ reducer: { timeline: timeline.reducer } });

export const timelineActions = timeline.actions;

export default store;
