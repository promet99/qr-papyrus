import QRCode from "qrcode";

import { QR_VERSIONS } from "../constant/qrcode";

export const mapArrToQrCodes = async ({
  dataArr,
  qrVersion,
}: {
  dataArr: Uint8Array[];
  qrVersion: QR_VERSIONS;
}): Promise<{
  urls: string[];
}> => {
  const urls = await Promise.all(
    dataArr.map((data) =>
      QRCode.toDataURL([{ data, mode: "byte" }], {
        version: qrVersion,
        scale: 4,
        type: "image/webp",
      })
    )
  );

  return {
    urls,
  };
};
