import { MinusCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import { RiEditBoxLine, RiOrderPlayLine } from "react-icons/ri";
import {
  useAppGroup,
  useDeleteAppGroup,
  showConfirmMoal,
} from "../../../hooks/useProfile";
const ManagementGroup = ({ handleEditAppGroup }) => {
  const { data: appGroupData } = useAppGroup();
  const { mutate: deletAppGroup } = useDeleteAppGroup();
  const handleDeletAppGroup = (item) => {
    showConfirmMoal(
      "Are you sure you want to delete the grouping information？",
      () => {
        deletAppGroup({ id: item.id });
      }
    );
  };
  return (
    <>
      <ul className="managementGroups-heander">
        <li>Groups</li>
        <li>Rename</li>
        <li>Order</li>
      </ul>
      {appGroupData &&
        appGroupData.appGroupList.map((item) => (
          <ul className="managementGroups-items" key={item?.id}>
            <li onClick={() => handleDeletAppGroup(item)}>
              <MinusCircleFilled
                style={{ paddingRight: "8px", color: "#888", fontSize: "16px" }}
              />
              {item.name}
            </li>
            <li onClick={() => handleEditAppGroup(item)}>
              <RiEditBoxLine size={16} color="#999" />
            </li>
            <li>
              <RiOrderPlayLine size={16} color="#999" />
            </li>
          </ul>
        ))}
      <ul className="managementGroups-items">
        <li>
          <PlusCircleFilled
            style={{ color: "#ccc", fontSize: "16px", paddingRight: "8px" }}
          />
          <span style={{ color: "#ccc" }}>New Group</span>
        </li>
      </ul>
    </>
  );
};
export default ManagementGroup;
