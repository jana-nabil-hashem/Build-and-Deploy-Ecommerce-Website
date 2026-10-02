// cart.html: shows the products saved by "Add To Cart"
// (uses getCart / saveCart / esc from script.js, so script.js must be loaded first)

alert("cart.js loaded: " + localStorage.getItem("cart"));
(function () {
  const tbody = document.getElementById("cart-body");
  if (!tbody) return;

  const table = tbody.closest("table");
  const emptyMsg = document.getElementById("empty-msg");
  const totalBox = document.getElementById("cart-total");
  const subtotalEl = document.getElementById("subtotal-amount");
  const totalEl = document.getElementById("total-amount");

  function render() {
    const cart = getCart();

    if (!cart.length) {
      table.style.display = "none";
      totalBox.style.display = "none";
      emptyMsg.style.display = "block";
      return;
    }

    table.style.display = "";
    totalBox.style.display = "";
    emptyMsg.style.display = "none";

    let total = 0;
    tbody.innerHTML = cart
      .map((item, i) => {
        const sub = item.price * item.qty;
        total += sub;
        return `
          <tr>
            <td><a href="#" class="remove" data-act="del" data-i="${i}"><i class="far fa-times-circle"></i></a></td>
            <td><img src="${esc(item.img)}" alt=""></td>
            <td>${esc(item.name)}</td>
            <td>${esc(item.size)}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><input type="number" min="1" value="${item.qty}" data-i="${i}"></td>
            <td>$${sub.toFixed(2)}</td>
          </tr>`;
      })
      .join("");

    subtotalEl.textContent = "$" + total.toFixed(2);
    totalEl.textContent = "$" + total.toFixed(2);
  }

  // remove a product
  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act='del']");
    if (!btn) return;
    e.preventDefault();
    const cart = getCart();
    cart.splice(parseInt(btn.dataset.i), 1);
    saveCart(cart);
    render();
  });

  // change the quantity
  tbody.addEventListener("change", (e) => {
    if (e.target.type !== "number") return;
    const cart = getCart();
    const i = parseInt(e.target.dataset.i);
    if (!cart[i]) return;
    cart[i].qty = Math.max(1, parseInt(e.target.value) || 1);
    saveCart(cart);
    render();
  });

  render();
})();