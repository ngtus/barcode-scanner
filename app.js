const resultEl = document.getElementById("result");

document.getElementById("startBtn").onclick = startScanner;
document.getElementById("stopBtn").onclick = stopScanner;

// 🔊 Beep sound
const beep = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

// 🧠 Prevent duplicate spam
let lastScanned = null;

function startScanner() {
  Quagga.init({
    inputStream: {
      type: "LiveStream",
      target: document.querySelector('#scanner'),
      constraints: {
        facingMode: "environment"
      }
    },
    decoder: {
      readers: ["ean_reader", "code_128_reader", "upc_reader"]
    }
  }, function(err) {
    if (err) {
      console.error(err);
      return;
    }
    Quagga.start();
  });
}

function stopScanner() {
  Quagga.stop();
}

Quagga.onDetected(function(data) {
  const code = data.codeResult.code;

  // 🚫 block duplicate scans
  if (code === lastScanned) return;

  lastScanned = code;
  setTimeout(() => {
    lastScanned = null;
  }, 1500);

  resultEl.innerText = "Scanned: " + code;

  feedback();
});

// 🔊📳 feedback
function feedback() {
  beep.play();

  if (navigator.vibrate) {
    navigator.vibrate(100);
  }
}