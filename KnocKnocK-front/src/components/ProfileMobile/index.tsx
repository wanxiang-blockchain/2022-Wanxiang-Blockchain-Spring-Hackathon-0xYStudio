import { useLookupAddress, shortenAddress } from "@usedapp/core";
import useMobileCompare from "../../hooks/useMobileCompare";

import { AddOutline } from "antd-mobile-icons";
import { Modal, Swiper, NavBar, Dialog } from "antd-mobile";
import EditAppInfo from "./EditAppInfo";
import { useUserInfo, useAppInfoByuser, AppInfo } from "../../hooks/useProfile";
import EditProfile from "./EditProfile";
import { getProfile } from "../../services/api";
import { RiEditBoxLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, Fragment, useRef } from "react";
import useLongPress from "./../../hooks/useLongPress";
import { useEthers } from "@usedapp/core";
import logo from "assets/images/logo.png";
import "./index.scss";
const ProfileMobile = () => {
  const [visebleAppEdit, setVisebleAppEdit] = useState<boolean>(false);
  const [visebleProfileEdit, setVisebleProfileEdit] = useState<boolean>(false);
  const { data: appInoList } = useAppInfoByuser();
  const { data: userInfo } = useUserInfo();
  const [profile, setProfile] = useState<any>();
  const [showEditIcon, setShowEditIcon] = useState<boolean>(false);
  const currentApp = useRef<AppInfo | null>(null);
  const { account } = useEthers();
  const ens = useLookupAddress();
  const navigate = useNavigate();
  const defaultOptions = {
    shouldPreventDefault: false,
    delay: 500,
  };
  const onLongPress = () => {
    setShowEditIcon(true);
  };
  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      get_profile();
    } else {
      Dialog.show({
        content: "please connect wallet!",
        closeOnAction: true,
        actions: [
          {
            key: "sure",
            text: "Ok",
            onClick: () => {
              window.localStorage.removeItem("token");
              window.localStorage.setItem("iswalletAccount", "false");
              navigate("/", { replace: true });
            },
          },
        ],
      });
      //When the wallet is not logged in, jump back to the home page and clear the token
    }
  }, [account]);
  const longPressEvent = useLongPress(onLongPress, () => {}, defaultOptions);
  /**
   * add a app
   * @method handleAddApp
   */
  const handleAddApp = (appInfo) => {
    currentApp.current = appInfo;
    setVisebleAppEdit(true);
  };
  /**
   * edit profile info
   * @method handleEditProfile
   */
  const handleEditProfile = () => {
    setShowEditIcon(false);
    setVisebleProfileEdit(true);
  };
  /**
   * get v1 profile info
   * @method get_profile
   */
  const get_profile = async () => {
    let userProfile: any;
    await getProfile(account).then((res) => {
      userProfile = res?.result?.profile;
    });
    setProfile(userProfile);
  };
  const handleEditApp = (appInfo) => {
    handleAddApp(appInfo);
  };
  const back = () => {
    window.history.back();
  };
  /**
   * compare mobile client
   */
  useMobileCompare(375);
  return (
    <div
      className="profile-container"
      onClick={(e) => {
        e.preventDefault();
        setShowEditIcon(false);
      }}
    >
      <NavBar onBack={back} style={{ width: "100%" }}>
        Profile
      </NavBar>
      <div className="avater" onClick={handleEditProfile}>
        {userInfo && userInfo.profilePic && (
          <img src={userInfo.profilePic} alt="" />
        )}
      </div>
      <p className="user-desc">
        {account ? ens ?? shortenAddress(account) : null}
      </p>
      <div className="account-info">
        <p className="ower-name">
          <span>
            {userInfo ? userInfo.nickName : <span>Not a turtle </span>}
          </span>
        </p>
        <table>
          <thead>
            <tr>
              <th>REWARDS</th>
              <th>MEMBER ID</th>
              <th>INVITES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> {profile ? `${profile.count} Ξ` : "not a turtle"}</td>
              <td> {profile ? profile.invite : "not a turtle"}</td>
              <td>{profile ? profile.son : "not a turtle"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="spliter">Touch Me</div>
      <div className="scial-list">
        <Swiper>
          {appInoList &&
            appInoList.map((appList, index) => (
              <Swiper.Item key={index}>
                <ul className="list-container" {...longPressEvent}>
                  {appList.map((item) => {
                    return (
                      <Fragment key={item ? item.id : "null"}>
                        {item ? (
                          <li className="list-item">
                            {showEditIcon && (
                              <div
                                onClick={() => handleEditApp(item)}
                                style={{
                                  textAlign: "center",
                                  padding: "0px 2px",
                                  borderRadius: "50%",
                                  position: "absolute",
                                  background: "#fff",
                                  left: "15px",
                                  top: "2px",
                                }}
                              >
                                <RiEditBoxLine
                                  style={{ color: "#666", fontWeight: "bold" }}
                                />
                              </div>
                            )}
                            <img src={item?.iconUrl || logo} alt="" />
                            <span>{item?.name}</span>
                          </li>
                        ) : (
                          <li
                            className="list-item add"
                            onClick={() => handleAddApp(null)}
                          >
                            <div>
                              <AddOutline
                                color="#241e1e"
                                fontSize={26}
                                fontWeight={"800"}
                              />
                            </div>
                            <span>Add apps</span>
                          </li>
                        )}
                      </Fragment>
                    );
                  })}
                </ul>
              </Swiper.Item>
            ))}
        </Swiper>
      </div>
      <div className="footer-spliter">
        <img src={logo} alt="" />
        <span>Turtlecase.xyz</span>
      </div>

      <Modal
        visible={visebleAppEdit}
        onClose={() => setVisebleAppEdit(false)}
        content={
          <EditAppInfo
            currentAppInfo={currentApp.current}
            handleOk={() => setVisebleAppEdit(false)}
          />
        }
        showCloseButton={true}
        actions={[]}
      />
      <Modal
        visible={visebleProfileEdit}
        onClose={() => setVisebleProfileEdit(false)}
        title={
          <div className="modal-title">
            <span className="modal-title-content">Set Profile.</span>
          </div>
        }
        content={
          userInfo && (
            <EditProfile
              handleOk={() => {
                setVisebleProfileEdit(false);
              }}
              userInfo={userInfo}
            />
          )
        }
        showCloseButton={true}
        actions={[]}
      />
    </div>
  );
};
export default ProfileMobile;
