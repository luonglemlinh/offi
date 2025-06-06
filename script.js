document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const priceSort = document.getElementById("priceSort");
    const categoryFilter = document.getElementById("categoryFilter");
    const productGrid = document.getElementById("productGrid");
    const feedbackLink = document.getElementById("feedbackLink");
    const homeLink = document.getElementById("homeLink");

    // ======== TRANG CHỦ (không có productGrid) ========
    if (!productGrid) {
        if (searchButton && searchInput) {
            searchButton.addEventListener("click", () => {
                const keyword = searchInput.value.trim();
                if (keyword !== "") {
                    window.location.href = `sanpham.html?search=${encodeURIComponent(keyword)}`;
                } else {
                    window.location.href = `sanpham.html`;
                }
            });
        }
        return;
    }

    // ======== TRANG SẢN PHẨM ========
    let originalProducts = Array.from(productGrid.querySelectorAll(".product-card"));
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get("search");

if (searchQuery) {
    searchInput.value = searchQuery;
    filterBySearchKeyword(searchQuery);
}

function filterBySearchKeyword(keyword) {
    keyword = keyword.toLowerCase();
    productGrid.innerHTML = "";

    const filtered = originalProducts.filter(card => {
        const name = card.querySelector("h3").textContent.toLowerCase();
        return name.includes(keyword);
    });

    filtered.forEach(card => productGrid.appendChild(card));
}


    
    function getPriceValue(card) {
        const priceText = card.querySelector("p").textContent;
        const numberMatch = priceText.match(/\d+/g);
        return numberMatch ? parseInt(numberMatch.join("")) : 0;
    }

    function applyFilters() {
        const keyword = searchInput?.value.trim().toLowerCase() || "";
        const sortOrder = priceSort?.value || "asc";
        const selectedCategory = categoryFilter?.value || "all";

        let filtered = originalProducts.filter(card => {
            const name = card.querySelector("h3").textContent.toLowerCase();
            const category = card.getAttribute("data-category");
            const matchKeyword = keyword === "" || name.includes(keyword);
            const matchCategory = selectedCategory === "all" || category === selectedCategory;
            return matchKeyword && matchCategory;
        });

        filtered.sort((a, b) => {
            const priceA = getPriceValue(a);
            const priceB = getPriceValue(b);
            return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
        });

        productGrid.innerHTML = "";
        filtered.forEach(card => productGrid.appendChild(card));
    }

    // ======== GÁN SỰ KIỆN LỌC ========
    if (searchButton) searchButton.addEventListener("click", applyFilters);
    if (priceSort) priceSort.addEventListener("change", applyFilters);
    if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);

    // ======== LẤY THAM SỐ TỪ URL ========
    const params = new URLSearchParams(window.location.search);
    const keywordFromURL = params.get("search");
    const categoryFromURL = params.get("category");

    if (keywordFromURL && searchInput) {
        searchInput.value = keywordFromURL;
    }
    if (categoryFromURL && categoryFilter) {
        categoryFilter.value = categoryFromURL;
    }

    applyFilters(); // Áp dụng bộ lọc ban đầu

    // ======== GIỎ HÀNG ========
    function themVaoGioHang(sanPham) {
        let gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
        const index = gioHang.findIndex(item => item.ten === sanPham.ten);
        if (index !== -1) {
            gioHang[index].soLuong += 1;
        } else {
            gioHang.push({ ...sanPham, soLuong: 1 });
        }
        localStorage.setItem("gioHang", JSON.stringify(gioHang));
    }

    const nutThem = document.querySelectorAll(".btn-add-to-cart");
    nutThem.forEach(btn => {
        btn.addEventListener("click", () => {
            const sanPham = {
                ten: btn.dataset.ten,
                gia: parseInt(btn.dataset.gia)
            };
            themVaoGioHang(sanPham);
            alert(` Đã thêm "${sanPham.ten}" vào giỏ hàng!`);
        });
    });

    // ======== LINK CHUYỂN TRANG ========
    if (homeLink) {
        homeLink.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href = "index.html";
        });
    }

    if (feedbackLink) {
        feedbackLink.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href = "phanhoi.html";
        });
    }
});

// Thêm sản phẩm vào giỏ
document.addEventListener('DOMContentLoaded', () => {
  const addToCartBtn = document.getElementById('addToCartBtn');
  const cartCount = document.getElementById('cartCount');

  // Load số lượng sản phẩm từ localStorage
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) cartCount.textContent = count;
  };

  updateCartCount();

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const name = addToCartBtn.dataset.ten;
      const price = parseInt(addToCartBtn.dataset.gia);
      const quantity = parseInt(document.getElementById('quantity').value);

      const newItem = { name, price, quantity };

      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Kiểm tra nếu đã có sản phẩm thì tăng số lượng
      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push(newItem);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      alert('Đã thêm vào giỏ hàng!');
    });
  }
});
.container.right-panel-active .sign-up-container {
    transform: translateX(100%); /* Di chuyển vào vị trí */
    opacity: 1; /* Hiển thị rõ ràng */
    z-index: 5; /* Nằm trên các phần tử khác */
    animation: show 0.6s;
}

