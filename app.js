Quagga.init({
  inputStream: {
    type: "LiveStream",
    target: document.querySelector('#scanner'),
    constraints: {
      facingMode: "environment" // back camera
    }
  },
  decoder: {
    readers: [
      "ean_reader",
      "code_128_reader",
      "upc_reader"
    ]
  }
}, function(err) {
  if (err) {
    console.error(err);
    return;
  }
  Quagga.start();
});

Quagga.onDetected(function(data) {
  const code = data.codeResult.code;
  document.getElementById("result").innerText = "Result: " + code;
});