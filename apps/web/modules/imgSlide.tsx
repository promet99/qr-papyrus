import { useEffect, useState } from "react";

export const ImgSlide = ({
  srcArr,
  interval = 500,
  size = 400,
}: {
  srcArr: string[];
  interval: number;
  size: number;
}) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setI((v) => (v + 1) % (srcArr.length || 1));
    }, interval);
    return () => clearInterval(slideInterval);
  }, [srcArr]);

  return (
    <div>
      <img
        src={srcArr[i]}
        alt=""
        style={{
          width: size,
          height: size,
        }}
      />
      <div
        style={{
          width: size,
        }}
      >
        {i + 1}/{srcArr.length}
      </div>
    </div>
  );
};
