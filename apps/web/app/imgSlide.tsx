import { useEffect, useState } from "react";

export const ImgSlide = ({
  srcArr,
  interval = 500,
}: {
  srcArr: string[];
  interval: number;
}) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setI((v) => (v + 1) % (srcArr.length || 1));
    }, interval);
    return () => clearInterval(slideInterval);
  }, [srcArr]);

  return (
    <img
      src={srcArr[i]}
      alt=""
      style={{
        width: 600,
        height: 600,
      }}
    />
  );
};
