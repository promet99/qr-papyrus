import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";

const pdfStyle = StyleSheet.create({
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

export const QrPdf = ({ srcArr }: { srcArr: string[] }) => (
  <PDFViewer width={600} height={900}>
    <Document>
      <Page size="A4" style={pdfStyle.page}>
        <View style={pdfStyle.section}>
          <View style={pdfStyle.title}>
            <Text>QR-Papyrus</Text>
          </View>
          {srcArr.map((src) => (
            <Image src={src[0]} style={pdfStyle.qrImgStyle} />
          ))}
        </View>
      </Page>
    </Document>
  </PDFViewer>
);
