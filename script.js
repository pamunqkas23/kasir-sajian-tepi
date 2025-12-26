let total = 0;
let cart = JSON.parse(localStorage.getItem("cart")) || {};
let products = JSON.parse(localStorage.getItem("products")) || [];
let riwayat = JSON.parse(localStorage.getItem("riwayat")) || [];

function bayar() {
  if (Object.keys(cart).length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  const bayar = parseRupiah(document.getElementById("bayar").value);
  if (bayar < total) {
    alert("Uang bayar kurang!");
    return;
  }

  const transaksi = {
    tanggal: new Date().toLocaleString("id-ID"),
    items: cart,
    total: total,
    bayar: bayar,
    kembalian: bayar - total
  };

  // SIMPAN RIWAYAT
  riwayat.push(transaksi);
  localStorage.setItem("riwayat", JSON.stringify(riwayat));

  alert("Transaksi berhasil!");

  // RESET
  cart = {};
  localStorage.removeItem("cart");
  document.getElementById("bayar").value = "";
  document.getElementById("kembalian").innerText = "Rp0";
  renderCart();
}

/* ================= UTIL ================= */
function formatRupiah(num) {
  return "Rp" + num.toLocaleString("id-ID");
}

function parseRupiah(value) {
  return parseInt(value.replace(/[^0-9]/g, "")) || 0;
}

/* ================= PRODUK ================= */
function renderProducts() {
  const list = document.getElementById("productList");
  const keyword = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("category").value;

  list.innerHTML = "";

  products
    .filter(p => {
      const matchCategory = category === "ALL" || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(keyword);
      return matchCategory && matchSearch;
    })
    .forEach(p => {
      list.innerHTML += `
        <div class="item">
          <span>${p.name}</span>
          <span class="price">${formatRupiah(p.price)}</span>
          <button onclick="addItem('${p.name}',${p.price})">+</button>
        </div>
      `;
    });
}

/* ================= KERANJANG ================= */
function renderCart() {
  const cartDiv = document.getElementById("cart");
  cartDiv.innerHTML = "";
  total = 0;

  for (let name in cart) {
    const item = cart[name];
    const subtotal = item.price * item.qty;
    total += subtotal;

    cartDiv.innerHTML += `
      <div class="cart-row">
        <span class="cart-name">${name}</span>

        <span class="cart-price">${formatRupiah(item.price)}</span>

        <div class="cart-qty">
          <button class="qty-btn" onclick="decrease('${name}')">-</button>
          <span class="qty">${item.qty}</span>
          <button class="qty-btn" onclick="increase('${name}')">+</button>
        </div>
      </div>
    `;
  }

  document.getElementById("totalHarga").innerText = formatRupiah(total);
  hitungKembalian();
}
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addItem(name, price) {
  if (!cart[name]) {
    cart[name] = { price, qty: 1 };
  } else {
    cart[name].qty++;
  }
  saveCart();
  renderCart();
}

function increase(name) {
  cart[name].qty++;
  saveCart();
  renderCart();
}

function decrease(name) {
  cart[name].qty--;
  if (cart[name].qty <= 0) delete cart[name];
  saveCart();
  renderCart();
}

/* ================= BAYAR ================= */
renderRiwayat();
function hitungKembalian() {
  const bayar = parseRupiah(document.getElementById("bayar").value);
  const kembalian = bayar - total;

  document.getElementById("kembalian").innerText =
    kembalian >= 0 ? formatRupiah(kembalian) : "Rp0";
}

function formatInputBayar() {
  const input = document.getElementById("bayar");
  const angka = parseRupiah(input.value);
  input.value = angka ? formatRupiah(angka) : "";
  hitungKembalian();
}
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
});
function renderRiwayat() {
  const div = document.getElementById("riwayat");
  if (!div) return;

  div.innerHTML = "";

  riwayat.slice().reverse().forEach((t, i) => {
    div.innerHTML += `
      <div class="riwayat-item">
        <b>#${riwayat.length - i}</b><br>
        ${t.tanggal}<br>
        Total: ${formatRupiah(t.total)}<br>
        Bayar: ${formatRupiah(t.bayar)}<br>
        Kembali: ${formatRupiah(t.kembalian)}
        <hr>
      </div>
    `;
  });
}
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  renderRiwayat();
});