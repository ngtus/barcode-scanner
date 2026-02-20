const resultEl = document.getElementById("result");

document.getElementById("startBtn").onclick = startScanner;
document.getElementById("stopBtn").onclick = stopScanner;

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
  resultEl.innerText = "Scanned: " + code;
});