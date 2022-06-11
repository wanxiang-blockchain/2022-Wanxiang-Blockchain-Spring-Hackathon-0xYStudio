import { useState, useEffect, FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useMobileCompare from "hooks/useMobileCompare";

import copy from "copy-to-clipboard";
import { message } from "antd";
import { getSocialInfo } from "../../services/api";
import { AppInfo } from "../../hooks/useProfile";
import axios from "axios";
import duidou from "assets/images/duidou.png";
import logo from "assets/images/logo.png";
import "./index.scss";
/**
 * Social component
 * @returns {FC}
 */
const Socail: FC = () => {
  const { sign } = useParams();
  const [data, setData] = useState<any>();
  const [profileName, setProfileName] = useState<string>();
  const [nftSeries, setNftSeries] = useState<string>();
  const [floor, setFloor] = useState<any>();
  const [appInfos, setAppInfos] = useState<AppInfo[]>([]);
  const [isTrue, setIsTrue] = useState<boolean>(false);
  const navigate = useNavigate();
  const [tokenId, setTokenId] = useState<string>();
  const [nftDate, setNftData] = useState<any>();
  useMobileCompare(375);
  // init page load social data
  useEffect(() => {
    getSocialInfo({ sign }).then((res) => {
      if (res.success) {
        const socialData = res.data;
        setAppInfos(socialData.apps);
        setProfileName(socialData.accountShare.nickName);
        setNftSeries(socialData.nftInfo.series);
        setTokenId(socialData.nftInfo.tokenID);
        setNftData(socialData.nftInfo);
        const fetchData = async () => {
          let raw_data: any;
          let raw_floor = "";
          //get nft data
          await axios
            .get(
              `https://api.opensea.io/api/v1/asset/${socialData.nftInfo.contract}/${socialData.nftInfo.tokenID}`
            )
            .then(async function (response) {
              raw_data = response?.data;
              let rawDataOnwer: string = raw_data.owner.address;
              let shareAccount: string = socialData.accountShare.walletAddress;
              setIsTrue(
                shareAccount.toLowerCase() === rawDataOnwer.toLowerCase()
              );
            })
            .catch(function (error) {
              console.log(error);
            });
          if (raw_data) {
            let name = raw_data?.collection?.slug;

            await axios
              .get(`https://api.opensea.io/api/v1/collection/${name}/stats`)
              .then(function (response) {
                raw_floor = response?.data?.stats?.floor_price;
              })
              .catch(function (error) {
                console.log(error);
              });
          }
          setData(raw_data);
          setFloor(raw_floor);
        };
        fetchData();
      }
    });
  }, [sign]);
  /**
   * Jump to the schema URL of the app
   * @method handleToAppSchema
   * @param {AppInfo} appInfo
   * @returns {void}
   */
  const handleToAppSchema = (appInfo: AppInfo) => {
    if (copy(appInfo.value || "")) {
      message.info(
        "The account has been copied successfully. Please add friends in the app!"
      );
    } else {
      message.info("copy failed");
    }
    window.location.href = appInfo.url || "";
  };

  /**
   * Convert timestamp to days
   * @method timeConvert
   * @param {string} raw_date
   * @returns {string}
   */
  const timeConvert = (raw_date: string) => {
    if (raw_date) {
      var date = new Date(raw_date.slice(0, 10));
      var interval = new Date().getTime() - date.valueOf();
      var day = Math.ceil(interval / (1000 * 3600 * 24));
      return day + "d";
    } else {
      return "mint";
    }
  };
  const back = () => {
    navigate("/");
  };
  return (
    <>
      <div className="social-container">
        {/* <NavBar style={{ width: "100%" }}>
          {" "}
          <span onClick={back}>Turtlecase</span>
        </NavBar> */}
        <div className={"avater"}>
          {nftDate && <img src={nftDate.imgUrl} alt="" />}
        </div>
        <p className="user-desc">
          <span className="series" style={{ marginRight: "3px" }}>
            {nftSeries} ddd
          </span>
          #
          <span
            className="tokenid"
            onClick={() => {
              if (copy(tokenId || "")) {
                message.success("The tokenid has been copied successfully!");
              }
            }}
          >
            {tokenId}
          </span>
        </p>
        <div className="account-info">
          <div className="ower-name">
            <div>
              <span>Owned by {profileName}</span>
              {isTrue && <img src={duidou} alt="" className="true" />}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Cost</th>
                <th>Floor</th>
                <th>Hold</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data?.collection?.stats?.count || 0}</td>
                <td>
                  {data?.last_sale?.total_price / 1000000000000000000
                    ? data?.last_sale?.total_price / 1000000000000000000 + "Ξ"
                    : "mint"}
                </td>
                <td>{floor ? floor + "Ξ" : 0}</td>
                <td>{timeConvert(data?.last_sale?.event_timestamp)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="spliter">
          <div className="lines-1">
            <hr />
            <hr />
          </div>
          <span>Touch Me</span>
          <div className="lines-2">
            <hr />
            <hr />
          </div>
        </div>
        <div className="scial-list">
          <ul className="list-container">
            {appInfos.map((item, index) => (
              <li
                className="list-item"
                onClick={() => handleToAppSchema(item)}
                key={item.id ? item.id + index : index}
              >
                <img src={item.iconUrl} alt="" />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-spliter" onClick={back}>
        <img src={logo} alt="" />
        <span>Turtlecase.xyz</span>
      </div>
    </>
  );
};
export default Socail;
