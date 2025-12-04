let booksData = [];
let filteredBooks = [];
const bestSellerBooks = document.querySelector(".all-books");

window.viewBookDetails = function (bookId) {
  const book = booksData.find((b) => b.id === bookId);
  alert(
    `Quick View: ${book.title}\n\nAuthor: ${book.author}\nCategory: ${book.category}\nPrice: ${book.price}\nRating: ${book.rating}/5\nStock: ${book.stock}\nPublished: ${book.publishedYear}\nPublisher: ${book.publisher}\nISBN: ${book.isbn}`
  );
};

window.addToCart = function (bookId) {
  const book = booksData.find((b) => b.id === bookId);
  console.log(`Added "${book.title}" to cart`);
  showNotification(`"${book.title}" added to cart!`, "success");
};

window.toggleWishlist = function (bookId) {
  const book = booksData.find((b) => b.id === bookId);
  const wishlistBtn = event.target.closest(".wishlist-btn");
  const icon = wishlistBtn.querySelector("i");

  if (icon.classList.contains("far")) {
    icon.classList.replace("far", "fas");
    showNotification(`"${book.title}" added to wishlist!`, "success");
  } else {
    icon.classList.replace("fas", "far");
    showNotification(`"${book.title}" removed from wishlist!`, "info");
  }
};

function createFilterControls() {
  const booksContainer = document.querySelector(".all-books");
  let titleElement = booksContainer.querySelector(".title");
  if (!titleElement) {
    titleElement = document.createElement("h2");
    titleElement.className = "title";
    titleElement.textContent = "All Books";
    booksContainer.appendChild(titleElement);
  }

  const filterContainer = document.createElement("div");
  filterContainer.className = "filter-container";
  filterContainer.innerHTML = `
    <div class="filter-controls">
      <div class="search-filter">
        <input type="text" id="searchInput" placeholder="Search books..." class="search-input">
        <i class="fas fa-search search-icon"></i>
      </div>
      
      <select id="categoryFilter" class="filter-select">
        <option value="">All Categories</option>
      </select>
      
      <select id="priceFilter" class="filter-select">
        <option value="">All Prices</option>
        <option value="0-15">$0 - $15</option>
        <option value="15-25">$15 - $25</option>
        <option value="25-35">$25 - $35</option>
      </select>
      
      <select id="ratingFilter" class="filter-select">
        <option value="">All Ratings</option>
        <option value="4.5">4.5+ Stars</option>
        <option value="4.0">4.0+ Stars</option>
        <option value="3.5">3.5+ Stars</option>
      </select>
      
      <button id="clearFilters" class="clear-btn">
        <i class="fas fa-times"></i> Clear
      </button>
    </div>
  `;

  titleElement.insertAdjacentElement("afterend", filterContainer);
}

function createBookCard(book) {
  const isLowStock = book.stock < 10;
  const discountPercentage = Math.floor(Math.random() * 20) + 5;

  return `
    <div class="modern-card" data-category="${book.category}" data-price="${
    book.price
  }" data-rating="${book.rating}">
      <div class="card-header">
        ${
          isLowStock
            ? '<div class="stock-badge low-stock">Low Stock!</div>'
            : ""
        }
        <div class="discount-badge">-${discountPercentage}%</div>
      </div>
      
      <div class="book-image-container">
        <img src="${book.image}" alt="${book.title}" class="book-image" />
        <div class="book-overlay">
          <button class="quick-view-btn" onclick="viewBookDetails(${book.id})">
            <i class="fas fa-eye"></i> Quick View
          </button>
        </div>
      </div>
      
      <div class="book-info">
        <div class="category-tag">${book.category}</div>
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">by ${book.authors}</p>
        
        <div class="rating-container">
          <div class="stars">${generateStars(book.rating)}</div>
          <span class="rating-text">${book.rating}</span>
        </div>
        
        <div class="book-meta">
          <span class="publish-year">${book.publisherYear}</span>
          <span class="publisher">${book.publisher}</span>
        </div>
        
        <div class="price-container">
          <span class="original-price">$${(
            parseFloat(book.price.replace("$", "")) *
            (1 + discountPercentage / 100)
          ).toFixed(2)}</span>
          <span class="current-price">${book.price}</span>
        </div>
        
        <div class="stock-info">
          <span class="stock-count ${isLowStock ? "low" : ""}">${
    book.stock
  } in stock</span>
        </div>
        
        <div class="card-actions">
          <button class="add-to-cart-btn" onclick="addToCart(${book.id})">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button class="wishlist-btn" onclick="toggleWishlist(${book.id})">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let starsHTML = "";

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  return starsHTML;
}

function populateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(booksData.map((book) => book.category))];

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterBooks() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const categoryFilter = document.getElementById("categoryFilter").value;
  const priceFilter = document.getElementById("priceFilter").value;
  const ratingFilter = document.getElementById("ratingFilter").value;

  filteredBooks = booksData.filter((book) => {
    const matchesSearch =
      !searchTerm ||
      book.title.toLowerCase().includes(searchTerm) ||
      book.authors.toLowerCase().includes(searchTerm);

    const matchesCategory = !categoryFilter || book.category === categoryFilter;

    let matchesPrice = true;
    if (priceFilter) {
      const [min, max] = priceFilter.split("-").map(Number);
      const bookPrice = parseFloat(book.price.replace("$", ""));
      matchesPrice = bookPrice >= min && bookPrice <= max;
    }

    const matchesRating =
      !ratingFilter || book.rating >= parseFloat(ratingFilter);

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  displayBooks(filteredBooks);
}

function displayBooks(books) {
  // Clear only the book cards, not the title and filters
  const existingCards = bestSellerBooks.querySelectorAll(
    ".modern-card, .no-results, .error-message"
  );
  existingCards.forEach((card) => card.remove());

  if (books.length === 0) {
    bestSellerBooks.insertAdjacentHTML(
      "beforeend",
      `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <h3>No books found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    `
    );
    return;
  }

  books.forEach((book) => {
    bestSellerBooks.insertAdjacentHTML("beforeend", createBookCard(book));
  });
}

function clearAllFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("categoryFilter").value = "";
  document.getElementById("priceFilter").value = "";
  document.getElementById("ratingFilter").value = "";
  displayBooks(booksData);
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas ${
      type === "success" ? "fa-check-circle" : "fa-info-circle"
    }"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

(async () => {
  try {
    const response = await fetch("../data/books.json");
    const data = await response.json();
    booksData = data.books.map((book, index) => ({
      ...book,
      id: index + 1,
      category: book.title.toLowerCase().includes("python")
        ? "Python"
        : book.title.toLowerCase().includes("machine learning") ||
          book.title.toLowerCase().includes("ml")
        ? "Machine Learning"
        : book.title.toLowerCase().includes("data")
        ? "Data Science"
        : book.title.toLowerCase().includes("c++") ||
          book.title.toLowerCase().includes("c & gui")
        ? "C/C++"
        : book.title.toLowerCase().includes("snowflake")
        ? "Database"
        : book.title.toLowerCase().includes("javascript") ||
          book.title.toLowerCase().includes("js")
        ? "JavaScript"
        : book.title.toLowerCase().includes("web")
        ? "Web Development"
        : "Programming",
    }));

    filteredBooks = [...booksData];

    createFilterControls();
    populateCategoryFilter();
    displayBooks(booksData);

    document
      .getElementById("searchInput")
      .addEventListener("input", filterBooks);
    document
      .getElementById("categoryFilter")
      .addEventListener("change", filterBooks);
    document
      .getElementById("priceFilter")
      .addEventListener("change", filterBooks);
    document
      .getElementById("ratingFilter")
      .addEventListener("change", filterBooks);
    document
      .getElementById("clearFilters")
      .addEventListener("click", clearAllFilters);
  } catch (error) {
    console.error("Error fetching books:", error);
    bestSellerBooks.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Error loading books</h3>
        <p>Please try refreshing the page</p>
      </div>
    `;
  }
})();
