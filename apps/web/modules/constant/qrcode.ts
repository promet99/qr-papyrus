export const QR_MAX_SIZE_BYTE_BY_VERSION = {
  40: {
    L: 2950,
    M: 2330,
  },
  30: {
    L: 1730,
    M: 1370,
  },
  25: {
    L: 1270,
    M: 996,
  },
} as const;
export type QR_VERSIONS = keyof typeof QR_MAX_SIZE_BYTE_BY_VERSION;
export const PROTOCOL_VER_1 = {
  HEADER_SIZE: 9,
};

export type ErrorCorrectionLevelType = "L" | "M";
