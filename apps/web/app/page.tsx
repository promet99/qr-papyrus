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
import { testQrData } from "./testData";
import { Reader } from "@promet99/react-qr-reader-es6";
import {
  decodeCompleteOrderedQrSet,
  unorderedQrDataArrProcessor,
} from "./decoder";

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
  const [src, setSrc] = useState("");
  const [src2, setSrc2] = useState("");
  const [src3, setSrc3] = useState("");

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.title}>
            <Text>Section #1</Text>
          </View>

          <Image src={src} style={styles.qrImgStyle} />
          <Image src={src2} style={styles.qrImgStyle} />
          <Image src={src} style={styles.qrImgStyle} />
          <Image src={src2} style={styles.qrImgStyle} />
          <Image src={src} style={styles.qrImgStyle} />
          <Image src={src2} style={styles.qrImgStyle} />
          <Image src={src} style={styles.qrImgStyle} />
          <Image src={src2} style={styles.qrImgStyle} />
        </View>
      </Page>
    </Document>
  );

  useEffect(() => {
    const VERSION = 25;

    console.log(testQrData);
    QRCode.toDataURL([{ data: testQrData.dataArr[0], mode: "byte" }], {
      version: VERSION,
      scale: 4,
      type: "image/png",
    }).then((url) => {
      setSrc(url);
    });
    QRCode.toDataURL([{ data: testQrData.dataArr[1], mode: "byte" }], {
      version: VERSION,
      scale: 4,
      type: "image/png",
    }).then((url) => {
      setSrc2(url);
    });
    QRCode.toDataURL([{ data: testQrData.dataArr[2], mode: "byte" }], {
      version: VERSION,
      scale: 4,
      type: "image/png",
    }).then((url) => {
      setSrc3(url);
    });
    //
    // const code = jsQR(imageData, width, height, options);
  }, []);

  const [bb, setBb] = useState(unorderedQrDataArrProcessor());
  //

  return (
    <>
      <Reader
        delay={300}
        onError={(e) => {
          console.log(e);
        }}
        onScan={(e) => {
          console.log(e);
          if (e && (e.binaryData as number[])) {
            const aa = bb.process(new Uint8Array(e.binaryData));
            console.log(aa);
            if (aa.isComplete) {
              const cc = decodeCompleteOrderedQrSet({
                dataArr: aa.orderedDataArr,
              });
              console.log({ cc });
            }
          }
        }}
        style={{ width: "100%" }}
      />
      {/* <PDFViewer width={600} height={900}>
        {doc}
      </PDFViewer> */}

      <img
        src={src}
        alt=""
        style={{
          width: 600,
          height: 600,
        }}
      />
      <img
        src={src2}
        alt=""
        style={{
          width: 600,
          height: 600,
        }}
      />
      <img
        src={src3}
        alt=""
        style={{
          width: 600,
          height: 600,
        }}
      />
    </>
  );
}
