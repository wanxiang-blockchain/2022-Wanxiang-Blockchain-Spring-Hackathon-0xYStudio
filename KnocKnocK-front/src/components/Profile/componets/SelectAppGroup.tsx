import { Select } from "antd";
import { useEffect, useState } from "react";
import { useAppGroup, AppGroup } from "../../../hooks/useProfile";
type SelectAppGroupProps = {
  onSelectGroup: (value: AppGroup[]) => void;

  defaultChecked: any[];
};
const SelectAppGroup = ({
  onSelectGroup,
  defaultChecked,
}: SelectAppGroupProps) => {
  const { data: appGroupData } = useAppGroup();
  const [selectVal, setSelectVal] = useState<Array<any>>([]);

  /**
   * clike event edit select app group list
   * @method handleSelect
   * @param {AppGroup} item
   * @returns {void}
   */
  const handleSelect = (item: AppGroup) => {
    if (selectVal.includes(item.name)) {
      setSelectVal((selectVal) => {
        const newSelectVal = selectVal.filter((val) => val != item.name);
        if (appGroupData) {
          onSelectGroup(
            appGroupData.appGroupList.filter((val) =>
              newSelectVal.includes(val.name)
            )
          );
        }

        return newSelectVal;
      });
    } else {
      setSelectVal((selectVal) => {
        const newSelectVal = [...selectVal, item.name];
        if (appGroupData) {
          onSelectGroup(
            appGroupData.appGroupList.filter((val) =>
              newSelectVal.includes(val.name)
            )
          );
        }

        return newSelectVal;
      });
    }
  };
  useEffect(() => {
    if (defaultChecked.length) {
      setSelectVal((selectVal) => {
        let newSelectVal: any[] = [];
        defaultChecked.forEach((item) => {
          newSelectVal.push(item.name);
        });
        onSelectGroup(defaultChecked);
        return newSelectVal;
      });
    }
  }, [defaultChecked]);

  /**
   * clike event remove select item
   * @method handleDeselect
   * @param {any} value the select value
   * @returns {void}
   */
  const handleDeselect = (value) => {
    setSelectVal((selectVal) => {
      let newSelectVal = selectVal.filter((val) => {
        return val != value;
      });
      if (appGroupData) {
        onSelectGroup(
          appGroupData.appGroupList.filter((val) =>
            newSelectVal.includes(val.name)
          )
        );
      }
      return newSelectVal;
    });
  };

  return (
    <Select
      mode="multiple"
      showArrow
      style={{ width: "100%" }}
      placeholder="select app group"
      value={selectVal}
      menuItemSelectedIcon={null}
      onDeselect={handleDeselect}
    >
      {appGroupData &&
        appGroupData.appGroupList.map((item) => {
          return (
            <Select.Option key={item.id}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  onClick={() => handleSelect(item)}
                  style={{
                    flex: 1,
                    color: selectVal.includes(item.name) ? "#635ad2" : "",
                  }}
                >
                  {item.name}
                </span>
              </div>
            </Select.Option>
          );
        })}
    </Select>
  );
};
export default SelectAppGroup;
