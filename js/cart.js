
function getCart() {
  const cart = localStorage.getItem("ketabak_cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("ketabak_cart", JSON.stringify(cart));
  updateCartBadge();
}

function addBookToCart(bookId) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === bookId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: bookId, quantity: 1 });
  }

  saveCart(cart);
  if (typeof showNotification === "function") {
    showNotification("Added successfully", "success");
  }
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badge = document.querySelector(".cart-count");
  if (badge) {
    badge.textContent = totalItems;
  }
}

let allBooksData = [];

async function initCartPage() {
  const cartItemsContainer = document.getElementById("cart-items");
  if (!cartItemsContainer) return; 

  try {
    const response = await fetch("../data/books.json");
    const data = await response.json();
    allBooksData = data.books.map((b, index) => ({ ...b, id: index + 1 }));
    renderCart();
  } catch (error) {
    cartItemsContainer.innerHTML =
      '<div class="error-message">Error loading cart data.</div>';
  }
}

function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");

  if (!cartItemsContainer || !cartTotalElement) return;

  const cart = getCart();
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<div class="empty-cart-msg">Your cart is empty.</div>';
    cartTotalElement.textContent = "$0.00";
    return;
  }

  cart.forEach((item) => {
    const book = allBooksData.find((b) => b.id === item.id);

    if (book) {
      const priceNum = parseFloat(book.price.replace("$", ""));
      const itemTotal = priceNum * item.quantity;
      total += itemTotal;

      cartItemsContainer.innerHTML += `
        <div class="cart-item">
          <img src="${book.image}" alt="${book.title}">
          
          <div class="cart-item-info">
            <h4>${book.title}</h4>
            <p>${book.price}</p>
          </div>
          
          <div class="quantity-controls">
            <button onclick="updateQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
          
          <button class="remove-btn" onclick="removeFromCart(${item.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
    }
  });

  cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

window.updateQuantity = function (id, change) {
  let cart = getCart();
  const item = cart.find((i) => i.id === id);

  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter((i) => i.id !== id);
    }
    saveCart(cart); 
    renderCart();
  }
};

window.removeFromCart = function (id) {
  let cart = getCart();
  cart = cart.filter((i) => i.id !== id);
  saveCart(cart);
  renderCart();
};


document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge(); 
  initCartPage();
});
