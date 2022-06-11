import { useLookupAddress, shortenAddress } from "@usedapp/core";
import { notification } from "antd";
import { useEffect, useState, FC } from "react";
import { useNavigate } from "react-router";
import { EditOutlined } from "@ant-design/icons";
import { useEthers } from "@usedapp/core";
import Footer from "../Footer";

import "./index.css";

import { getProfile } from "../../services/api";
import EditProfileModal from "./EditProfileModal";
import EditApp from "./EditApp";
import EditAppGroup from "./EditAppGroup";
import { useUserInfo } from "hooks/useProfile";
import { useAccountTolowercase } from "hooks/useAccountTolowercase";

const Profile: FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<any>();
  const [viseableEdit, setViseableEdit] = useState(false);
  const [isAppOpen, setIsAppOpen] = useState(false);
  const profileQuery = useUserInfo();
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const toggleApp = () => {
    setIsAppOpen(!isAppOpen);
  };
  const { account } = useEthers();

  const ens = useLookupAddress();
  const openNotification = (placement) => {
    notification.info({
      message: <p style={{ fontWeight: 800 }}>Connect Wallet</p>,
      description: (
        <p style={{ fontWeight: 800 }}>Please connect your wallet</p>
      ),
      placement,
      duration: 3,
    });
  };
  const showWarning = () => {
    openNotification("topRight");
  };
  const get_profile = async () => {
    let userProfile: any;
    await getProfile(account).then((res) => {
      userProfile = res?.result?.profile;
    });
    setProfile(userProfile);
  };
  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      get_profile();
    } else {
      showWarning();
      //When the wallet is not logged in, jump back to the home page and clear the token
      //  window.localStorage.clear();
      navigate("/", { replace: true });
    }
  }, [account]);
  /**
   * set EditMoal visable
   * @method handleShowEditModal
   * @param
   * @returns {void}
   */
  const handleShowEditModal = () => {
    setViseableEdit(true);
  };

  return (
    <div className="profile-container" id="profile">
      <div className="card-container">
        <div className="profile-card">
          <div className="card-header">
            <div className="pic">
              {profileQuery.data && profileQuery.data.profilePic && (
                <img
                  onClick={handleShowEditModal}
                  src={profileQuery.data.profilePic}
                />
              )}
            </div>
            <div className="name">
              {account ? ens ?? shortenAddress(account) : null}
            </div>
            <div className="desc">
              {profileQuery.data ? (
                profileQuery.data.nickName
              ) : (
                <p>Not a turtle </p>
              )}
              <EditOutlined
                style={{ color: "#01bf71", cursor: "pointer" }}
                onClick={handleShowEditModal}
              />
            </div>
            <EditAppGroup />
            <EditApp></EditApp>
          </div>
          <div className="card-footer">
            <div className="numbers">
              <div className="item">
                <span>
                  {profile ? (
                    `${profile.count} Ξ`
                  ) : (
                    <p style={{ fontSize: "0.5rem" }}>not a turtle</p>
                  )}
                </span>
                Rewards
              </div>
              <div className="border"></div>
              <div className="item">
                <span>
                  {profile ? (
                    profile.invite
                  ) : (
                    <p style={{ fontSize: "0.5rem" }}>not a turtle</p>
                  )}
                </span>
                Member Id
              </div>
              <div className="border"></div>
              <div className="item">
                <span>
                  {profile ? (
                    profile.son
                  ) : (
                    <p style={{ fontSize: "0.5rem" }}>not a turtle</p>
                  )}
                </span>
                Invites
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "100px", width: "100%" }}>
        <Footer />
      </div>
      {account && (
        <EditProfileModal
          visible={viseableEdit}
          handleOk={() => {
            setViseableEdit(false);
            // setRefreshProfile(!refreshProfile);
          }}
          userInfo={profileQuery.data}
          account={account}
        ></EditProfileModal>
      )}
    </div>
  );
};
export default Profile;
