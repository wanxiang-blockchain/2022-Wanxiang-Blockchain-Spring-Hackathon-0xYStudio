import { Form, Switch, Input, Button } from "antd-mobile";
import { useEffect, useState } from "react";
import { AppGroup, useSubmitAppGroup } from "../../../hooks/useProfile";
type EditAppGroupProps = {
  handleCancle: () => void;
  handleOK: () => void;
  appGroup: AppGroup | null;
};
const EditAppGroup = ({
  handleCancle,
  handleOK,
  appGroup,
}: EditAppGroupProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { status: appGroupSubmitStatus, mutate: submitAppGroupMutate } =
    useSubmitAppGroup();
  const [defaultChecked, setDefaultChecked] = useState<boolean>(
    appGroup ? appGroup.asDefault === 1 : true
  );
  const [name, setName] = useState<string | undefined>(
    appGroup ? appGroup.name : undefined
  );
  /**
   * submit app group to add
   * @method submitAppGroup
   */
  const submitAppGroup = () => {
    let data: AppGroup = appGroup
      ? {
          ...appGroup,
          name,
          asDefault: defaultChecked ? 1 : 0,
        }
      : {
          name,
          asDefault: defaultChecked ? 1 : 0,
        };
    submitAppGroupMutate(data);
  };
  useEffect(() => {
    setLoading(appGroupSubmitStatus === "loading");
    appGroupSubmitStatus === "success" && handleOK();
  }, [appGroupSubmitStatus]);
  return (
    <>
      <Form layout="horizontal">
        <Form.Item
          extra={
            <Switch
              defaultChecked={defaultChecked}
              onChange={(val) => {
                setDefaultChecked(val);
              }}
              style={{
                "--checked-color": "#00b578",
                "--height": "26px",
                "--width": "48px",
              }}
            />
          }
        >
          Default
        </Form.Item>
        <Form.Item label="Group Name" name="name">
          <Input
            placeholder={"set group name"}
            defaultValue={appGroup?.name}
            onChange={(val) => setName(val)}
            value={name}
          />
        </Form.Item>
      </Form>
      <div
        className="btns"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button
          fill="none"
          color="success"
          type="submit"
          onClick={handleCancle}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          color="success"
          fill="none"
          onClick={submitAppGroup}
          loading={loading}
        >
          Done
        </Button>
      </div>
    </>
  );
};
export default EditAppGroup;
