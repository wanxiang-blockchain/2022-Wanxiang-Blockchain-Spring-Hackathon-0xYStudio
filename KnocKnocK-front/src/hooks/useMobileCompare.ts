import { useEffect } from "react";

const useMobileCompare = (DESIGN_WIDTH, isScaleToViewPort = false) => {
  useEffect(() => {
    setViewport();
    window.addEventListener("resize", setViewport);
    return () => {
      window.removeEventListener("resize", setViewport);
    };
  }, []);

  //通过设置meta元素中content的initial-scale值达到移动端适配
  const setViewport = function () {
    let width =
      document.documentElement.clientWidth < window.screen.width
        ? document.documentElement.clientWidth
        : window.screen.width;
    //计算当前屏幕的宽度与设计稿比例
    let scale;
    if (isScaleToViewPort) {
      scale = window.screen.width / DESIGN_WIDTH;
    } else {
      scale =
        window.screen.width < DESIGN_WIDTH
          ? window.screen.width / DESIGN_WIDTH
          : 1;
    }

    // 获取元素
    let meta = document.querySelector("meta[name=viewport]");
    console.log(
      scale,
      window.screen.width,
      DESIGN_WIDTH,
      document.documentElement.clientWidth
    );
    let content = `width=${DESIGN_WIDTH}, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}`;
    // 判断是否已存在
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "viewport");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  };
};
export default useMobileCompare;
