import { useState, useEffect } from "react";
import { Button, Switch, Input, List } from "antd-mobile";
import {
  AppInfo,
  useAppInfo,
  useDeleteApp,
  useInitAppInfo,
  useSubmitAppInfo,
  showConfirmMoal,
} from "../../hooks/useProfile";
import SelectApp from "./components/SelectApp";
import SelectAppGroup from "./components/SelectAppGroup";
const EditAppInfo = ({ handleOk, currentAppInfo }) => {
  const { data: appGroupData } = useAppInfo();
  const [shared, setShared] = useState<boolean>(true);
  const { mutate: deleteAppMutate } = useDeleteApp();
  const [currentNode, setCurrentNode] = useState<
    "appEdit" | "appSelect" | "appGroupSelect"
  >("appEdit");
  const { data: appInfoDetail, mutate: initAppMutate } = useInitAppInfo();

  const [currentSelectAppGroups, setCurrentSelectAppGroups] =
    useState<string>();
  const [appInfo, setAppInfo] = useState<AppInfo>({
    app: undefined,
    name: undefined,
    iconUrl: undefined,
    brief: undefined,
    templateId: undefined,
    url: undefined,
    value: undefined,
    userDefined: 0,
    appGroupIDs: [],
    publicly: 0,
  });
  const { status: submitAppStatus, mutate: appSubmitMutate } =
    useSubmitAppInfo();

  /**
   * set select app info
   * @param selectData
   */
  const handleConfirmSelectApp = (selectData) => {
    setAppInfo({ ...appInfo, ...selectData });
    setCurrentNode("appEdit");
  };
  /**
   * set select app group info
   * @param {number[]} appGroupIDs  selected app group ids array
   * @param {string} currentSelectAppGroups selected app group names  for display
   */
  const handleConfirmSelectAppGroup = (appGroupIDs, currentSelectAppGroups) => {
    setAppInfo({ ...appInfo, appGroupIDs });
    setCurrentSelectAppGroups(currentSelectAppGroups);
    setCurrentNode("appEdit");
  };
  /**
   * open then modal for select a app
   *
   */
  const handleSelectApp = () => {
    setCurrentNode("appSelect");
  };
  /**
   * open then modal for select a app group
   *
   */
  const handleSelectAppGroups = () => {
    setCurrentNode("appGroupSelect");
  };
  const handleSubmitAppinfo = async () => {
    let appInfoData = currentAppInfo
      ? {
          ...currentAppInfo,
          ...appInfo,
          publicly: shared ? 1 : 0,
        }
      : { ...appInfo, publicly: shared ? 1 : 0 };
    setAppInfo(appInfoData);
    await appSubmitMutate(appInfoData);
    handleOk();
  };
  //delete app
  const handleDeleteApp = () => {
    showConfirmMoal(
      "Are you sure you want to delete the app information？",
      async () => {
        await deleteAppMutate({ id: currentAppInfo.id });
        handleOk();
      }
    );
  };
  useEffect(() => {
    if (currentAppInfo && appGroupData) {
      initAppMutate({ appInoList: appGroupData.appInoList, currentAppInfo });
    }
  }, [currentAppInfo, appGroupData]);
  useEffect(() => {
    setAppInfo({ ...appInfo, ...appInfoDetail?.appInfoDetail });
    setCurrentSelectAppGroups(appInfoDetail?.currentSelectAppGroups);
  }, [appInfoDetail]);

  return (
    <div>
      <div className="modal-title">
        {currentNode !== "appEdit" && (
          <span className="back" onClick={() => setCurrentNode("appEdit")}>
            &lt;&nbsp;&nbsp;Back
          </span>
        )}
        <span className="modal-title-content">
          {currentNode === "appGroupSelect" ? "Set Group." : "Set app."}
        </span>
      </div>
      {currentNode === "appEdit" && (
        <>
          {appInfo.userDefined === 1 && (
            <List.Item
              extra={
                <Input
                  placeholder="set your app Name"
                  key={appInfo.app ? "notLoadedYet" : "loaded"}
                  defaultValue={appInfo.app}
                  onChange={(val) => setAppInfo({ ...appInfo, app: val })}
                />
              }
            >
              App
            </List.Item>
          )}
          {appInfo.userDefined === 0 && (
            <List.Item
              extra={appInfo.app || "Select App"}
              arrow
              onClick={handleSelectApp}
            >
              App
            </List.Item>
          )}
          <List.Item
            extra={
              <Input
                placeholder={"set your name" + appInfo.name}
                key={appInfo.name ? "notLoadedYet" : "loaded"}
                value={appInfo.name}
                onChange={(val) => setAppInfo({ ...appInfo, name: val })}
              />
            }
          >
            Name
          </List.Item>
          <List.Item
            extra={
              <Input
                placeholder={appInfo.value ? appInfo.value : "set your account"}
                key={appInfo.value ? "notLoadedYet" : "loaded"}
                value={appInfo.value}
                onChange={(val) => setAppInfo({ ...appInfo, value: val })}
              />
            }
          >
            Account
          </List.Item>
          <List.Item
            extra={
              currentSelectAppGroups
                ? currentSelectAppGroups
                : "Select AppGroups"
            }
            arrow
            onClick={handleSelectAppGroups}
          >
            Groups
          </List.Item>
          <List.Item
            extra={
              <Switch
                defaultChecked={
                  currentAppInfo ? currentAppInfo.publicly === 1 : true
                }
                onChange={(val) => {
                  setShared(val);
                }}
                style={{
                  "--checked-color": "#00b578",
                  "--height": "26px",
                  "--width": "48px",
                }}
              />
            }
          >
            Shared
          </List.Item>

          <Button
            block
            color="success"
            size="middle"
            onClick={handleSubmitAppinfo}
            loading={submitAppStatus === "loading"}
          >
            Done
          </Button>
          {currentAppInfo && (
            <Button
              style={{ marginTop: "10px" }}
              block
              size="middle"
              color="danger"
              onClick={handleDeleteApp}
            >
              Delete
            </Button>
          )}
        </>
      )}
      {currentNode === "appGroupSelect" && (
        <SelectAppGroup
          handleCancle={() => {
            setCurrentNode("appEdit");
          }}
          handleOK={handleConfirmSelectAppGroup}
        />
      )}
      {currentNode === "appSelect" && (
        <SelectApp
          handleCancle={() => setCurrentNode("appEdit")}
          appOptions={appGroupData?.appOptions}
          appInoList={appGroupData?.appInoList}
          handleOk={handleConfirmSelectApp}
        />
      )}
    </div>
  );
};
export default EditAppInfo;
