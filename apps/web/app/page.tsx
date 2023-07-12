"use client";

import { useEffect, useState } from "react";
import { Reader } from "@promet99/react-qr-reader-es6";

import { encodeToDataArrForQr } from "../modules/encoder";
import { getTestImgData, testQrData } from "../modules/testData";
import {
  decodeCompleteOrderedQrSet,
  unorderedQrDataArrProcessor,
} from "../modules/decoder";
import { mapArrToQrCodes } from "../modules/qrcode";
import { ImgSlide } from "../modules/imgSlide";
import { downloadFile } from "../modules/file";
import { StatusBlockBar } from "../component/StatusBlockBar";

const VERSION = 25;
export default function MainPage() {
  const [src, setSrc] = useState([]);

  useEffect(() => {
    (async () => {})();
    console.log(testQrData);
    (async () => {
      const aa = await getTestImgData();
      const dd = encodeToDataArrForQr({
        type: "file",
        qrVersion: VERSION,
        content: aa,
        filename: "test.png",
        errorCorrectionLevel: "L",
      });

      const { urls } = await mapArrToQrCodes({
        dataArr: dd.dataArr,
        qrVersion: VERSION,
        errorCorrectionLevel: "L",
      });
      setSrc(urls);
    })();
  }, []);

  const [bb, setBb] = useState(unorderedQrDataArrProcessor());

  const [encodingStatusArr, setEncodingStatusArr] = useState([false]);
  const [highlightIndex, setHighlightIndex] = useState<undefined | number>(
    undefined
  );
  return (
    <>
      <Reader
        delay={100}
        style={{ width: 400, height: 400 }}
        onScan={(e) => {
          if (e === null) return;
          if (e && (e.binaryData as number[])) {
            const aa = bb.process(new Uint8Array(e.binaryData));
            setEncodingStatusArr(bb.countSet?.getStatusByIndex() || []);
            setHighlightIndex(aa.currentIndex);
            if (aa.isComplete) {
              const cc = decodeCompleteOrderedQrSet({
                dataArr: aa.orderedDataArr,
              });
              console.log({ cc });
              if (typeof cc === "object") {
                downloadFile(cc.decodedResult as File);
              }
            }
          }
        }}
      />
      <StatusBlockBar
        dataStatusArr={encodingStatusArr}
        highlightIndex={highlightIndex}
      />

      <div>
        <ImgSlide srcArr={src} interval={500} size={0} />
      </div>
    </>
  );
}
