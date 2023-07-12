"use client";

import { useEffect, useRef, useState } from "react";
import { Reader } from "@promet99/react-qr-reader-es6";

import {
  decodeCompleteOrderedQrSet,
  unorderedQrDataArrProcessor,
} from "../../modules/decoder";
import { downloadFile } from "../../modules/file";
import { StatusBlockBar } from "../../component/StatusBlockBar";

export default function MainPage() {
  const bb = useRef(unorderedQrDataArrProcessor());

  const [encodingStatusArr, setEncodingStatusArr] = useState([false]);
  const [highlightIndex, setHighlightIndex] = useState<undefined | number>(
    undefined
  );

  const goodWidth = Math.min(window.screen.width - 20, 600);

  const [scanStatus, setScanStatus] = useState<
    "notStarted" | "onGoing" | "complete"
  >("notStarted");

  const [scanResult, setScanResult] = useState<{
    type: "file" | "text" | undefined;
    data: undefined | string | File;
  }>({ type: undefined, data: undefined });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Reader
        delay={100}
        style={{ width: goodWidth, height: goodWidth }}
        onScan={(e) => {
          if (e === null) return;
          if (e && (e.binaryData as number[])) {
            const aa = bb.current.process(new Uint8Array(e.binaryData));
            setEncodingStatusArr(bb.current.countSet?.getStatusByIndex() || []);
            setHighlightIndex(aa.currentIndex);
            if (aa.isComplete) {
              const cc = decodeCompleteOrderedQrSet({
                dataArr: aa.orderedDataArr,
              });
              console.log({ cc });

              setScanResult({
                type: typeof cc === "string" ? "text" : "file",
                data: cc.decodedResult as File,
              });
              setScanStatus("complete");
            } else {
              setScanStatus("onGoing");
            }
          }
        }}
      />
      <StatusBlockBar
        width={goodWidth}
        dataStatusArr={encodingStatusArr}
        highlightIndex={highlightIndex}
      />
      <div
        style={{
          width: goodWidth,
        }}
      >
        <div>
          {"Status: "}
          {scanStatus === "notStarted" && "Scan Not Started"}
          {scanStatus === "onGoing" && "Scanning"}
          {scanStatus === "complete" && "Complete"}
        </div>
        <div>
          Type:
          {scanResult.type === "file" && "File"}
          {scanResult.type === "text" && "Text"}
          {scanResult.type === undefined && "Unknown"}
        </div>
        <div>Size: Unknown</div>
        {scanStatus === "complete" && (
          <div>
            <div>Result</div>
            {scanResult.type === "text" && (
              <div>
                Result Text
                <div>Result Text Here</div>
              </div>
            )}
            {scanResult.type === "file" && (
              <div>
                <button
                  onClick={() => {
                    if (scanResult.type === "file" && scanResult.data) {
                      downloadFile(scanResult.data as File);
                    }
                  }}
                >
                  Download File
                </button>
              </div>
            )}
          </div>
        )}
        {/*                                                          */}
      </div>
    </div>
  );
}
