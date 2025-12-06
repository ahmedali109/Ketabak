document.addEventListener('DOMContentLoaded', () => {
    
    let booksData = [];
    let currentIndex = 0;

    const ui = {
        cover: document.getElementById('book-cover'),
        title: document.getElementById('book-title'),
        author: document.getElementById('book-author'),
        subtitle: document.getElementById('book-subtitle'),
        publisher: document.getElementById('book-publisher'),
        year: document.getElementById('book-year'),
        price: document.getElementById('book-price'),
        isbn: document.getElementById('book-isbn'),
        stockText: document.getElementById('book-stock'),
        stockBadge: document.getElementById('stock-badge'),
        descMain: document.getElementById('book-desc-main'),
        starsContainer: document.getElementById('stars-container'),
        urlBtn: document.getElementById('book-url')
    };

   
    fetch('../data/books.json') 
        .then(response => {
            if (!response.ok) throw new Error("Failed to load JSON");
            return response.json();
        })
        .then(data => {
            if(data.books && data.books.length > 0) {
                booksData = data.books;
                loadBook(currentIndex);
            } else {
                console.error("No books found in JSON");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            ui.title.textContent = "Error loading data.";
        });

    function loadBook(index) {
        const book = booksData[index];

        ui.cover.src = book.image;
        ui.title.textContent = book.title;
        ui.author.textContent = book.authors;
        ui.subtitle.textContent = book.subtitle ? book.subtitle : "IT & Programming Masterpiece";
        
        ui.publisher.textContent = book.publisher;
        ui.year.textContent = book.publisherYear;
        ui.price.textContent = book.price == "$0.00" ? "Free" : book.price;
        ui.isbn.textContent = book.isbn13;
        ui.urlBtn.href = book.url;

        updateStockUI(book.stock);

        ui.descMain.textContent = generateDescription(book);

        renderStars(book.rating);

        ui.cover.style.opacity = 0.5;
        setTimeout(() => ui.cover.style.opacity = 1, 300);
    }

    function updateStockUI(stock) {
        if (parseInt(stock) > 0) {
            ui.stockText.textContent = `${stock} copies available`;
            ui.stockBadge.textContent = "In Stock";
            ui.stockBadge.className = "stock-badge stock-in";
        } else {
            ui.stockText.textContent = "Out of stock";
            ui.stockBadge.textContent = "Sold Out";
            ui.stockBadge.className = "stock-badge stock-out";
        }
    }

    function generateDescription(book) {
        return `Discover "${book.title}", a definitive guide written by ${book.authors}. 
        Published by ${book.publisher} in ${book.publisherYear}, this book is rated ${book.rating}/5 by readers. 
        It is an essential addition to your collection if you are interested in ${book.title.split(' ')[0]} and related technologies.`;
    }

    function renderStars(rating) {
        ui.starsContainer.innerHTML = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            ui.starsContainer.innerHTML += '<i class="fa-solid fa-star"></i>';
        }
        if (hasHalfStar) {
            ui.starsContainer.innerHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            ui.starsContainer.innerHTML += '<i class="fa-regular fa-star"></i>';
        }
        
        ui.starsContainer.innerHTML += ` <span style="color:#bbb; font-size:0.9rem">(${rating})</span>`;
    }

    document.getElementById('next-btn').addEventListener('click', () => {
        if (booksData.length === 0) return;
        currentIndex = (currentIndex + 1) % booksData.length; // لو وصل للأخر يرجع للأول
        loadBook(currentIndex);
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (booksData.length === 0) return;
        currentIndex = (currentIndex - 1 + booksData.length) % booksData.length; // لو في الأول يرجع للأخر
        loadBook(currentIndex);
    });

    const bookmarkBtn = document.getElementById('bookmarkBtn');
    bookmarkBtn.addEventListener('click', () => {
        const icon = bookmarkBtn.querySelector('i');
        icon.classList.toggle('fa-solid');
        icon.classList.toggle('fa-regular');
        
        if(icon.classList.contains('fa-solid')) {
            bookmarkBtn.style.color = "#ee8e3a";
            bookmarkBtn.style.borderColor = "#ee8e3a";
        } else {
            bookmarkBtn.style.color = "";
            bookmarkBtn.style.borderColor = "";
        }
    });
});