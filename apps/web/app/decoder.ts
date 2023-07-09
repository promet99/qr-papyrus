/*
Version 40M: 2334Byte (~2kb)
Version 30M: 1370Byte (~2kb)
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

const FIRST_HEADER_SIZE = 9;
const REST_HEADER_SIZE = 6;

const indexSet = ({ totalCount }: { totalCount: number }) => {
  const idxSet = {
    _data: {},
    add: (idx: number): boolean => {
      if (idx < 0 || idx >= totalCount) {
        return false;
      }
      if (idxSet._data[idx] === true) {
        return false;
      }
      idxSet._data[idx] = true;
      return true;
    },
    isComplete: () => {
      const hasEnoughElements = Object.keys(idxSet._data).length === totalCount;
      if (!hasEnoughElements) {
        return false;
      }
      const hasAllElements = new Array(totalCount)
        .fill(null)
        .every((_, i) => idxSet._data[i] === true);
      return hasAllElements;
    },
    missingIndexes: () =>
      new Array(totalCount)
        .fill(null)
        .map((_, i) => (idxSet._data[i] === true ? null : i))
        .filter((v) => v !== null),
  };
  return idxSet;
};

export const unorderedQrDataArrProcessor = () => {
  const processor = {
    isFirstFound: false,
    totalCount: 0,
    orderedDataArr: [] as Uint8Array[],
    countSet: undefined,
    process: (singleQr: Uint8Array) => {
      const isFirst = new TextDecoder().decode(singleQr.slice(0, 3)) === "QRP";
      if (isFirst) {
        processor.isFirstFound = true;
        processor.totalCount = singleQr[5];
        processor.orderedDataArr[0] = singleQr;
        processor.countSet = indexSet({ totalCount: processor.totalCount });
        processor.orderedDataArr.map((_, i) => processor.countSet.add(i));
      } else {
        const index = singleQr[5];
        processor.orderedDataArr[index] = singleQr;
        if (processor.isFirstFound) {
          processor.countSet.add(index);
        }
      }
      return {
        isComplete: processor.countSet?.isComplete() || false,
        totalCount: processor.totalCount,
        missingIdx: processor.countSet?.missingIndexes() || [],
        orderedDataArr: processor.orderedDataArr,
      };
    },
  };
  return processor;
};

const QR_MAX_SIZE_BYTE_BY_VERSION = {
  40: 2330,
  30: 1370,
  25: 996,
};

export type QrVersions = keyof typeof QR_MAX_SIZE_BYTE_BY_VERSION;

export const decodeCompleteOrderedQrSet = ({
  dataArr,
}: {
  dataArr: Uint8Array[];
}): {
  decodedResult: string | File;
} => {
  const firstHeader = dataArr[0].slice(0, 9);

  const isHeaderCorrect =
    new TextDecoder().decode(firstHeader.slice(0, 3)) === "QRP";
  const isVersionCorrect = firstHeader[3] === 0;
  const dataType = !!(firstHeader[4] & 0b01000000) ? "file" : "text";
  const qrCount = firstHeader[5];
  const hash = new TextDecoder().decode(firstHeader.slice(6, 8));
  const firstQrIndex = firstHeader[8];
  const isQrIndexCorrect = firstQrIndex === 0;

  const decodeRestQrHeader = (restQrHeader: Uint8Array) => {
    const isHeaderCorrect =
      new TextDecoder().decode(restQrHeader.slice(0, 3)) === "QRP";
    const hash = new TextDecoder().decode(restQrHeader.slice(3, 5));
    const qrIndex = restQrHeader[5];
    return { isHeaderCorrect, hash, qrIndex };
  };

  const FIRST_HEADER_SIZE = 9;
  const REST_HEADER_SIZE = 6;
  if (dataType === "text") {
    if (dataArr.length < 2) {
      const content = dataArr[0].slice(FIRST_HEADER_SIZE);
      return {
        decodedResult: new TextDecoder().decode(content),
      };
    }
    const concatedData = dataArr.reduce((acc, cur, i) => {
      if (i === 0) {
        return cur.slice(FIRST_HEADER_SIZE);
      }
      return new Uint8Array([...acc, ...cur.slice(REST_HEADER_SIZE)]);
    }, new Uint8Array());

    return {
      decodedResult: new TextDecoder().decode(concatedData),
    };
  } else if (dataType === "file") {
    return {
      decodedResult: new File([], "test"),
    };
  }
};
