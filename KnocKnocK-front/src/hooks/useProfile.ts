import { Modal } from "antd-mobile";
import { notification } from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getUserInfo,
  getAppList,
  getAppGroupList,
  getAppListByUser,
  updateUser,
  deleteAppInfo,
  getAppInfoById,
  updateDataApp,
  addApp,
  updateAppGroup,
  addAppGroupList,
  deleteAppGroup,
  preLogin,
  login,
  logout,
} from "../services/api";
import { useState, useEffect } from "react";

export type User = {
  profilePic?: string; //avater
  memberID?: string; //accout no
  nickName?: string;
  bio?: string; //Personal description
  walletAddress?: string;
};
export type AppInfo = {
  id?: number;
  app: string | undefined;
  name?: string | undefined;
  brief?: string | undefined;
  value: string | undefined;
  url?: string | undefined;
  userDefined?: 1 | 0;
  appGroupIDs?: number[];
  memberID?: string;
  templateId?: number;
  iconUrl?: string;
  publicly?: 0 | 1;
};
export type AppGroup = {
  id?: number;
  name: string | undefined;
  brief?: string;
  accountNo?: string;
  asDefault: 0 | 1; //Default: 1 yes 0 no
  memberID?: string;
};
const setAppInfoPages = (data: AppInfo[]) => {
  let result: (AppInfo | null)[][] = [];
  for (let i = 0; i < Math.ceil(data.length / 6); i++) {
    let apppageInfro = data.slice(i * 6, (i + 1) * 6);
    result.push(apppageInfro);
  }
  if (result.length >= 1) {
    if (result[result.length - 1].length === 6) {
      result.push([null]);
    } else {
      result[result.length - 1].push(null);
    }
  } else {
    result[0] = [null];
  }
  return result;
};

export const showConfirmMoal = (
  msg: string,
  callback?: () => void,
  showCancle = true
) => {
  let handlerModal = Modal.show({
    title: "Warning",
    content: msg,
    actions: showCancle
      ? [
          {
            key: "cancle",
            text: "Cancle",
            style: { color: "#00b578" },
            onClick: () => {
              handlerModal.close();
            },
          },
          {
            key: "confirm",
            text: "Yes",
            style: { color: "red" },
            onClick: () => {
              handlerModal.close();
              callback && callback();
            },
          },
        ]
      : [
          {
            key: "confirm",
            text: "Yes",
            style: { color: "red" },
            onClick: () => {
              handlerModal.close();
              callback && callback();
            },
          },
        ],
  });
};
export type ServerStatus = "success" | "cancle" | "fail" | "loading";
/**
 * hooks use get userInfo
 * @method useUserInfo
 * @param {boolean} refreshProfile
 * @return {{ userIn:User, setUserInfo:()=>void }}
 */
export const useUserInfo = () => {
  const profileQuery = useQuery("profile", async () => {
    const response = await getUserInfo();
    if (response?.success) {
      return response.data;
    } else {
      notification.error({
        message: response?.message,
        duration: 2,
      });
    }
  });
  return profileQuery;
};
/**
 * submit userinfo to sever and update info
 * @method useSubmitProfile
 * @param {User} data
 */
export const useSubmitProfile = () => {
  const queryClient = useQueryClient();
  const oldData = queryClient.getQueryData("profile");

  const profileMutation = useMutation(updateUser, {
    onMutate: (data) => {
      queryClient.setQueryData("profile", data);
    },
    onError: () => {
      queryClient.setQueryData("profile", oldData);
    },
  });
  return profileMutation;
};

/**
 * hooks use get app list by user
 * @method useAppInfo
 * @param
 * @return {{ appInoList:<Array<AppInfo> }}
 */
export const useAppInfo = () => {
  const appInfoListQuery = useQuery("appinfoList", async () => {
    let res = await getAppList();
    if (res?.success) {
      let data = res.data as Array<AppInfo>;
      let options: Array<{ label: string; value: string; key?: string }> = [];
      data.forEach((item) => {
        let label = item.name as string;
        let value = item.id?.toString() as string;
        options.push({ label, value, key: value });
      });
      return { appInoList: data, appOptions: options };
    } else {
      notification.error({
        message: res?.message,
        duration: 2,
      });
    }
  });
  return appInfoListQuery;
};
/**
 * hooks use get app list by user
 * @method useAppInfo
 * @param
 * @return {{ appInoList:Array<Array<AppInfo | null> }}
 */
export const useAppInfoByuser = () => {
  const appInfoListByUserQuery = useQuery<(AppInfo | null)[][]>(
    "appinfoListbyUser",
    async () => {
      let res = await getAppListByUser();
      let result: (AppInfo | null)[][] = [];
      if (res?.success) {
        let data = res.data as Array<AppInfo>;
        result = setAppInfoPages(data);
      }
      return result;
    }
  );
  return appInfoListByUserQuery;
};
/**
 * the hoos for use delete app info
 * @method useDeleteApp
 * @param {string} appId app id
 * @returns {ServerStatus}
 */
export const useDeleteApp = () => {
  const queryClient = useQueryClient();
  const deletAppUserMuattion = useMutation("deletAppUser", deleteAppInfo, {
    onSuccess: (res, { id }) => {
      if (res?.success) {
        let oldData = queryClient.getQueryData(
          "appinfoListbyUser"
        ) as AppInfo[];
        oldData = oldData.flat().filter((item) => item && item?.id !== id);
        queryClient.setQueryData("appinfoListbyUser", setAppInfoPages(oldData));
      }
    },
  });
  return deletAppUserMuattion;
};
/**
 * init set app info data
 * @method useInitAppInfo
 * @param {AppInfo[]} appInoList
 * @param {AppInfo} currentAppInfo
 * @returns {AppInfo} appInfoDetail
 * @returns {string} currentSelectAppGroupsß
 */

export const useInitAppInfo = () => {
  let appDetailQuery = useMutation(
    "appDetail",
    async (data: { appInoList: AppInfo[]; currentAppInfo: AppInfo }) => {
      let res = await getAppInfoById(data.currentAppInfo.id as number);
      if (res?.success) {
        let appGroupIDs: number[] = [];
        let appGroupsNames: string[] = [];
        let app: string = "";
        let iconUrl: string = "";
        //init current selected app group
        res.data?.appGroups.forEach((element: AppGroup) => {
          const id: number = element.id as number;
          const name: string = element.name as string;
          appGroupIDs.push(id);
          appGroupsNames.push(name);
        });
        data.appInoList.forEach((element) => {
          if (element.id === data.currentAppInfo.templateId) {
            iconUrl = element.iconUrl as string;
            app = element.name as string;
          }
        });
        return {
          currentSelectAppGroups: appGroupsNames.join(","),
          appInfoDetail: { ...res.data, appGroupIDs, app, iconUrl },
        };
      } else {
        notification.error({
          message: res?.message,
          duration: 2,
        });
      }
    }
  );
  return appDetailQuery;
};
/**the hooks to submit app info
 * @method useSubmitAppInfo
 * @param appInfo
 * @param submit
 * @returns {ServerStatus}
 */
export const useSubmitAppInfo = () => {
  const queryClient = useQueryClient();
  const appSubmitMutation = useMutation(
    "appSubmit",
    (appInfo: AppInfo) => {
      let submitFun = appInfo.id ? updateDataApp : addApp;
      return submitFun(appInfo);
    },
    {
      onSuccess: (res, data) => {
        if (res?.success) {
          let oldData = queryClient.getQueryData(
            "appinfoListbyUser"
          ) as AppInfo[];
          oldData = oldData.flat().filter((item) => !!item);
          let newData: AppInfo[] = [];
          if (data.id) {
            newData = oldData.map((item) => {
              if (item.id === data.id) {
                item = data;
              }
              return item;
            });
          } else {
            newData = [...oldData, res.data];
          }
          queryClient.setQueryData(
            "appinfoListbyUser",
            setAppInfoPages(newData)
          );
        }
      },
    }
  );
  return appSubmitMutation;
};

/**
 * hooks use get app app group list
 * @method useAppGroup
 * @param {boolean} refresh is refresh api
 * @param {string} account
 * @return {{ appInoList:Array<Array<AppInfo | null> }}
 */
export const useAppGroup = () => {
  const appGroupQuery = useQuery("appGroups", async () => {
    let res = await getAppGroupList();
    if (res?.success) {
      const options: { label: string; value: number }[] = [];
      res.data.forEach((item) => {
        const label = item.name as string;
        const value = item.id as number;
        options.push({ label, value });
      });
      return { appGroupList: res.data, appGroupOtions: options };
    }
  });

  return appGroupQuery;
};
/**
 * the hooks to use submit app group
 * @method useSubmitAppGroup
 * @param {AppGroup} appGroup
 * @returns {ServerStatus}
 */
export const useSubmitAppGroup = () => {
  const queryClient = useQueryClient();
  const appGroupMutation = useMutation(
    "appGroupSubmit",
    (appGroup: AppGroup) => {
      let submitFun = appGroup.id ? updateAppGroup : addAppGroupList;
      return submitFun(appGroup);
    },
    {
      onSuccess: (res, appGroup) => {
        if (res?.success) {
          let oldData = queryClient.getQueryData("appGroups") as {
            appGroupList: AppGroup[];
            appGroupOtions: any[];
          };
          let newData: { appGroupList: AppGroup[]; appGroupOtions: any[] } = {
            appGroupList: [],
            appGroupOtions: [],
          };
          if (appGroup.id) {
            newData.appGroupList = oldData.appGroupList.map((item) => {
              if (item.id === appGroup.id) {
                return appGroup;
              }
              return item;
            });
            newData.appGroupOtions = oldData.appGroupOtions.map((item) => {
              if (item.value === appGroup.id) {
                return { label: appGroup.name, value: appGroup.id };
              }
              return item;
            });
          } else {
            newData.appGroupList = [...oldData.appGroupList, res.data];
            newData.appGroupOtions = [
              ...oldData.appGroupOtions,
              { label: appGroup.name, value: appGroup.id },
            ];
          }
          queryClient.setQueryData("appGroups", newData);
        }
      },
    }
  );
  return appGroupMutation;
};
export const useDeleteAppGroup = () => {
  const queryClient = useQueryClient();
  return useMutation("deletAppgroup", deleteAppGroup, {
    onSuccess: (res, { id }) => {
      if (res?.success) {
        let oldData = queryClient.getQueryData("appGroups") as {
          appGroupList: AppGroup[];
          appGroupOtions: any[];
        };
        let newData: { appGroupList: AppGroup[]; appGroupOtions: any[] } = {
          appGroupList: [],
          appGroupOtions: [],
        };
        newData.appGroupList = oldData.appGroupList.filter(
          (item) => item.id !== id
        );
        newData.appGroupOtions = oldData.appGroupOtions.filter(
          (item) => item.value !== id
        );
        queryClient.setQueryData("appGroups", newData);
      }
    },
  });
};

/**
  User login hook
 * @method useLogin 
 * @return {UseMutationResult}}
 */
export const useLogin = () => {
  return useMutation("loginToken", async (walletAddress) => {
    try {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("iswalletAccount");
      let resPreLogin = await preLogin();
      if (resPreLogin?.success) {
        window.localStorage.setItem("preLoginToken", resPreLogin.data?.token);
        let res = await login(walletAddress);
        if (res?.success) {
          window.localStorage.removeItem("preLoginToken");
          window.localStorage.setItem("token", res.data.token);
          window.localStorage.setItem("iswalletAccount", "true");
        }
      }
    } catch (error) {
      window.localStorage.clear();
    }
  });
};
/**
  User logout hook
 * @method useLogout 
 * @return {UseMutationResult}}
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation("logout", logout, {
    onSuccess: () => {
      window.localStorage.removeItem("token");
      window.localStorage.setItem("iswalletAccount", "false");
    },
  });
};

export const useStorage = () => {
  const [stateToken, setStateToken] = useState<string | null>();
  useEffect(() => {
    function getToken() {
      setStateToken(localStorage.getItem("token"));
    }
    window.addEventListener("storage", getToken);
    return () => {
      window.removeEventListener("storage", getToken);
    };
  }, []);
  return stateToken;
};
