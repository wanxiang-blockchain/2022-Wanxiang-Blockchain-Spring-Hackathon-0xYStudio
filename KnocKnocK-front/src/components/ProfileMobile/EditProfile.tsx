import { useEffect, useState } from "react";
import { Button, Input, ImageUploader, Form } from "antd-mobile";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import { User, useSubmitProfile } from "../../hooks/useProfile";
import { getBase64, dealImageCompression, dataURItoBlob } from "../../utils";
import { uploadImg } from "../../services/api";
type EditProfileProps = {
  handleOk: () => void;
  userInfo: User | null;
};
const EditProfile = ({ handleOk, userInfo }: EditProfileProps) => {
  const maxCount = 1;
  const url = userInfo?.profilePic as string;
  const [fileList, setFileList] = useState<ImageUploadItem[]>([{ url }]);
  const [user, setUser] = useState<User | null>(userInfo);
  const {
    isLoading: submitLoading,
    isSuccess: success,
    mutate: submitProfileMutate,
  } = useSubmitProfile();
  /**
   * upadate user info
   * @method handleUpdateUser
   */
  const handleUpdateUser = () => {
    submitProfileMutate({ ...user, profilePic: fileList[0].url });
  };
  useEffect(() => {
    success && handleOk();
  }, [submitLoading, success]);
  return (
    <div>
      <Form layout="horizontal">
        <Form.Item
          extra={
            <ImageUploader
              style={{
                "--cell-size": "50px",
              }}
              preview={false}
              value={fileList}
              onChange={setFileList}
              maxCount={maxCount}
              upload={async (file) => {
                let newFile = await getBase64(file);
                let zipFile = await dealImageCompression(newFile, {
                  quality: 0.5,
                });
                const formData = new FormData();
                formData.append("file", dataURItoBlob(zipFile));
                return uploadImg(formData);
              }}
            />
          }
        >
          avatar
        </Form.Item>
        <Form.Item
          extra={
            <Input
              defaultValue={user?.nickName || ""}
              onChange={(nickName) => setUser({ ...user, nickName })}
            />
          }
        >
          nickName
        </Form.Item>
        <Form.Item
          extra={
            <Input
              defaultValue={user?.bio || ""}
              onChange={(bio) => setUser({ ...user, bio })}
            />
          }
        >
          brief
        </Form.Item>
      </Form>

      <Button
        block
        color="success"
        size="middle"
        onClick={handleUpdateUser}
        loading={submitLoading}
      >
        Done
      </Button>
    </div>
  );
};
export default EditProfile;
