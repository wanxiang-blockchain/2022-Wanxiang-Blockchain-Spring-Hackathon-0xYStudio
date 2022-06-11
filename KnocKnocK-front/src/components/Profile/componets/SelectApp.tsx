import { useEffect, useState } from "react";
import { Select } from "antd";

/**
 * Drop down list component used to select app
 * @param
 * @returns {ReactNode}
 */
const SelectApp = ({ onSelectApp, appInoList, defaultChecked }) => {
  const [selectedItems, setSelectedItems] = useState<number>();
  const handleChange = (selectedItems) => {
    setSelectedItems(selectedItems);
    onSelectApp(appInoList.filter((item) => item.id === selectedItems)[0]);
  };
  useEffect(() => {
    if (defaultChecked) {
      setSelectedItems(defaultChecked);
    }
  }, [defaultChecked]);
  return (
    <>
      <Select
        placeholder="app"
        value={selectedItems}
        key={defaultChecked ? "notLoadedYet" : "loaded"}
        onChange={handleChange}
        style={{ width: "100%" }}
      >
        {appInoList.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};
export default SelectApp;
