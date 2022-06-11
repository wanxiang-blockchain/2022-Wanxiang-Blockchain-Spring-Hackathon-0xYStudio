export function getBase64(img) {
  return new Promise((reslove) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => reslove(reader.result));
    reader.readAsDataURL(img);
  });
}
/**
 * 图片压缩（利用canvas）
 * @param  path     base64图片
 * @param  obj      压缩配置quality，不传则按比例压缩，默认0.5
 * @param  callback  回调函数
 */
export const dealImageCompression = (path, obj): Promise<string> => {
  return new Promise((reslove) => {
    let img = new Image();
    img.src = path;

    img.onload = function () {
      let that = this;
      // 默认按比例压缩
      let w = img.width,
        h = img.height,
        scale = w / h;

      // 默认图片质量为0.5
      let quality = 0.5;
      if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
        quality = obj.quality;
      }

      w = w > 300 ? w * quality : w;
      h = w > 300 ? w / scale : h;
      console.log(w, h);
      //生成canvas
      let canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");
      canvas.width = w;
      canvas.height = h;
      ctx?.drawImage(img, 0, 0, w, h);

      // 回调函数返回base64的值
      let base64 = canvas.toDataURL("image/jpeg", quality);
      reslove(base64);
    };
  });
};
export const dataURItoBlob = (dataurl) => {
  //dataurl是base64格式
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};
