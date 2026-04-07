let currentBook = null;
let allBooks = [];

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

function displayBookDetails(book) {
  if (!book) {
    console.error("No book data found");
    window.location.href = "books.html";
    return;
  }

  currentBook = book;

  document.getElementById("book-cover").src = book.image;
  document.getElementById("book-cover").alt = book.title;

  document.getElementById("book-title").textContent = book.title;
  document.getElementById("book-author").textContent =
    book.authors || "Unknown Author";

  const subtitleElement = document.getElementById("book-subtitle");
  if (book.subtitle) {
    subtitleElement.textContent = book.subtitle;
  } else {
    subtitleElement.style.display = "none";
  }

  const starsContainer = document.getElementById("stars-container");
  starsContainer.innerHTML = `
    ${generateStars(book.rating)}
    <span class="rating-text">${book.rating}/5</span>
  `;

  document.getElementById("book-price").textContent = book.price;

  const stockBadge = document.getElementById("stock-badge");
  const isLowStock = book.stock < 10;

  if (book.stock > 0) {
    if (isLowStock) {
      stockBadge.textContent = "⚠️ Low Stock";
      stockBadge.className = "stock-badge low-stock";
    } else {
      stockBadge.textContent = "✓ In Stock";
      stockBadge.className = "stock-badge in-stock";
    }
  } else {
    stockBadge.textContent = "✗ Out of Stock";
    stockBadge.className = "stock-badge out-of-stock";
  }

  const descElement = document.getElementById("book-desc-main");
  if (book.description) {
    descElement.textContent = book.description;
  } else {
    descElement.textContent = `A comprehensive book about ${book.title} by ${book.authors}. This book covers essential topics and provides valuable insights for readers interested in ${book.category}.`;
  }

  document.getElementById("book-publisher").textContent =
    book.publisher || "Unknown";
  document.getElementById("book-year").textContent =
    book.publisherYear || "N/A";

  document.getElementById("book-isbn").textContent =
    book.isbn || "Not Available";

  const stockText = document.getElementById("book-stock");
  if (book.stock > 0) {
    stockText.textContent = `${book.stock} copies available`;
    stockText.style.color = isLowStock ? "#ff6b6b" : "#51cf66";
  } else {
    stockText.textContent = "Currently unavailable";
    stockText.style.color = "#ff6b6b";
  }

  const urlLink = document.getElementById("book-url");
  if (book.url) {
    urlLink.href = book.url;
  } else {
    urlLink.style.display = "none";
  }
}

function addToCart(bookId) {
  if (!currentBook) return;

  addBookToCart(currentBook.id);
}

function toggleBookmark() {
  const bookmarkBtn = document.getElementById("bookmarkBtn");
  const icon = bookmarkBtn.querySelector("i");

  if (icon.classList.contains("fa-regular")) {
    icon.classList.replace("fa-regular", "fa-solid");
    showNotification(`"${currentBook.title}" added to wishlist!`, "success");
  } else {
    icon.classList.replace("fa-solid", "fa-regular");
    showNotification(`"${currentBook.title}" removed from wishlist!`, "info");
  }
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

  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 10000;
      }
      .notification.show {
        transform: translateX(0);
      }
      .notification.success {
        border-left: 4px solid #51cf66;
      }
      .notification.info {
        border-left: 4px solid #339af0;
      }
      .notification i {
        font-size: 20px;
      }
      .notification.success i {
        color: #51cf66;
      }
      .notification.info i {
        color: #339af0;
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

async function navigateBook(direction) {
  if (allBooks.length === 0) return;

  const currentIndex = allBooks.findIndex((b) => b.id === currentBook.id);
  let newIndex;

  if (direction === "prev") {
    newIndex = currentIndex > 0 ? currentIndex - 1 : allBooks.length - 1;
  } else {
    newIndex = currentIndex < allBooks.length - 1 ? currentIndex + 1 : 0;
  }

  const newBook = allBooks[newIndex];
  sessionStorage.setItem("selectedBook", JSON.stringify(newBook));
  displayBookDetails(newBook);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function loadAllBooks() {
  try {
    const response = await fetch("../data/books.json");
    const data = await response.json();
    allBooks = data.books.map((book, index) => ({
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
  } catch (error) {
    console.error("Error loading books:", error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const bookData = sessionStorage.getItem("selectedBook");

  if (!bookData) {
    console.log("No book selected, redirecting...");
    window.location.href = "books.html";
    return;
  }

  const book = JSON.parse(bookData);

  await loadAllBooks();

  displayBookDetails(book);

  document.getElementById("addToCartBtn").addEventListener("click", () => {
    addBookToCart(currentBook.id);
  });
  document
    .getElementById("bookmarkBtn")
    .addEventListener("click", toggleBookmark);

  document
    .getElementById("prev-btn")
    .addEventListener("click", () => navigateBook("prev"));
  document
    .getElementById("next-btn")
    .addEventListener("click", () => navigateBook("next"));
});
