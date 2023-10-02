import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const reservationsSlice = createSlice({
  name: "reservations",
  initialState: {
    value: [],
  },
  reducers: {
    setReservations: (state, action) => {
      state.value = action.payload;
    },
  },
});

const selectedWorkstationSlice = createSlice({
  name: "selectedWorkstation",
  initialState: {
    value: { _id: "650f1da5f7daed9bd6fb1b7b", name: "Alfa" },
  },
  reducers: {
    setSelectedWorkstation: (state, action) => {
      state.value = action.payload;
    },
  },
});

// config the store
const store = configureStore({
  reducer: {
    reservations: reservationsSlice.reducer,
    selectedWorkstation: selectedWorkstationSlice.reducer,
  },
});

// export the actions
export const { setReservations } = reservationsSlice.actions;
export const { setSelectedWorkstation } = selectedWorkstationSlice.actions;

// export the store
export default store;
