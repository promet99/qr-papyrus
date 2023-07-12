"use client";

import { useState } from "react";

import {
  EncodedQrData,
  encodeToDataArrForQr,
  fileToUint8Arr,
} from "../../modules/encoder";

import { mapArrToQrCodes } from "../../modules/qrcode";
import { ImgSlide } from "../../modules/imgSlide";

const VERSION = 25;
export default function MainPage() {
  const [pageStatus, setPageStatus] = useState<"input" | "output">("input");

  const [encodeType, setEncodeType] = useState<"text" | "file">("text");

  const [inputText, setInputText] = useState<string>("");
  const [inputFile, setInputFile] = useState<File | undefined>(undefined);

  const [src, setSrc] = useState([]);

  const goodWidth = Math.min(window.screen.width - 20, 600);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {pageStatus === "input" ? (
        <div
          style={{
            width: goodWidth,
          }}
        >
          <div>
            Encode Type: {encodeType}
            {" (max 128kb) "}
            <button
              onClick={() => {
                setEncodeType(encodeType === "text" ? "file" : "text");
              }}
            >
              change
            </button>
          </div>

          <div>
            {encodeType === "text" && (
              <textarea
                placeholder="type text here"
                rows={10}
                style={{ width: "100%" }}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                }}
              />
            )}
            {encodeType === "file" && (
              <input
                type="file"
                onChange={(e) => {
                  // TODO: check for max size (128kb)
                  if (e.target.files[0].size > 128 * 1024) {
                    alert("too big! (max 128kb)");
                  } else {
                    setInputFile(e.target.files[0]);
                  }
                }}
              />
            )}
          </div>
          <div>
            <button
              onClick={async () => {
                if (encodeType === "text" && inputText.length > 0) {
                  const encodResult = encodeToDataArrForQr({
                    type: "text",
                    qrVersion: VERSION,
                    content: inputText,
                    errorCorrectionLevel: "L",
                  });

                  const { urls } = await mapArrToQrCodes({
                    dataArr: encodResult.dataArr,
                    qrVersion: VERSION,
                    errorCorrectionLevel: "L",
                  });
                  setSrc(urls);
                }
                if (encodeType === "file" && inputFile !== undefined) {
                  const fileInUintArr = await fileToUint8Arr(inputFile);
                  const encodResult = encodeToDataArrForQr({
                    type: "file",
                    qrVersion: VERSION,
                    content: fileInUintArr as Uint8Array,
                    errorCorrectionLevel: "L",
                    filename: inputFile?.name,
                  });
                  const { urls } = await mapArrToQrCodes({
                    dataArr: encodResult.dataArr,
                    qrVersion: VERSION,
                    errorCorrectionLevel: "L",
                  });
                  setSrc(urls);
                }
              }}
            >
              Make {encodeType} into QR Slide
            </button>
          </div>
        </div>
      ) : (
        <>
          <ImgSlide srcArr={src} interval={500} size={goodWidth} />
          <div>
            <button
              onClick={() => {
                setPageStatus("input");
              }}
            >
              Encode something else
            </button>
          </div>
        </>
      )}
    </div>
  );
}
