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

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.title}>
            <Text>Section #1</Text>
          </View>

          <Image src={src} style={styles.qrImgStyle} />

          <Image src={src} style={styles.qrImgStyle} />
          <Image src={src} style={styles.qrImgStyle} />
          <Image src={src} style={styles.qrImgStyle} />
          <Image src={src} style={styles.qrImgStyle} />
          <Image src={src} style={styles.qrImgStyle} />
          <Image src={src} style={styles.qrImgStyle} />
          <Image src={src} style={styles.qrImgStyle} />
        </View>
      </Page>
    </Document>
  );

  useEffect(() => {
    console.log(testQrData);
    QRCode.toDataURL([{ data: testQrData[0], mode: "byte" }], {
      version: 40,
      scale: 2,
      type: "image/png",
    }).then((url) => {
      setSrc(url);
    });
    QRCode.toDataURL([{ data: testQrData[1], mode: "byte" }], {
      version: 40,
      scale: 2,
      type: "image/png",
    }).then((url) => {
      setSrc2(url);
    });
  }, []);

  return (
    <>
      <PDFViewer width={600} height={900}>
        {doc}
      </PDFViewer>

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
    </>
  );
}
