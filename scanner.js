function onScanSuccess(decodedText) {
  console.log("Scanned:", decodedText);
}

// Auto size scan box based on screen width
function getQrBoxSize() {
  const width = window.innerWidth;
  return Math.min(width * 0.7, 300);
}

const html5QrCode = new Html5Qrcode("reader");

html5QrCode.start(
  { facingMode: "environment" },
  {
    fps: 10,
    qrbox: getQrBoxSize(),
    aspectRatio: 1.0
  },
  onScanSuccess
).catch(err => {
  console.error("Camera error:", err);
});