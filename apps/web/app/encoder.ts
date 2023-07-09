/*
Version 40M: 2334Byte (~2kb)
Version 30M: 1370Byte (~2kb)
A "Set" is a group of indexed QR codes that together holds a binary data.

===Header===
    ==Header For First Qr ==
        [All] Protocol Name 3byte: QRP for first, QRR for rest
        Version 1byte: start from 0x00
        Type 1byte (differ by Version): 
            digit[1,2]: 0:text, 1:file
            digit[3,4]: compress. (0: no compress, 1: lz-compress)
            digit[5,6]: encrypt. (0: no encrypt, 1: encrypt)
            digit[7,8]: ???
        QR Count: 1byte (0~255)
        
        [All] Hash: 2byte (make sure qr codes are of same set)
        [All] QR Index: 1byte (0~255)
    
===Content===
    Max 2320~2330 (=2334-??)Byte
        If File: 
            - File name length 1Byte
            - File name ??Byte (utf16?)
            - File extension 4Byte char
            - File content ??Byte

- Hash: last N bytes of Sha3-256 


*/
import { createHash } from "sha256-uint8array";

const QR_MAX_SIZE_BYTE_BY_VERSION = {
  40: 2330,
  30: 1370,
  25: 996,
};

export type QrVersions = keyof typeof QR_MAX_SIZE_BYTE_BY_VERSION;

export const encodeToDataArrForQr = (
  data:
    | {
        type: "text";
        content: string;
        qrVersion: QrVersions;
        //   encrypt?: boolean;
        //   compress?: boolean;
      }
    | {
        type: "file";
        qrVersion: QrVersions;
        content: Uint8Array;
        filename: string;
        extension: string;
      }
): {
  qrVersion: QrVersions;
  dataArr: Uint8Array[];
} => {
  const qrMaxSizeByte = QR_MAX_SIZE_BYTE_BY_VERSION[data.qrVersion];

  const protocolName = new TextEncoder().encode("QRP");
  const protocolVersion = 0;
  let typeByte = 0b00000000;

  //   FirstHeader.
  if (data.type === "text") {
    const FIRST_HEADER_SIZE = 9;
    const FIRST_QR_MAX_SIZE = qrMaxSizeByte - FIRST_HEADER_SIZE;
    // length: 6
    const REST_HEADER_SIZE = 6;
    const REST_QR_MAX_SIZE = qrMaxSizeByte - REST_HEADER_SIZE;

    const encodedText = new TextEncoder().encode(data.content);
    const qrCount =
      Math.ceil((encodedText.length - FIRST_QR_MAX_SIZE) / REST_QR_MAX_SIZE) +
      1;
    const hash: Uint8Array = createHash()
      .update(encodedText)
      .digest()
      .slice(-2);

    const firstHeader = new Uint8Array([
      ...protocolName, // 0 1 2
      protocolVersion, // 3
      typeByte, // 4
      qrCount, // 5
      ...hash, // 6 7
      0, // 8 (index)
    ]);

    const makeHeaderForRestQr = (index: number) =>
      new Uint8Array([...new TextEncoder().encode("QRR"), ...hash, index]);

    const firstQrData = new Uint8Array([
      ...firstHeader,
      ...encodedText.slice(0, FIRST_QR_MAX_SIZE),
    ]);

    if (qrCount > 1) {
      const restData = encodedText.slice(qrMaxSizeByte - FIRST_HEADER_SIZE);
      const restQrArr = new Array(qrCount - 1)
        .fill(null)
        .map(
          (_, i) =>
            new Uint8Array([
              ...makeHeaderForRestQr(i + 1),
              ...restData.slice(
                i * REST_QR_MAX_SIZE,
                (i + 1) * REST_QR_MAX_SIZE
              ),
            ])
        );

      return {
        qrVersion: data.qrVersion,
        dataArr: [firstQrData, ...restQrArr],
      };
    } else {
      //   One QR is enough.
      return {
        qrVersion: data.qrVersion,
        dataArr: [firstQrData],
      };
    }
  } else if (data.type === "file") {
    typeByte = typeByte & 0b01000000;

    return {
      qrVersion: data.qrVersion,
      dataArr: [new Uint8Array([])],
    };
  }
};
