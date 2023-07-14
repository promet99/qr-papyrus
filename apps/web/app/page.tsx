export default function MainPage() {
  return (
    <>
      <div>
        Welcome,
        <p>
          {
            "QR Papyrus makes files and texts (size<128kb) into an array of QR codes, called QR-Papyrus."
          }
          <br />
          <br />
          {
            "QR-Papyrus can be printed on paper, or made into a image slide, so that user can scan them with a QR code scanner to get the original file or text."
          }
          <br />
          <br />
          {
            "This is just a proof of concept, and I wont be developing it further."
          }
          <br />
          <br />
          {"Visit "}
          <a href="https://github.com/promet99/qr-papyrus">Github repo</a>
          {" for more information, and questions"}
        </p>
        <div>
          <a href="/generator">Click here to MAKE QR-Papyrus</a>
        </div>
        <div>
          <a href="/reader">Click here to READ QR-Papyrus</a>
        </div>
      </div>
    </>
  );
}
