import { FC, useEffect, useState } from "react";
import "antd/dist/antd.css";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MintPage from "components/MintPage";
import Navbar from "components/Navbar";
import Socail from "components/Social";
import HomePage from "components/HomePage";
import Generate from "components/Generate";
import Cart from "components/Cart";
import Product from "./components/Product";
import Profile from "./components/Profile";
import ProfileMobile from "./components/ProfileMobile";
import Verifymobile from "components/Verifymobile";

const App: FC = () => {
  const loadFont = async (fontUrl) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = fontUrl;
    document.head.appendChild(link);
  };
  loadFont(".assets/font/OpenSans-Regular.ttf");
  const [isOpenWallet, setIsOpenWallet] = useState(false);

  return (
    <div>
      <Router>
        {/* <Sidebar isOpen={isOpen} toggle={toggle} isMobile={clientWidth<=1150} /> */}
        <Navbar showWalletBtn={true} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/social/:sign" element={<Socail />} />
          <Route path="/nft" element={<MintPage />} />
          {/* <Route path="/whitepaper" element={<WhitePaper />} /> */}
          <Route
            path="/profile"
            element={
              window.screen.width >= 800 ? <Profile /> : <ProfileMobile />
            }
          />
          <Route path="/generate" element={<Generate />}>
            <Route path=":inviteCode" element={<Generate />} />
            <Route path="" element={<Generate />} />
          </Route>
          <Route
            path="/verify/:contract/:token_id"
            element={<Verifymobile />}
          />
          <Route path="/product" element={<Product />}>
            <Route path=":product" element={<Product />} />
            <Route path=":" element={<Product />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
