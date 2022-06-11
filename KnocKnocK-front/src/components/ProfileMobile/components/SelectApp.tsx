import { useState } from "react";
import { Button, PickerView } from "antd-mobile";
import { PickerValue } from "antd-mobile/es/components/picker-view";
const SelectApp = ({ handleOk, handleCancle, appInoList, appOptions }) => {
  const [currentSelectApp, setCurrentSelectApp] = useState<PickerValue[]>([]);
  const handleConfirmSelectApp = () => {
    const templateId = Number(currentSelectApp[0]);
    appInoList.forEach((element) => {
      if (element.id === templateId) {
        handleOk({
          app: element.name,
          iconUrl: element.iconUrl,
          name: element.name,
          templateId,
        });
      }
    });
  };
  return (
    <>
      <PickerView
        columns={[appOptions]}
        onChange={(value) => {
          setCurrentSelectApp(value);
        }}
      ></PickerView>
      <div
        className="btns"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button fill="none" color="success" onClick={handleCancle}>
          Cancel
        </Button>
        <Button color="success" fill="none" onClick={handleConfirmSelectApp}>
          Done
        </Button>
      </div>
    </>
  );
};

export default SelectApp;
