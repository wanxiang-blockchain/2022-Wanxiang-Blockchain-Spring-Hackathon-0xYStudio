/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from "umi-request";
import { notification } from "antd";
const codeMessage = {
  200: "The server successfully returned the requested data",
  201: "Data creation or modification succeeded",
  202: "A request has entered the background queue (asynchronous task)",
  204: "A request has entered the background queue (asynchronous task).",
  400: "There is an error in the request sent, and the server does not create or modify data.",
  401: "The user does not have permission (wrong token, user name and password)。",
  403: "The user is authorized, but access is prohibited。",
  404: "The request sent is for non-existent records, and the server did not operate。",
  406: "The requested format is not available。",
  410: "The requested format is not available。",
  422: "A validation error occurred while creating an object。",
  500: "An error occurred in the server. Please check the server。",
  502: "Bad Gateway",
  503: "Service unavailable, server temporarily overloaded or maintained。",
  504: "The gateway timed out",
};

/**
 * exception handling
 */
const errorHandler = (error) => {
  const { response = {} } = error;
  let errortext = codeMessage[response.status] || response.statusText;
  const { status } = response;
  // console.log(`response${JSON.stringify(response)}`)
  if (status === 400 && !window.localStorage.getItem("token")) {
    errortext = "Wrong account name or password";
  }
  if (status === 401) {
    notification.error({
      message: `Login has expired, please login again`,
      duration: 2,
    });
    window.localStorage.removeItem("token");
    window.localStorage.setItem("iswalletAccount", "false");
  }
  notification.error({
    message: `Request error ${status}`,
    description: errortext,
  });
  return error;
};

/**
 * Default parameters when configuring request requests
 */
const request = extend({
  errorHandler, // Default error handling
});

// Request interceptor, change URL or options
request.interceptors.request.use((url, options: any) => {
  const headers = {
    Authorization:
      url === "/api/v2/login"
        ? window.localStorage.getItem("preLoginToken")
        : window.localStorage.getItem("token"),
  };
  return {
    url: options.mock ? url : `${url}`,
    options: {
      ...options,
      headers,
    },
  };
});

// Response interceptor, processing response
request.interceptors.response.use(async (response) => {
  //const data = await response.clone().json();
  // if (!data.success && data.message) {
  //   notification.error({
  //     message: `Request error ${data.code}`,
  //     description: data.message,
  //   });
  // }
  return response;
});

export default request;
