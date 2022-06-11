import { FC, useEffect, useState, Fragment } from "react";
import { Input, Modal, Button, Row, Col, Popover, Checkbox } from "antd";
import SelectAppGroup from "./componets/SelectAppGroup";
import SelectApp from "./componets/SelectApp";
import {
  EditOutlined,
  PlusOutlined,
  MinusCircleFilled,
} from "@ant-design/icons";
import { SetOutline } from "antd-mobile-icons";
import {
  AppGroup,
  AppInfo,
  useSubmitAppInfo,
  useInitAppInfo,
  useAppInfo,
  useAppInfoByuser,
  useDeleteApp,
  showConfirmMoal,
} from "../../hooks/useProfile";
const EditApp = () => {
  const { data: appInfoData } = useAppInfo();
  const [visble, setVisble] = useState<boolean>(false);
  const { data: appInoListUser } = useAppInfoByuser();
  const [appGroupsChecked, setAppGroupsChecked] = useState<AppGroup[]>([]);
  const [appChecked, setAppChecked] = useState<any>();
  const [appIconUrl, setAppIconUrl] = useState<string>("");
  const [app, setApp] = useState<string>("");
  const [appTemplate, setAppTemplate] = useState<any>();
  const [selectAppGroups, setSelectAppGroups] = useState<number[]>();
  const [submitbtnLoading, setSubmitbtnLoading] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [currentAppInfo, setCurrentAppInfo] = useState<AppInfo | null>();
  const { status: deletAppStatus, mutate: appDeletMutate } = useDeleteApp();
  const [shared, setIsShared] = useState<boolean>(true);
  const { data: appDataDetail, mutate: appDetailDataMutate } = useInitAppInfo();
  const [appName, setAppName] = useState<string>();
  const [appValue, setAppValue] = useState<string>();
  const [appBio, setAppBio] = useState<string>();
  const { status: submitAppStatus, mutate: appSubmitMutate } =
    useSubmitAppInfo();
  const handleOk = () => {
    setVisble(false);
  };
  /**
   * submit  app info  to server
   * @method handleSubmitApp
   * @param {object} data form data
   * @returns {void}
   */
  const handleSubmitApp = () => {
    let appInfo: AppInfo = {
      ...currentAppInfo,
      templateId: appTemplate,
      appGroupIDs: selectAppGroups,
      iconUrl: appIconUrl || currentAppInfo?.iconUrl,
      brief: appBio,
      name: appName,
      value: appValue,
      publicly: shared ? 1 : 0,
      app,
    };
    //   setAppInfo(appInfo);
    if (!appInfo.value || !appInfo.templateId) {
      showConfirmMoal(
        "Please select app and enter your account number！ ",
        () => {},
        false
      );
      return;
    }
    appSubmitMutate(appInfo);
  };
  /**
   * select app group infos
   * @method handleSelectGroup
   * @param {any[]} selectItmes
   * @returns {void}
   */
  const handleSelectGroup = (selectItmes: any[]) => {
    setSelectAppGroups(
      selectItmes.map((item) => {
        return item.id;
      })
    );
  };
  /**
   * edit or view app info
   * @method handleEditApp
   * @param {number|undefined} id app id
   * @returns {void}
   */
  const handleEditApp = (item: AppInfo) => {
    appDetailDataMutate({
      currentAppInfo: item,
      appInoList: appInfoData ? appInfoData.appInoList : [],
    });
    setVisble(true);
    setCurrentAppInfo(item);
  };

  /**
   * get the app templateid  when select app template
   * @method handleSelectApp
   * @param {string} selectAppItem  selected template id
   * @returns {void}
   */
  const handleSelectApp = (selectAppItem) => {
    setAppName(selectAppItem.name);
    setAppTemplate(selectAppItem.id);
    setAppIconUrl(selectAppItem.iconUrl);
    setApp(selectAppItem.name);
  };
  const handleAddApp = () => {
    setVisble(true);
    setAppGroupsChecked([]);
    setAppChecked([]);
    setApp("");
    setAppBio("");
    setAppIconUrl("");
    setAppName("");
    setAppValue("");
    setAppTemplate("");
    setSelectAppGroups([]);
    //setCurrentAppId(undefined);
    setCurrentAppInfo(null);
  };
  const handleDeletApp = (id: number | undefined) => {
    if (id) {
      showConfirmMoal(
        "Are you sure you want to delete the app information？",
        () => {
          appDeletMutate({ id });
        }
      );
    }
  };
  //when component did mounted load app info
  useEffect(() => {
    if (submitAppStatus) {
      setSubmitbtnLoading(submitAppStatus === "loading");
      setIsSubmit(submitAppStatus === "loading");
      if (submitAppStatus === "success" && isSubmit) {
        handleOk();
      }
    }
    if (appDataDetail?.appInfoDetail) {
      setAppName(appDataDetail.appInfoDetail.name);
      setAppBio(appDataDetail.appInfoDetail.brief);
      setAppValue(appDataDetail.appInfoDetail.value);
      setAppIconUrl(appDataDetail.appInfoDetail.iconUrl);
      setAppTemplate(appDataDetail.appInfoDetail.templateId);
      setIsShared(appDataDetail.appInfoDetail.publicly === 1);
      if (appDataDetail.appInfoDetail.appGroups) {
        setAppGroupsChecked(appDataDetail.appInfoDetail.appGroups);
        setSelectAppGroups(
          appDataDetail.appInfoDetail.appGroups.map((item) => item.id)
        );
      }
      if (appDataDetail.appInfoDetail.templateId) {
        setAppChecked(appDataDetail.appInfoDetail.templateId);
      }
    }
  }, [submitAppStatus, appDataDetail, deletAppStatus]);
  return (
    <>
      <div className="social-headr">Social Contacts</div>

      {appInoListUser?.map((app, indexApplist) => {
        return (
          <div className="social-conatiner" key={indexApplist}>
            <ul className="social-list" key={indexApplist}>
              {app.map((item, i) => {
                return (
                  <Fragment key={item?.id || "null" + i}>
                    {item ? (
                      <Popover
                        placement="rightBottom"
                        content={
                          <>
                            <ul className="app-menues">
                              <li onClick={() => handleEditApp(item)}>
                                <EditOutlined /> Edit
                              </li>
                              <li onClick={() => handleDeletApp(item.id)}>
                                <MinusCircleFilled /> Delete
                              </li>
                            </ul>
                          </>
                        }
                        title={
                          <div style={{ display: "flex" }}>
                            <SetOutline
                              style={{
                                fontSize: "17px",
                                position: "relative",
                                top: "3px",
                              }}
                            />{" "}
                            <span style={{ fontWeight: 600 }}>Setting</span>
                          </div>
                        }
                        trigger="hover"
                      >
                        <li>
                          <img src={item.iconUrl ? item.iconUrl : ""} alt="" />
                          <span>{item.name}</span>
                        </li>
                      </Popover>
                    ) : (
                      <>
                        {i === 0 ? (
                          <li className="plus-img">
                            <PlusOutlined
                              style={{
                                color: "#01bf71",
                                fontSize: "20px",
                                minHeight: "60px",
                                lineHeight: "60px",
                              }}
                              onClick={handleAddApp}
                            />
                          </li>
                        ) : (
                          <li className="plus-img">
                            <PlusOutlined
                              style={{
                                color: "#01bf71",
                                fontSize: "20px",
                                minHeight: "60px",
                                lineHeight: "60px",
                              }}
                              onClick={handleAddApp}
                            />
                          </li>
                        )}
                      </>
                    )}
                  </Fragment>
                );
              })}
            </ul>
          </div>
        );
      })}
      <Modal
        getContainer={false}
        centered
        wrapClassName={"update-panel"}
        closable
        onCancel={handleOk}
        title={
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "2rem",
                paddingTop: "1rem",
                color: "white",
              }}
            >
              Add social platform
            </h1>
            <p>You are about to add social platform.</p>
          </div>
        }
        visible={visble}
        footer={null}
      >
        {/* <Spin spinning={loading}> */}
        <div className="profile-edit-form">
          <Row style={{ marginBottom: "10px" }}>
            <Col span={24}>
              <SelectAppGroup
                onSelectGroup={handleSelectGroup}
                defaultChecked={appGroupsChecked}
              />
            </Col>
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            <Col span={24}>
              <SelectApp
                onSelectApp={handleSelectApp}
                appInoList={appInfoData?.appInoList}
                defaultChecked={appChecked}
              />
            </Col>
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            <Col span={24}>
              <Input
                placeholder={"set display name"}
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
              ></Input>
            </Col>
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            <Col span={24}>
              <Input
                placeholder={"set your account"}
                value={appValue}
                onChange={(e) => setAppValue(e.target.value)}
              ></Input>
            </Col>
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            <Col span={24}>
              <Input.TextArea
                rows={3}
                placeholder="set your app  brief"
                value={appBio}
                onChange={(e) => setAppBio(e.target.value)}
              />
            </Col>
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            <Col>
              <div>
                <span style={{ color: "#fff", marginRight: "10px" }}>
                  Shared:
                </span>
                <Checkbox
                  checked={shared}
                  onChange={(e) => {
                    setIsShared(e.target.checked);
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            <Col span={24}>
              <Button
                type="primary"
                htmlType="submit"
                shape="round"
                loading={submitbtnLoading}
                onClick={handleSubmitApp}
                style={{
                  height: "40px",
                  marginLeft: "5%",
                  background: "#635adb",
                  border: "none",
                  width: "90%",
                }}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};
export default EditApp;
