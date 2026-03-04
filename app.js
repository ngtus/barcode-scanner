function onScanSuccess(decodedText, decodedResult) {
  console.log("Scanned Code:", decodedText);
}

function onScanFailure(error) {
  // Optional: console.log(error);
}

const html5QrCode = new Html5Qrcode("reader");

html5QrCode.start(
  { facingMode: "environment" }, // Use back camera
  {
    fps: 10,
    qrbox: 250,
    formatsToSupport: [
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.UPC_A
    ]
  },
  onScanSuccess,
  onScanFailure
).catch(err => {
  console.error("Camera start failed:", err);
});