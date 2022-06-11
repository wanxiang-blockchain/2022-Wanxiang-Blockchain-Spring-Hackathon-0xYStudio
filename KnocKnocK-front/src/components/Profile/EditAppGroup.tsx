import { useState } from "react";
import { Form, Input, Modal, Button, Switch } from "antd";
import {
  EditOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  AppGroup,
  showConfirmMoal,
  useAppGroup,
  useDeleteAppGroup,
  useSubmitAppGroup,
} from "../../hooks/useProfile";

const EditAppGroup = () => {
  const [visible, setVisble] = useState<boolean>(false);
  const [currentAppGroup, setCurrentAppGroup] = useState<AppGroup | null>(null);
  const { data: appGroupData } = useAppGroup();
  const { mutate: deletAppGroupMutate } = useDeleteAppGroup();
  let { status: submitStatus, mutate: appGroupSubmitMutate } =
    useSubmitAppGroup();
  const handleOk = () => {
    setVisble(false);
  };
  /**sumbit app data to server
   * @method handleFinish
   * @param {AppGroup} data
   * @returns {void}
   */
  const handleFinish = async (data) => {
    await appGroupSubmitMutate({
      ...currentAppGroup,
      ...data,
      asDefault: data.asDefault ? 1 : 0,
    });
    setVisble(false);
  };
  const handleEditAppGroup = (item: AppGroup | null) => {
    console.log(item);
    setCurrentAppGroup(item);
    setVisble(true);
  };
  const handleDeletAppGroup = (item: AppGroup) => {
    showConfirmMoal(
      "Are you sure you want to delete the grouping information？",
      () => {
        deletAppGroupMutate({ id: item.id });
      }
    );
  };
  return (
    <>
      <div className="social-headr">Name Cards</div>
      <ul className="appgroup-list">
        {appGroupData &&
          appGroupData.appGroupList.map((item) => (
            <li key={item.id}>
              <div className="appgroup-tag">{item.name}</div>
              <div className="appgroup-mask">
                <MinusCircleOutlined
                  onClick={() => handleDeletAppGroup(item)}
                />
                <EditOutlined onClick={() => handleEditAppGroup(item)} />
              </div>
            </li>
          ))}
        <li onClick={() => handleEditAppGroup(null)}>
          <div className="appgroup-tag">
            <PlusOutlined
              style={{
                color: "#01bf71",
                fontSize: "20px",
                minHeight: "60px",
                lineHeight: "60px",
              }}
            />
          </div>
        </li>
      </ul>
      <Modal
        centered
        wrapClassName={"update-panel"}
        closable
        title={
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "2rem",
                paddingTop: "1rem",
                color: "white",
              }}
            >
              Edit app group
            </h1>
            {/* <p>You are about to add app group.</p> */}
          </div>
        }
        visible={visible}
        footer={null}
        onCancel={handleOk}
      >
        {/* <Spin spinning={loading}> */}
        <Form onFinish={handleFinish} initialValues={{ ...currentAppGroup }}>
          <Form.Item name={"name"} label="Group">
            <Input placeholder="group" style={{ width: "80%" }} />
          </Form.Item>
          <Form.Item name="asDefault" valuePropName="checked" label="Activate">
            <Switch style={{ border: "1px solid #fff" }} />
          </Form.Item>

          <Form.Item>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                loading={submitStatus === "loading"}
                type="primary"
                htmlType="submit"
                shape="round"
                style={{
                  width: "50%",
                  background: "#635adb",
                  height: "40px",
                  border: "none",
                }}
              >
                submit
              </Button>
            </div>
          </Form.Item>
        </Form>
        {/* </Spin> */}
      </Modal>
    </>
  );
};
export default EditAppGroup;
