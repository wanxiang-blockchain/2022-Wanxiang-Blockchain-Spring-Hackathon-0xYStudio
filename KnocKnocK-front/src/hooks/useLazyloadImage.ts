import { useEffect } from "react";
let observer;
export const useImgHook = (ele, callback) => {
  useEffect(() => {
    const nodes = document.querySelectorAll(ele);
    if (nodes.length !== 0) {
      observer = new IntersectionObserver((entries) => {
        callback && callback(entries);
        entries.forEach((item) => {
          if (item.isIntersecting) {
            const dataSrc = item.target.getAttribute("data-src");
            item.target.setAttribute("src", dataSrc || "");
            observer.unobserve(item.target);
          }
        });
      });
      nodes.forEach((item) => {
        observer.observe(item);
      });
    }

    return () => {
      if (nodes.length !== 0 && observer) {
        observer.disconnect();
      }
    };
  }, [ele, callback]);
};
