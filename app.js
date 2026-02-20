const resultEl = document.getElementById("result");

document.getElementById("startBtn").onclick = startScanner;
document.getElementById("stopBtn").onclick = stopScanner;

// 🔊 beep
const beep = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

let lastScanned = null;

// 🧠 inventory storage
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

/* ---------- SCANNER ---------- */

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

  if (code === lastScanned) return;

  lastScanned = code;
  setTimeout(() => lastScanned = null, 1500);

  resultEl.innerText = "Scanned: " + code;

  feedback();
  saveItem(code);
});

/* ---------- FEEDBACK ---------- */

function feedback() {
  beep.play();

  if (navigator.vibrate) {
    navigator.vibrate(100);
  }
}

/* ---------- INVENTORY ---------- */

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

// render on load
renderInventory();