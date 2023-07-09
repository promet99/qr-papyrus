"use client";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import { encodeToDataArrForQr } from "./encoder";
import { getTestImgData, testQrData } from "./testData";
import { Reader } from "@promet99/react-qr-reader-es6";
import {
  decodeCompleteOrderedQrSet,
  unorderedQrDataArrProcessor,
} from "./decoder";
import { mapArrToQrCodes } from "./qrcode";
import { ImgSlide } from "./imgSlide";
import { downloadFile } from "./file";

const styles = StyleSheet.create({
  page: { backgroundColor: "white", marginTop: 10, marginBottom: 10 },
  section: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  title: {
    textAlign: "center",
    width: "100%",
  },
  qrImgStyle: {
    width: 270,
    height: 270,
    padding: 0,
    margin: 0,
    display: "flex",
  },
  block: { width: 250, height: 250, margin: 0, padding: 0 },
});

export default function MainPage() {
  const [src, setSrc] = useState([]);

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.title}>
            <Text>Section #1</Text>
          </View>

          <Image src={src[0]} style={styles.qrImgStyle} />
        </View>
      </Page>
    </Document>
  );

  useEffect(() => {
    (async () => {})();
    const VERSION = 30;
    console.log(testQrData);
    (async () => {
      const aa = await getTestImgData();
      console.log({ aa });

      const dd = encodeToDataArrForQr({
        type: "file",
        qrVersion: 30,
        content: aa,
        filename: "test.png",
      });

      const { urls } = await mapArrToQrCodes({
        dataArr: dd.dataArr,
        qrVersion: VERSION,
      });
      setSrc(urls);
    })();
  }, []);

  const [bb, setBb] = useState(unorderedQrDataArrProcessor());

  return (
    <>
      <Reader
        delay={100}
        onError={(e) => {
          console.log(e);
        }}
        style={{ width: 400, height: 400 }}
        onScan={(e) => {
          if (e === null) return;
          console.log(e);
          if (e && (e.binaryData as number[])) {
            const aa = bb.process(new Uint8Array(e.binaryData));
            console.log(aa);
            if (aa.isComplete) {
              const cc = decodeCompleteOrderedQrSet({
                dataArr: aa.orderedDataArr,
              });
              console.log({ cc });
              if (typeof cc === "object") {
                downloadFile(cc.decodedResult as File);
              }
            }
          }
        }}
      />
      {/* <PDFViewer width={600} height={900}>
        {doc}
      </PDFViewer> */}

      <div>
        <ImgSlide srcArr={src} interval={500} />
      </div>
    </>
  );
}
