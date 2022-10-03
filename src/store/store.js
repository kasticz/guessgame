import { configureStore, createSlice } from "@reduxjs/toolkit";

const timeline = createSlice({
  name: "timeline",
  initialState: {
    cards: [],
    itemPlaced: false
  },
  reducers: {
    addItem(state, payload) {
        const i = payload.payload 
        console.log(i)
      state.cards.push(i)
      state.cards.sort((a,b)=>{
        return a.answer[0] - b.answer[0]
      })
      state.itemPlaced = true
    },
    setItemPlaced(state){
        state.itemPlaced = false
    }
  },
});

const store = configureStore({ reducer: { timeline: timeline.reducer } });

export const timelineActions = timeline.actions;

export default store;
