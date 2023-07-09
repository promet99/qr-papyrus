/*
PROTOCOL VER 0

Version 40M: 2334Byte (~2kb)
Version 30M: 1370Byte (~2kb)
A "Set" is a group of indexed QR codes that together holds a binary data.

===Header===
    ==Header For First Qr ==
        [Protocol Ver Agnostic]Protocol Name 3byte: QRP
        [Protocol Ver Agnostic] Version 1byte: start from 0x00
        Type 1byte (differ by Version): 
            digit[1,2]: 0:text, 1:file
            digit[3,4]: compress. (0: no compress, 1: lz-compress)
            digit[5,6]: encrypt. (0: no encrypt, 1: encrypt)
            digit[7,8]: ???
        QR Count: 1byte (0~255)
        
        Hash: 2byte (make sure qr codes are of same set)
        QR Index: 1byte (0~255)
    
===Content===
    Max 2320~2330 (=2334-??)Byte
        If File: 
            - File name length 1Byte
            - File name ??Byte (utf16?)
            - File content ??Byte

- Hash: last N bytes of Sha3-256 


*/
import { createHash } from "sha256-uint8array";
import {
  PROTOCOL_VER_1,
  QR_MAX_SIZE_BYTE_BY_VERSION,
  QR_VERSIONS,
} from "./constant/qrcode";

export const encodeToDataArrForQr = (
  data:
    | {
        type: "text";
        qrVersion: QR_VERSIONS;
        errorCorrectionLevel;
        //   encrypt?: boolean;
        //   compress?: boolean;
        content: string;
      }
    | {
        type: "file";
        qrVersion: QR_VERSIONS;
        errorCorrectionLevel: "L" | "M";
        filename: string;
        content: Uint8Array;
      }
): {
  qrVersion: QR_VERSIONS;
  dataArr: Uint8Array[];
} => {
  const qrMaxSizeByte =
    QR_MAX_SIZE_BYTE_BY_VERSION[data.qrVersion][data.errorCorrectionLevel];
  const QR_MAX_CONTENT_SIZE = qrMaxSizeByte - PROTOCOL_VER_1.HEADER_SIZE;

  const protocolName = new TextEncoder().encode("QRP");
  const protocolVersion = 0;
  let typeByte = 0b00000000;

  if (data.type === "text") {
    const encodedText = new TextEncoder().encode(data.content);
    const qrCount =
      Math.ceil(
        (encodedText.length - QR_MAX_CONTENT_SIZE) / QR_MAX_CONTENT_SIZE
      ) + 1;
    const hash: Uint8Array = createHash()
      .update(encodedText)
      .digest()
      .slice(-2);

    const qrHeader = (index: number) =>
      new Uint8Array([
        ...protocolName, // 0 1 2
        protocolVersion, // 3
        typeByte, // 4
        qrCount, // 5
        ...hash, // 6 7
        index, // 8 (index)
      ]);

    const firstQrData = new Uint8Array([
      ...qrHeader(0),
      ...encodedText.slice(0, QR_MAX_CONTENT_SIZE),
    ]);

    const leftDataSize = encodedText.slice(QR_MAX_CONTENT_SIZE);
    const restQrArr = new Array(qrCount - 1)
      .fill(null)
      .map(
        (_, i) =>
          new Uint8Array([
            ...qrHeader(i + 1),
            ...leftDataSize.slice(
              i * QR_MAX_CONTENT_SIZE,
              (i + 1) * QR_MAX_CONTENT_SIZE
            ),
          ])
      );

    return {
      qrVersion: data.qrVersion,
      dataArr: [firstQrData, ...restQrArr],
    };
  } else if (data.type === "file") {
    typeByte = typeByte |= 0b01000000;

    const encodedFilename = new TextEncoder().encode(data.filename);
    const encodedFilenameLen = encodedFilename.length;
    if (encodedFilenameLen > 255) {
      throw new Error("Filename too long");
    }

    const encodedContent = new Uint8Array([
      ...new Uint8Array([encodedFilenameLen]),
      ...encodedFilename,
      ...data.content,
    ]);
    const qrCount =
      Math.ceil(
        (encodedContent.length - QR_MAX_CONTENT_SIZE) / QR_MAX_CONTENT_SIZE
      ) + 1;

    const hash: Uint8Array = createHash()
      .update(data.filename + encodedContent.length)
      .digest()
      .slice(-2);

    const qrHeader = (index: number) =>
      new Uint8Array([
        ...protocolName, // 0 1 2
        protocolVersion, // 3
        typeByte, // 4
        qrCount, // 5
        ...hash, // 6 7
        index, // 8 (index)
      ]);

    const firstQrData = new Uint8Array([
      ...qrHeader(0),
      ...encodedContent.slice(0, QR_MAX_CONTENT_SIZE),
    ]);

    const leftDataSize = encodedContent.slice(QR_MAX_CONTENT_SIZE);
    const restQrArr = new Array(qrCount - 1)
      .fill(null)
      .map(
        (_, i) =>
          new Uint8Array([
            ...qrHeader(i + 1),
            ...leftDataSize.slice(
              i * QR_MAX_CONTENT_SIZE,
              (i + 1) * QR_MAX_CONTENT_SIZE
            ),
          ])
      );

    return {
      qrVersion: data.qrVersion,
      dataArr: [firstQrData, ...restQrArr],
    };
  }
};
