import { PROTOCOL_VER_1 } from "./constant/qrcode";

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
    totalCount: 0,
    orderedDataArr: [] as Uint8Array[],
    countSet: undefined,
    process: (singleQr: Uint8Array) => {
      if (processor.countSet === undefined) {
        processor.totalCount = singleQr[5];
        processor.countSet = indexSet({ totalCount: singleQr[5] });
      }
      const index = singleQr[8];
      processor.orderedDataArr[index] = singleQr;
      processor.countSet.add(index);

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

  if (dataType === "text") {
    const concatedData = dataArr.reduce(
      (acc, cur) =>
        new Uint8Array([...acc, ...cur.slice(PROTOCOL_VER_1.HEADER_SIZE)]),
      new Uint8Array()
    );

    return {
      decodedResult: new TextDecoder().decode(concatedData),
    };
  } else if (dataType === "file") {
    const concatedData = dataArr.reduce(
      (acc, cur) =>
        new Uint8Array([...acc, ...cur.slice(PROTOCOL_VER_1.HEADER_SIZE)]),
      new Uint8Array()
    );
    const fileNameLen = concatedData[0];

    const fileName = new TextDecoder().decode(
      concatedData.slice(1, fileNameLen + 1)
    );
    const fileContent = concatedData.slice(fileNameLen + 1);

    return {
      decodedResult: new File([fileContent], fileName),
    };
  }
};
