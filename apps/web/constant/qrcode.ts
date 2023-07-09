export const QR_MAX_SIZE_BYTE_BY_VERSION = {
  40: 2330,
  30: 1370,
  25: 996,
};
export type QR_VERSIONS = keyof typeof QR_MAX_SIZE_BYTE_BY_VERSION;
export const PROTOCOL_VER_1 = {
  HEADER_SIZE: 9,
};
