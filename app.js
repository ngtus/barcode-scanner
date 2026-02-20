// Beep on scanned
const beep = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

function feedback() {
  beep.play();

  if (navigator.vibrate) {
    navigator.vibrate(100);
  }
}

// Local storage
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

function saveItem(code) {
  if (!inventory[code]) {
    inventory[code] = {
      count: 0,
      lastSeen: new Date().toISOString()
    };
  }

  inventory[code].count += 1;
  inventory[code].lastSeen = new Date().toISOString();

  localStorage.setItem("inventory", JSON.stringify(inventory));

  renderInventory();
}

// Render inventory
function renderInventory() {
  const container = document.getElementById("inventory");
  container.innerHTML = "";

  Object.entries(inventory).forEach(([code, data]) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerText = `${code} | count: ${data.count}`;
    container.appendChild(div);
  });
}

// Flash button
let track;
let flashOn = false;

function enableFlash() {
  const stream = Quagga.CameraAccess.getActiveStream();
  if (!stream) return;

  track = stream.getVideoTracks()[0];

  const capabilities = track.getCapabilities();

  if (!capabilities.torch) {
    alert("Flash not supported 😢");
    return;
  }

  flashOn = !flashOn;

  track.applyConstraints({
    advanced: [{ torch: flashOn }]
  });
}

document.getElementById("flashBtn").onclick = enableFlash;

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

  resultEl.innerText = "Scanned: " + code;
  renderInventory();

  feedback();
  saveItem(code);
});

