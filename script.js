document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const priceSort = document.getElementById("priceSort");
    const categoryFilter = document.getElementById("categoryFilter");
    const productGrid = document.getElementById("productGrid");
    const feedbackLink = document.getElementById("feedbackLink");
    const homeLink = document.getElementById("homeLink");
    const cartCount = document.getElementById("cartCount");

    // ======== TRANG CHỦ ========
    if (!productGrid) {
        if (searchButton && searchInput) {
            searchButton.addEventListener("click", () => {
                const keyword = searchInput.value.trim();
                window.location.href = `sanpham.html${keyword ? `?search=${encodeURIComponent(keyword)}` : ''}`;
            });
        }
        return;
    }

    // ======== TRANG SẢN PHẨM ========
    let originalProducts = Array.from(productGrid.querySelectorAll(".product-card"));

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

    // ======== LỌC & SỰ KIỆN ========
    if (searchButton) searchButton.addEventListener("click", applyFilters);
    if (priceSort) priceSort.addEventListener("change", applyFilters);
    if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);

    // ======== LẤY THAM SỐ URL ========
    const params = new URLSearchParams(window.location.search);
    const keywordFromURL = params.get("search");
    const categoryFromURL = params.get("category");

    if (keywordFromURL && searchInput) searchInput.value = keywordFromURL;
    if (categoryFromURL && categoryFilter) categoryFilter.value = categoryFromURL;

    applyFilters();

    // ======== GIỎ HÀNG ========
    function capNhatSoLuongGioHang() {
        const gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
        const tong = gioHang.reduce((sum, sp) => sum + sp.soLuong, 0);
        if (cartCount) cartCount.textContent = tong;
    }

    function themVaoGioHang(sanPham) {
        let gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
        const index = gioHang.findIndex(item => item.ten === sanPham.ten);
        if (index !== -1) {
            gioHang[index].soLuong += sanPham.soLuong;
        } else {
            gioHang.push(sanPham);
        }
        localStorage.setItem("gioHang", JSON.stringify(gioHang));
        capNhatSoLuongGioHang();
    }

    const nutThem = document.querySelectorAll(".btn-add-to-cart");
    nutThem.forEach(btn => {
        btn.addEventListener("click", () => {
            const ten = btn.dataset.ten;
            const gia = parseInt(btn.dataset.gia);
            const soLuong = parseInt(btn.dataset.soluong) || 1;

            themVaoGioHang({ ten, gia, soLuong });
            alert(`Đã thêm "${ten}" vào giỏ hàng!`);
        });
    });

    capNhatSoLuongGioHang();

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

    // ======== TRANG CHI TIẾT (nếu có nút riêng) ========
    const addToCartBtn = document.getElementById("addToCartBtn");
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            const ten = addToCartBtn.dataset.ten;
            const gia = parseInt(addToCartBtn.dataset.gia);
            const soLuong = parseInt(document.getElementById("quantity").value);
            themVaoGioHang({ ten, gia, soLuong });
            alert("Đã thêm vào giỏ hàng!");
        });
    }
});
s
