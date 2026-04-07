document.addEventListener("DOMContentLoaded", async function () {
  const currentUserJson = localStorage.getItem("currentUser");

  if (!currentUserJson) {
    window.location.href = "login.html";
    return;
  }

  const currentUser = JSON.parse(currentUserJson);
  const profileNameElement = document.getElementById("profileFullName");
  const profileEmailElement = document.getElementById("profileEmail");
  const profileLogoutBtn = document.getElementById("profileLogoutBtn");

  const wishlistSection = document.getElementById("wishlistSection");
  const checkoutSection = document.getElementById("checkoutSection");
  const wishlistContainer = document.getElementById("wishlistContainer");
  const checkoutContainer = document.getElementById("checkoutContainer");

  const myAccountBtn = document.getElementById("myAccountBtn");
  const viewWishlistBtn = document.getElementById("viewWishlistBtn");
  const viewCheckoutBtn = document.getElementById("viewCheckoutBtn");

  if (profileNameElement && profileEmailElement) {
    const fullName = `${currentUser.firstName || ""} ${currentUser.lastName || ""}`;
    profileNameElement.textContent = fullName.trim() || "User Name";
    profileEmailElement.textContent = currentUser.email || "email@example.com";
  }

  if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
      }
    });
  }

  function switchTab(activeBtn, activeSection) {
    [myAccountBtn, viewWishlistBtn, viewCheckoutBtn].forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");

    [wishlistSection, checkoutSection].forEach(sec => {
      sec.classList.add("hidden");
      sec.setAttribute("aria-hidden", "true");
    });

    activeSection.classList.remove("hidden");
    activeSection.setAttribute("aria-hidden", "false");
  }

  myAccountBtn.addEventListener("click", () => {
    switchTab(myAccountBtn, wishlistSection);
    loadWishlist();
  });

  viewWishlistBtn.addEventListener("click", () => {
    switchTab(viewWishlistBtn, wishlistSection);
    loadWishlist();
  });

  viewCheckoutBtn.addEventListener("click", () => {
    switchTab(viewCheckoutBtn, checkoutSection);
    loadCheckout();
  });

  async function loadWishlist() {
    try {
      const response = await fetch("../data/books.json");
      const data = await response.json();
      const allBooks = data.books.map((book, index) => ({ ...book, id: index + 1 }));
      const savedWishlistIds = JSON.parse(localStorage.getItem("ketabak_wishlist")) || [];
      const wishlistBooks = allBooks.filter(book => savedWishlistIds.includes(book.id));

      if (wishlistBooks.length === 0) {
        wishlistContainer.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-heart-broken" aria-hidden="true"></i>
            <h3>Your wishlist is empty</h3>
            <a href="books.html" class="btn-primary">Explore Books</a>
          </div>
        `;
        return;
      }

      wishlistContainer.innerHTML = wishlistBooks.map(book => {
        const discountPercentage = Math.floor(Math.random() * 20) + 5;
        return `
          <article class="modern-card wishlist-card">
            <div class="card-header">
              <span class="discount-badge">-${discountPercentage}%</span>
              <button onclick="removeFromWishlist(${book.id})" class="remove-wishlist-btn" aria-label="Remove ${book.title} from wishlist">
                <i class="fas fa-trash" aria-hidden="true"></i>
              </button>
            </div>
            <div class="book-image-container">
              <img src="${book.image}" alt="${book.title}" loading="lazy" />
            </div>
            <div class="book-info">
              <h3>${book.title}</h3>
              <div class="current-price">${book.price}</div>
              <button onclick="addBookToCart(${book.id})" class="add-cart-btn" aria-label="Add ${book.title} to cart">Add to Cart</button>
            </div>
          </article>
        `;
      }).join('');
    } catch (error) {
      wishlistContainer.innerHTML = `<p class="error-msg" role="alert">Failed to load wishlist.</p>`;
    }
  }

  async function loadCheckout() {
    try {
      const cartItems = JSON.parse(localStorage.getItem("ketabak_cart")) || [];
      
      if (cartItems.length === 0) {
        checkoutContainer.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <i class="fas fa-shopping-cart" aria-hidden="true"></i>
            <h3>Your cart is empty</h3>
            <p>You need to add books to your cart before checking out.</p>
            <a href="books.html" class="btn-primary">Shop Now</a>
          </div>
        `;
        return;
      }

      const response = await fetch("../data/books.json");
      const data = await response.json();
      const allBooks = data.books.map((book, index) => ({ ...book, id: index + 1 }));

      let subtotal = 0;
      const orderItemsHtml = cartItems.map(cartItem => {
        const book = allBooks.find(b => b.id === cartItem.id);
        if (book) {
          const itemPrice = parseFloat(book.price.replace("$", ""));
          const itemTotal = itemPrice * cartItem.quantity;
          subtotal += itemTotal;
          return `
            <div class="order-item">
              <span>${book.title} (x${cartItem.quantity})</span>
              <span>$${itemTotal.toFixed(2)}</span>
            </div>
          `;
        }
        return '';
      }).join('');

      const tax = subtotal * 0.14;
      const shipping = 5.00;
      const finalTotal = subtotal + tax + shipping;

      checkoutContainer.innerHTML = `
        <div class="checkout-form-box">
          <h3>Shipping Details</h3>
          <form id="checkoutForm" aria-label="Shipping Details Form">
            <div class="form-group">
              <label for="fullName">Full Name</label>
              <input type="text" id="fullName" value="${currentUser.firstName} ${currentUser.lastName}" required aria-required="true">
            </div>
            <div class="form-group">
              <label for="address">Delivery Address</label>
              <input type="text" id="address" placeholder="123 Main St, City" required aria-required="true">
            </div>
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input type="tel" id="phone" placeholder="+20 123 456 7890" required aria-required="true">
            </div>
            <button type="submit" class="place-order-btn">Place Order - $${finalTotal.toFixed(2)}</button>
          </form>
        </div>
        
        <aside class="order-summary-box" aria-label="Order Summary">
          <h3>Order Summary</h3>
          <div class="order-items-list">
            ${orderItemsHtml}
          </div>
          <div class="order-calculations">
            <div class="calc-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
            <div class="calc-row"><span>Tax (14%)</span><span>$${tax.toFixed(2)}</span></div>
            <div class="calc-row"><span>Shipping</span><span>$${shipping.toFixed(2)}</span></div>
            <div class="calc-row total-row"><span>Total</span><span aria-live="polite">$${finalTotal.toFixed(2)}</span></div>
          </div>
        </aside>
      `;

      document.getElementById("checkoutForm").addEventListener("submit", function(e) {
        e.preventDefault();
        localStorage.removeItem("ketabak_cart");
        
        checkoutContainer.innerHTML = `
          <div class="empty-state success-state" style="grid-column: 1 / -1;" role="alert">
            <i class="fas fa-check-circle" style="color: #2ed573;" aria-hidden="true"></i>
            <h3>Order Placed Successfully!</h3>
            <p>Thank you for shopping with Ketabak. Your books are on the way.</p>
            <a href="books.html" class="btn-primary">Continue Shopping</a>
          </div>
        `;
        
        const cartCountHeader = document.querySelector(".cart-count");
        if(cartCountHeader) cartCountHeader.textContent = "0";
      });

    } catch (error) {
      checkoutContainer.innerHTML = `<p class="error-msg" role="alert">Failed to load checkout details.</p>`;
    }
  }

  window.removeFromWishlist = function(bookId) {
    let wishlist = JSON.parse(localStorage.getItem("ketabak_wishlist")) || [];
    wishlist = wishlist.filter(id => id !== bookId);
    localStorage.setItem("ketabak_wishlist", JSON.stringify(wishlist));
    loadWishlist(); 
  };

  const urlParams = new URLSearchParams(window.location.search);
  const activeTab = urlParams.get('tab');

  if (activeTab === 'checkout') {
    switchTab(viewCheckoutBtn, checkoutSection);
    loadCheckout();
  } else {
    switchTab(viewWishlistBtn, wishlistSection);
    loadWishlist();
  }
});