// Store recently scanned codes
const scannedCodes = new Set();

// Time before allowing same code again (5 seconds)
const SCAN_COOLDOWN = 1000;


function onScanSuccess(decodedText) {
  // If already scanned recently → ignore
  if (scannedCodes.has(decodedText)) {
    return;
  }

  console.log("Scanned:", decodedText);

  // Add to memory
  scannedCodes.add(decodedText);

  // Remove after cooldown
  setTimeout(() => {
    scannedCodes.delete(decodedText);
  }, SCAN_COOLDOWN);

  // Play beep
  playBeep()

  console.log("after beep");
  // Optional: stop after first scan
  // html5QrCode.stop();
}

// Responsive scan box
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

// BEEP
const beep = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

function playBeep() {
  beep.currentTime = 0; // reset so it can replay quickly
  beep.play();
}