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
            - File extension 4Byte char
            - File content ??Byte

- Hash: last N bytes of Sha3-256 


*/
import { createHash } from "sha256-uint8array";
import {
  PROTOCOL_VER_1,
  QR_MAX_SIZE_BYTE_BY_VERSION,
  QR_VERSIONS,
} from "../constant/qrcode";

export const encodeToDataArrForQr = (
  data:
    | {
        type: "text";
        content: string;
        qrVersion: QR_VERSIONS;
        //   encrypt?: boolean;
        //   compress?: boolean;
      }
    | {
        type: "file";
        qrVersion: QR_VERSIONS;
        content: Uint8Array;
        filename: string;
        extension: string;
      }
): {
  qrVersion: QR_VERSIONS;
  dataArr: Uint8Array[];
} => {
  const qrMaxSizeByte = QR_MAX_SIZE_BYTE_BY_VERSION[data.qrVersion];

  const protocolName = new TextEncoder().encode("QRP");
  const protocolVersion = 0;
  let typeByte = 0b00000000;

  //   FirstHeader.
  if (data.type === "text") {
    const QR_MAX_SIZE = qrMaxSizeByte - PROTOCOL_VER_1.HEADER_SIZE;

    const encodedText = new TextEncoder().encode(data.content);
    const qrCount =
      Math.ceil((encodedText.length - QR_MAX_SIZE) / QR_MAX_SIZE) + 1;
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
      ...encodedText.slice(0, QR_MAX_SIZE),
    ]);

    if (qrCount > 1) {
      const leftDataSize = encodedText.slice(
        qrMaxSizeByte - PROTOCOL_VER_1.HEADER_SIZE
      );
      const restQrArr = new Array(qrCount - 1)
        .fill(null)
        .map(
          (_, i) =>
            new Uint8Array([
              ...qrHeader(i + 1),
              ...leftDataSize.slice(i * QR_MAX_SIZE, (i + 1) * QR_MAX_SIZE),
            ])
        );

      return {
        qrVersion: data.qrVersion,
        dataArr: [firstQrData, ...restQrArr],
      };
    } else {
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
