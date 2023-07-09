import QRCode from "qrcode";

import { QR_VERSIONS } from "./constant/qrcode";

export const mapArrToQrCodes = async ({
  dataArr,
  qrVersion,
  errorCorrectionLevel,
}: {
  dataArr: Uint8Array[];
  qrVersion: QR_VERSIONS;
  errorCorrectionLevel: "L" | "M";
}): Promise<{
  urls: string[];
}> => {
  const urls = await Promise.all(
    dataArr.map((data) =>
      QRCode.toDataURL([{ data, mode: "byte" }], {
        version: qrVersion,
        errorCorrectionLevel,
        scale: 4,
        type: "image/webp",
      })
    )
  );

  return {
    urls,
  };
};
