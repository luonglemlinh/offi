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

 document.addEventListener("DOMContentLoaded", function () {

    // Cập nhật số lượng sản phẩm trong icon giỏ hàng
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("gioHang")) || [];
        const totalCount = cart.reduce((sum, item) => sum + item.soLuong, 0);
        const cartCount = document.querySelector(".cart-count");
        if (cartCount) {
            cartCount.textContent = totalCount;
        }
    }

    // Thêm sản phẩm vào giỏ hàng (localStorage)
    function themVaoGioHang(sanPham) {
        if (!sanPham || !sanPham.ten) return;

        const cart = JSON.parse(localStorage.getItem("gioHang")) || [];

        // Kiểm tra nếu đã có sản phẩm, cộng dồn số lượng
        const index = cart.findIndex(item => item.ten === sanPham.ten);
        if (index >= 0) {
            cart[index].soLuong += sanPham.soLuong;
        } else {
            cart.push(sanPham);
        }

        localStorage.setItem("gioHang", JSON.stringify(cart));
        updateCartCount();
    }

    // ==================== XỬ LÝ TRANG DANH SÁCH SẢN PHẨM =====================

    const btnAddToCartList = document.querySelectorAll(".btn-add-to-cart");
    btnAddToCartList.forEach(btn => {
        btn.addEventListener("click", () => {
            const ten = btn.dataset.ten;
            const giaText = btn.dataset.gia || "0";
            const gia = parseInt(giaText.replace(/[^\d]/g, ""));
            const soLuong = 1; // Mặc định mỗi lần ấn thêm 1 sản phẩm
            themVaoGioHang({ ten, gia, soLuong });
            alert(`Đã thêm "${ten}" vào giỏ hàng!`);
        });
    });

    // ==================== XỬ LÝ TRANG CHI TIẾT SẢN PHẨM =====================

    const nutThemChiTiet = document.getElementById("addToCartBtn");
    if (nutThemChiTiet) {
        nutThemChiTiet.addEventListener("click", () => {
            const ten = nutThemChiTiet.dataset.ten;
            const giaText = nutThemChiTiet.dataset.gia || "0";
            const gia = parseInt(giaText.replace(/[^\d]/g, ""));
            const soLuongInput = document.getElementById("quantity");
            const soLuong = parseInt(soLuongInput?.value || 1);

            if (soLuong <= 0 || isNaN(soLuong)) {
                alert("Vui lòng nhập số lượng hợp lệ.");
                return;
            }

            themVaoGioHang({ ten, gia, soLuong });
            alert(`Đã thêm "${ten}" (${soLuong} cái) vào giỏ hàng!`);
        });
    }

    // ==================== XỬ LÝ TRANG GIỎ HÀNG =====================

    if (document.getElementById("cart-table")) {
        const tbody = document.querySelector("#cart-table tbody");
        const cartTotal = document.getElementById("cart-total");
        const emptyMessage = document.getElementById("empty-message");
        const clearCartBtn = document.getElementById("clear-cart");

        function renderCart() {
            const cart = JSON.parse(localStorage.getItem("gioHang")) || [];
            tbody.innerHTML = "";

            if (cart.length === 0) {
                emptyMessage.style.display = "block";
                cartTotal.textContent = "0₫";
                return;
            } else {
                emptyMessage.style.display = "none";
            }

            let total = 0;
            cart.forEach((item, index) => {
                const thanhTien = item.gia * item.soLuong;
                total += thanhTien;

                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td style="text-align:center;">${index + 1}</td>
                    <td>${item.ten}</td>
                    <td style="text-align:center;">${item.soLuong}</td>
                    <td style="text-align:right;">${item.gia.toLocaleString()}₫</td>
                    <td style="text-align:right;">${thanhTien.toLocaleString()}₫</td>
                    <td style="text-align:center;">
                        <button class="btn-remove" data-ten="${item.ten}">Xóa</button>
                    </td>
                `;

                tbody.appendChild(tr);
            });

            cartTotal.textContent = total.toLocaleString() + "₫";

            // Thêm sự kiện xóa từng sản phẩm
            const btnRemoveList = tbody.querySelectorAll(".btn-remove");
            btnRemoveList.forEach(btn => {
                btn.addEventListener("click", () => {
                    const tenSP = btn.dataset.ten;
                    let cart = JSON.parse(localStorage.getItem("gioHang")) || [];
                    cart = cart.filter(item => item.ten !== tenSP);
                    localStorage.setItem("gioHang", JSON.stringify(cart));
                    renderCart();
                    updateCartCount();
                });
            });
        }

        clearCartBtn.addEventListener("click", () => {
            if (confirm("Bạn có chắc muốn xóa hết giỏ hàng không?")) {
                localStorage.removeItem("gioHang");
                renderCart();
                updateCartCount();
            }
        });

        renderCart();
    }

    // Cập nhật lại số lượng sản phẩm trong icon giỏ hàng khi trang load
    updateCartCount();
});

