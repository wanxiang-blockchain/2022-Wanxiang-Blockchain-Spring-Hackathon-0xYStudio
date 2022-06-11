import { useState } from "react";
import { Selector, Button } from "antd-mobile";
import { SetOutline } from "antd-mobile-icons";
import { AppGroup, useAppGroup } from "../../../hooks/useProfile";
import EditAppGroup from "./EditAppGroup";
import ManagementGroup from "./ManagementGroup";
const SelectAppGroup = ({ handleCancle, handleOK }) => {
  const [selectAppGroupIds, setSelectAppGroupIds] = useState<number[]>([]);
  const [refreshAppGroups, setRefreshAppGroups] = useState<boolean>(false);
  const { data: appGroupData } = useAppGroup();
  const [currentNode, setCurrentNode] = useState<"select" | "edit" | "setting">(
    "select"
  );
  const [appGroup, setAppGroup] = useState<AppGroup | null>(null);
  let hanlderEditAppGroupModal;
  const handleSelectChange = (val) => {
    if (!val.includes(-1)) {
      setSelectAppGroupIds(val);
    } else {
      setCurrentNode("edit");
    }
  };
  const handleMangementGroup = () => {
    setCurrentNode("setting");
  };
  const handleConfirm = () => {
    let selectGroupsNames: string[] = [];
    appGroupData &&
      appGroupData.appGroupList.forEach((item) => {
        let id = item.id as number;
        let name = item.name as string;
        if (selectAppGroupIds.includes(id)) {
          selectGroupsNames.push(name);
        }
      });
    handleOK(selectAppGroupIds, selectGroupsNames.join(","));
  };
  const handleEditAppGroup = (currentApp) => {
    setAppGroup(currentApp);
    setCurrentNode("edit");
  };
  return (
    <>
      {currentNode === "select" && (
        <>
          <div
            className="settings"
            style={{ textAlign: "right", marginBottom: "10px" }}
            onClick={handleMangementGroup}
          >
            <SetOutline />
            <span style={{ marginLeft: "5px" }}>Settings</span>
          </div>
          <Selector
            columns={2}
            options={
              appGroupData
                ? [
                    ...appGroupData.appGroupOtions,
                    { label: "+ Add Gropu", value: -1 },
                  ]
                : [{ label: "+ Add Gropu", value: -1 }]
            }
            value={selectAppGroupIds}
            onChange={handleSelectChange}
            style={{
              "--checked-border": "#00b578",
              "--checked-text-color": "#00b578",
              fontSize: "13px",
            }}
            multiple={true}
          />
          <div
            className="btns"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button fill="none" color="success" onClick={handleCancle}>
              Cancel
            </Button>
            <Button color="success" fill="none" onClick={handleConfirm}>
              Done
            </Button>
          </div>
        </>
      )}
      {currentNode === "setting" && (
        <>
          <ManagementGroup handleEditAppGroup={handleEditAppGroup} />
        </>
      )}
      {currentNode === "edit" && (
        <>
          <EditAppGroup
            handleCancle={() => hanlderEditAppGroupModal.close()}
            appGroup={appGroup}
            handleOK={() => {
              setRefreshAppGroups(!refreshAppGroups);
              setCurrentNode("select");
            }}
          />
        </>
      )}
    </>
  );
};
export default SelectAppGroup;
