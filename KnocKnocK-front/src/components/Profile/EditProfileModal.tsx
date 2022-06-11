import { FC, useEffect, useState } from "react";
import { Form, Input, Modal, Button, Upload, Select } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { User, useSubmitProfile } from "../../hooks/useProfile";
import { getBase64, dealImageCompression, dataURItoBlob } from "../../utils";
import { resolve } from "path";
import { uploadImg } from "services/api";
interface EditProfileModalProps {
  visible: boolean;
  handleOk: () => void;
  userInfo: User | null;
  account: string;
}
/**
 * edit profile modal
 * EditProfileModal
 * @param {EditProfileModalProps}
 * @return {ReactNode}
 */
const EditProfileModal: FC<EditProfileModalProps> = ({
  visible,
  handleOk,
  userInfo,
  account,
}: EditProfileModalProps) => {
  let [loading, setLoading] = useState<boolean>(false);
  let [avatarUrl, setAvatarUrl] = useState<string>();
  let [profilePic, setProfilePic] = useState<string>("");

  let {
    isLoading: submitLoading,
    isSuccess: success,
    mutate,
  } = useSubmitProfile();

  /**
   * submit userinfo to sever and update info
   * @method handleFinish
   * @param {User} data
   */
  const handleFinish = (data: User) => {
    mutate({
      ...userInfo,
      ...data,
      walletAddress: account,
      profilePic: profilePic
        ? profilePic
        : userInfo
        ? userInfo?.profilePic
        : "",
    });
  };
  useEffect(() => {
    success && handleOk();
  }, [submitLoading, success]);
  const uploadButton = (
    <div>
      {loading ? (
        <LoadingOutlined style={{ color: "#fff" }} />
      ) : (
        <PlusOutlined style={{ color: "#fff" }} />
      )}
      <div style={{ marginTop: 8, color: "#fff" }}>avatar</div>
    </div>
  );

  const handleUploadImg = async ({ file }) => {
    let newFile = await getBase64(file);
    let zipFile = await dealImageCompression(newFile, { quality: 0.5 });
    const fmData = new FormData();
    setAvatarUrl(zipFile);
    fmData.append("file", dataURItoBlob(zipFile));
    setLoading(true);
    uploadImg(fmData).then((res) => {
      setProfilePic(res.url);
      setLoading(false);
      setAvatarUrl(res.url);
    });
    // getBase64(file,(filenew)=>{
    //   return new Promise(resolve=>{
    //     dealImageCompression(filenew,{quality:0.5},(zipFile)=>{
    //        const fmData = new FormData();
    //        setAvatarUrl(zipFile);
    //         fmData.append('file',  dataURItoBlob(zipFile));
    //         setLoading(true);
    //        uploadImg(fmData).then(res=>{
    //          console.log(res.url)
    //          setProfilePic(res.url);
    //          setLoading(false);
    //          setAvatarUrl(res.url);
    //        })
    //    })
    //  })
    // })
  };

  return (
    <>
      <Modal
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
              Profile
            </h1>
            <p>You are about to edit your profile .</p>
          </div>
        }
        visible={visible}
        footer={null}
      >
        {/* <Spin spinning={loading}> */}
        <Form
          className="profile-edit-form"
          onFinish={handleFinish}
          initialValues={{ ...userInfo }}
        >
          <Form.Item>
            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="/api/v2/attachment/upload"
              customRequest={handleUploadImg}
              style={{ textAlign: "center" }}
              headers={{
                Authorization: window.localStorage.getItem("token") || "",
              }}
            >
              {userInfo?.profilePic || avatarUrl ? (
                <img
                  src={avatarUrl ? avatarUrl : userInfo?.profilePic}
                  alt="avatar"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>

          <Form.Item name={"nickName"}>
            <Input placeholder="nickName" />
          </Form.Item>
          <Form.Item name={"bio"}>
            <Input.TextArea rows={3} placeholder="set your brief" />
          </Form.Item>
          <Form.Item>
            <Button
              loading={submitLoading}
              type="primary"
              htmlType="submit"
              shape="round"
              style={{
                width: "100%",
                height: "45px",
                background: "#635adb",
                border: "none",
              }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
        {/* </Spin> */}
      </Modal>
    </>
  );
};
export default EditProfileModal;
