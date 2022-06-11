import styles from "../../styles/Home.module.scss";
import Sidebar from "../Sidebar";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Introsection from "../Introsection";
import InfoSection from "../Infosection";
import { littleCase, smartCase } from "../Infosection/Data";
import Team from "../Team";
import Footer from "../Footer";
import Timelines from "../Timelines";
import Vision from "../Vision";
import VideoNTF from "../VideoNTF";
// import FAQ from "components/FAQ";
export const visionProp = {
  id: "vision",
  lightBg: true,
  lightText: false,
  lightTextDesc: false,
  topLine: "Vision",
  headline: "Unlock NFT's social power to penetrate business operation",
  description1:
    "Collecting NFTs is still a niche hobby and for making money only. People first need a way to collect and show NFTs in daily life as simple as tapping fingers, and thus, creating the basis for NFT as everyone's verifiable identity. The NFTs can be the collectibles for joy, for benefits, and more attractively, for trading with other crypto assets to make money. This will motivate people to collect NFTs in favor of collecting blind box toys.",
  description2:
    'People will ultimately be used to collecting NFTs from merchants instead of collecting membership cards, loyalty points, coupons, or tickets after payment or attending campaigns. We build a NFT market specialized for business operation to provide one-stop service for organizations to manage NFTs and campaigns, such as uploading NFTs, publishing smart contracts, and binding buyer\'s rights. This will create a new business model "social-to-pay" to operate customers.',
  buttonLabel: "Product and Whitepaper",
  imgStart: false,
  alt: "Car",
  dark: false,
  primary: false,
  darkText: true,
  dark2: 1,
};

export default () => {
  return (
    <div className={styles.container}>
      <Introsection />
      <InfoSection dark2={undefined} {...littleCase} smart={false} />
      <VideoNTF />
      <InfoSection dark2={undefined} {...smartCase} smart={true} />
      <Vision {...visionProp} />
      <Timelines />
      <Team />
      {/* <FAQ /> */}
      <Footer />
    </div>
  );
};
