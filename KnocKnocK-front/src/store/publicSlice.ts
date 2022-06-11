import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Web3Modal from "web3modal";
export interface PublicState {
  web3Modal: any;
  provider: any;
}

const initialState: PublicState = {
  web3Modal: undefined,
  provider: undefined,
};

export const publicSlice = createSlice({
  name: "public",
  initialState,
  reducers: {
    setWeb3Modal: (state, action: PayloadAction<Web3Modal>) => {
      state.web3Modal = action.payload;
    },
    setProvider: (state, action: PayloadAction<any>) => {
      state.provider = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWeb3Modal, setProvider } = publicSlice.actions;

export default publicSlice.reducer;
