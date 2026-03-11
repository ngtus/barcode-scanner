// ================= INIT ====================
window.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});
// ================= INIT END ====================

// Responsive scan box
function getQrBoxSize() {
  const width = window.innerWidth;
  return {
    width: Math.min(width * 0.8, 400),
    height: 150
  };
}

function startScanner() {

  const html5QrCode = new Html5Qrcode("reader");

  html5QrCode.start(
    {
      facingMode: "environment"
    },
    {
      fps: 20,
      qrbox: getQrBoxSize(),
      aspectRatio: 1.,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E
      ]
    },
    onScanSuccess
  ).catch(err => {
    console.error("Camera error:", err);
  });
}

let scanLocked = false;
const SCAN_DELAY = 1500; // 1.5 seconds
function onScanSuccess(decodedText) {

  if (scanLocked) return;
  scanLocked = true;

  // Show on screen
  document.getElementById("scan-result").textContent = decodedText;

  // Play beep
  playBeep()

  findProduct(decodedText);
  console.log("after beep");
  // Optional: stop after first scan
  // html5QrCode.stop();
  setTimeout(() => {
    scanLocked = false;
  }, SCAN_DELAY);
}

// BEEP
const beep = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

function playBeep() {
  beep.currentTime = 0; // reset so it can replay quickly
  beep.play();
}

// Get list from sheet
const API_URL = "https://script.google.com/macros/s/AKfycbxO6vyKtk-t6Ri1cyg6fDcrbgZkmLsjYuLEoWHj8xD8a0bmrdKWcuUTemRh_xMYkWug2w/exec";

let productDB = {};

async function loadProducts() {

  try {

    const res = await fetch(API_URL);
    const products = await res.json();

    products.forEach(p => {
      productDB[p.barcode] = p;
    });

    console.log("Products loaded:", productDB);

    // hide loader
    document.getElementById("product-loader").style.display = "none";

    // show scanner
    document.getElementById("reader").style.display = "block";

    startScanner();

  } catch (err) {

    document.getElementById("product-loader").innerText =
      "Failed to load products";

    console.error(err);

  }

}

// Find item
let lastScanned = "";

function findProduct(barcode) {

  lastScanned = barcode;

  if (productDB[barcode]) {
    const item = productDB[barcode];
    addToCart(barcode, item);
    document.getElementById("scan-result").innerHTML = `
      ${barcode} - ${item.name}: ${item.price}
    `;
    document.getElementById("add-product").style.display = "none";
  } else {
    document.getElementById("scan-result").innerHTML =
      `Product not found: ${barcode}`;
    document.getElementById("add-product").style.display = "block";
  }
}

// Send new product to googlesheet
function addProduct() {

  const name = document.getElementById("new-name").value;
  const price = document.getElementById("new-price").value;

  const formData = new FormData();

  formData.append("mode", "add");
  formData.append("barcode", lastScanned);
  formData.append("name", name);
  formData.append("price", price);

  // show loading
  document.getElementById("loading").style.display = "block";

  fetch(API_URL, {
    method: "POST",
    body: formData
  })
    .then(r => r.json())
    .then(data => {
      // hide loading
      document.getElementById("loading").style.display = "none";
      if (data.status === "added") {
        productDB[lastScanned] = {
          name: name,
          price: price
        };
        document.getElementById("scan-result").innerHTML =
          "Product added";
        document.getElementById("add-product").style.display = "none";
      }
    })
    .catch(err => {
      document.getElementById("loading").style.display = "none";
      alert("Error saving product");
    });
}

// Cart
let cart = {};
let totalPrice = 0;
function addToCart(barcode, item) {

  if (!cart[barcode]) {

    cart[barcode] = {
      name: item.name,
      price: Number(item.price),
      qty: 1
    };

  } else {

    cart[barcode].qty++;

  }

  renderCart();
}

function renderCart() {

  const body = document.getElementById("cart-body");

  body.innerHTML = "";

  totalPrice = 0;

  for (const code in cart) {

    const item = cart[code];

    const rowTotal = item.price * item.qty;

    totalPrice += rowTotal;

    body.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${item.qty}</td>
        <td>${rowTotal.toFixed(2).toLocaleString("vi-VN")}</td>
      </tr>
    `;

  }

  document.getElementById("cart-total").innerText =
    totalPrice.toFixed(2).toLocaleString("vi-VN");

}

function clearCart() {

  cart = {};
  totalPrice = 0;

  renderCart();

}