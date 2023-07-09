import { encodeToDataArrForQr } from "./encoder";

export const testQrData = encodeToDataArrForQr({
  type: "text",
  qrVersion: 25,
  content: `/*
Version 40M: 2334Byte (~2kb)
A "Set" is a group of indexed QR codes that together holds a binary data.

===Header===
    ==Header For First Qr ==
        [All] Protocol Name 3byte: QRP
        Version 1byte: start from 0x00
        Type 1byte (differ by Version): 
            digit[1,2]: 0:text, 1:file
            digit[3,4]: compress. (0: no compress, 1: lz-compress)
            digit[5,6]: encrypt. (0: no encrypt, 1: encrypt)
            digit[7,8]: ???
        
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

const QR_40M_SIZE_BYTE = 2334;

const encode = (
  data:
    | {
        type: "text";
        content: string;
        //   encrypt?: boolean;
        //   compress?: boolean;
      }
    | {
        type: "file";
        content: Uint8Array;
        filename: string;
        extension: string;
      }
): Uint8Array[] => {
  const protocolName = new TextEncoder().encode("QRP");
  const version = new Uint8Array([0]);
  const type = new Uint8Array([0]);

  //   FirstHeader.
  if (data.type === "text") {
    const encodedText = new TextEncoder().encode(data.content);
    const hash: Uint8Array = createHash()
      .update(encodedText)
      .digest()
      .slice(-2);

    const FIRST_HEADER_SIZE = 8;
    const FIRST_QR_MAX_SIZE = QR_40M_SIZE_BYTE - FIRST_HEADER_SIZE;
    const firstHeader = new Uint8Array([
      ...protocolName,
      ...version,
      ...type,
      ...hash,
      ...new Uint8Array([0]),
    ]);

    // length: 6
    const REST_HEADER_SIZE = 6;
    const REST_QR_MAX_SIZE = QR_40M_SIZE_BYTE - REST_HEADER_SIZE;
    const makeHeaderForRestQr = (index: number) => {
      protocolName;
      return new Uint8Array([
        ...protocolName,
        ...hash,
        ...new Uint8Array([index]),
      ]);
    };

    const firstQrData = new Uint8Array([
      ...firstHeader,
      ...encodedText.slice(0, FIRST_QR_MAX_SIZE),
    ]);

    const qrCount =
      Math.ceil((encodedText.length - FIRST_QR_MAX_SIZE) / REST_QR_MAX_SIZE) +
      1;
    if (qrCount > 1) {
      const restData = encodedText.slice(QR_40M_SIZE_BYTE - FIRST_HEADER_SIZE);
      const restQrArr = new Array(qrCount).map(
        (_, i) =>
          new Uint8Array([
            ...makeHeaderForRestQr(i),
            ...restData.slice(i * REST_QR_MAX_SIZE, (i + 1) * REST_QR_MAX_SIZE),
          ])
      );

      return [firstQrData, ...restQrArr];
    } else {
      //   One QR is enough.
      return [firstQrData];
    }
  } else if (data.type === "file") {
    type[0] = type[0] & 0b01000000;
  }

  return [new Uint8Array([])];
};
`,
});
