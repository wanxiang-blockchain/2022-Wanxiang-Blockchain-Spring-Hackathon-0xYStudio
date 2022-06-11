import request from "./request";
import { AppGroup as AppGroupType, AppInfo, User } from "../hooks/useProfile";
/**
 * Create order
 * @method makeOrder
 * @param {any} order
 * @returns {Promise}
 */
export async function makeOrder(order: any) {
  return request.post("/api/v2/order/create", {
    data: order,
  });
}
/**
 * Wallet payment order callback
 * @method confirmOrder
 * @param {number} orderId
 * @returns {Promise}
 */
export async function confirmOrder(orderId) {
  return request.post(`/api/v2/order/${orderId}/paymentCallback`);
}
/**
 * Modify order transaction data
 * @method updateOrderTransaction
 * @param {number} orderId
 * @param {DataHexString} transaction
 * @returns {Promise}
 */
export async function updateOrderTransaction(orderId, transaction) {
  return request.post(`/api/v2/order/${orderId}/transaction/${transaction}`);
}
/**
 * Get data of shopping cart
 * @method getCart
 * @returns {Promise}
 */
export async function getCart() {
  return request.get("/api/v2/order/my");
}
/**
 * get turtlecase price
 * @method getPrice
 * @returns {Promise}
 */
export async function getPrice() {
  return request.get("/api/v2/price/turtlecase");
}

// export async function verify(wallet:any, id:any){
//   return request.get("/api/v1/verify",{
//     params:{
//       request_type:"get_verified",
//       wallet: wallet,
//       id: id
//     },
//   }).catch(function(error){
//     console.log(error)
//   })
// }

export async function getProfile(wallet: any) {
  return request
    .get("/api/v1/get_profile", {
      params: {
        request_type: "get_profile",
        wallet: wallet,
      },
    })
    .catch(function (error) {
      console.log(error);
    });
}
/**
 * User login
 * @method login
 * @param {string} walletAddress wallet address
 * @return {Promise}
 */

export function login(walletAddress) {
  return request.post("/api/v2/login", {
    data: { walletAddress },
  });
}
/**
 * User logout
 * @method logout
 * @param
 * @return {Promise}
 */
export function logout() {
  return request.post("/api/v2/logout");
}
/**
 * get user info
 * @method getUserInfo
 * @param
 * @return {Promise}
 */
export function getUserInfo() {
  return request.get("/api/v2/account/my");
}
/**
 * update user info
 * @method updateUser
 * @param {User} userdata
 * @return {Promise}
 */
export function updateUser(data: User) {
  return request.post("/api/v2/account/update", { data });
}
/**
 * get  all app list
 * @method getAppList
 * @param
 * @return {Promise}
 */
export function getAppList() {
  return request.get("/api/v2/appTemplate/list");
}
/**
 * get  all app list
 * @method getAppList
 * @param
 * @return {Promise}
 */
export function getAppListByUser() {
  return request.get("/api/v2/app/my");
}

/**
 * add a app
 * @method addApp
 * @param {AppInfo} data app info
 * @return {Promise}
 */
export function addApp(data: AppInfo) {
  return request.post("/api/v2/app/create", { data });
}
/**
 * update a app
 * @method updateDataApp
 * @param {AppInfo} data app info
 * @return {Promise}
 */
export function updateDataApp(data: AppInfo) {
  return request.post("/api/v2/app/update", { data });
}
/**
 * get app detail by id
 * @method getAppInfoById
 * @param {number} appId app id
 * @return {Promise}
 */
export function getAppInfoById(appId: number) {
  return request.get(`/api/v2/app/${appId}`);
}
/**
 * delete app detail by id
 * @method deleteAppInfo
 * @param {AppInfo} data app info
 * @return {Promise}
 */
export function deleteAppInfo(data) {
  return request.post(`/api/v2/app/remove`, { data });
}

/**
 * get  all app group  list
 * @method getAppGroupList
 * @param
 * @return {Promise}
 */
export function getAppGroupList() {
  return request.get("/api/v2/appGroup/my");
}
/**
 * add app group
 * @method addAppGroupList
 * @param {AppGroupType} data app group info
 * @return {Promise}
 */
export function addAppGroupList(data: AppGroupType) {
  return request.post("/api/v2/appGroup/create", { data });
}
/**
 * update app group
 * @method updateAppGroup
 * @param {AppGroupType} data app group info
 * @return {Promise}
 */
export function updateAppGroup(data: AppGroupType) {
  return request.post("/api/v2/appGroup/update", { data });
}
/**
 * delete  app group
 * @method deleteAppGroup
 * @param {{id:number}} data app group info
 * @return {Promise}
 */
export function deleteAppGroup(data) {
  return request.post("/api/v2/appGroup/remove", { data });
}

/**
 * get social info by coordinate
 * @method getSocialInfo
 * @param {{sign:string }} data sign nft coordinate
 * @return {Promise}
 */
export function getSocialInfo(data) {
  return request.post("/api/v2/social/info", { data });
}
/**
 * uploadImg
 * @method uploadImg file
 * @return {Promise}
 */
export function uploadImg(data: FormData) {
  const headers = {
    Authorization: window.localStorage.getItem("token") || "",
    "Content-Type": "multipart/form-data",
  };
  return request
    .post("/api/v2/attachment/upload", {
      data,
      headers: headers,
    })
    .then((res) => {
      if (res.success) {
        return { url: process.env.REACT_APP_API_HOST + res.data.url };
      } else {
        return Promise.reject();
      }
    });
}
/**
 * 
Secure and obtain the login interface token
 * @method preLogin
 * @return {Promise}
 */
export function preLogin() {
  return request.post("/api/v2/preLogin");
}
