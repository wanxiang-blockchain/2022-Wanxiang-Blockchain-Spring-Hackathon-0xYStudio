import { ChainId, DAppProvider, Mainnet } from "@usedapp/core";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";

const NETWORK_CONNECTIONS = {
  [ChainId.Mainnet]:
    "https://mainnet.infura.io/v3/f88abc181a4a45a6bc47bdda05a94944",
  [ChainId.Ropsten]:
    "https://ropsten.infura.io/v3/f88abc181a4a45a6bc47bdda05a94944",
};
const config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: NETWORK_CONNECTIONS,
  multicallVersion: 2 as const,
};
const queryClinet = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.render(
  <QueryClientProvider client={queryClinet}>
    <DAppProvider config={config}>
      <Provider store={store}>
        <App />
      </Provider>
    </DAppProvider>
  </QueryClientProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
