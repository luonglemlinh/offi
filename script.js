document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const priceSort = document.getElementById("priceSort");
    const categoryFilter = document.getElementById("categoryFilter");
    const productGrid = document.getElementById("productGrid");
    const feedbackLink = document.getElementById("feedbackLink");
    const homeLink = document.getElementById("homeLink");
    const cartCount = document.querySelector(".cart-count"); // Sử dụng querySelector cho class

    // ======== TRANG CHỦ ========
    // Kiểm tra xem có phải trang sản phẩm không để tránh lỗi
    if (productGrid) {
        // Nếu là trang sản phẩm, tiếp tục với các chức năng lọc/sắp xếp
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

        // ======== LỌC & SỰ KIỆN (chỉ trên trang sản phẩm) ========
        if (searchButton) searchButton.addEventListener("click", applyFilters);
        if (priceSort) priceSort.addEventListener("change", applyFilters);
        if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);

        // ======== LẤY THAM SỐ URL ========
        const params = new URLSearchParams(window.location.search);
        const keywordFromURL = params.get("search");
        const categoryFromURL = params.get("category");

        if (keywordFromURL && searchInput) searchInput.value = keywordFromURL;
        if (categoryFromURL && categoryFilter) categoryFilter.value = categoryFromURL;

        applyFilters(); // Áp dụng bộ lọc khi tải trang
    } else {
        // Nếu không phải trang sản phẩm (ví dụ trang chủ), chỉ xử lý search
        if (searchButton && searchInput) {
            searchButton.addEventListener("click", () => {
                const keyword = searchInput.value.trim();
                window.location.href = `sanpham.html${keyword ? `?search=${encodeURIComponent(keyword)}` : ''}`;
            });
        }
    }


    // ======== GIỎ HÀNG ========
    function capNhatSoLuongGioHang() {
        const gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
        const tong = gioHang.reduce((sum, sp) => sum + sp.soLuong, 0);
        if (cartCount) cartCount.textContent = tong;
    }

    function themVaoGioHang(sanPhamMoi) {
        let gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa (dựa trên id)
        const index = gioHang.findIndex(item => item.id === sanPhamMoi.id);

        if (index !== -1) {
            // Nếu đã có, tăng số lượng
            gioHang[index].soLuong += sanPhamMoi.soLuong;
        } else {
            // Nếu chưa có, thêm sản phẩm mới vào
            gioHang.push(sanPhamMoi);
        }
        localStorage.setItem("gioHang", JSON.stringify(gioHang));
        capNhatSoLuongGioHang();
    }

    // Lắng nghe sự kiện click cho các nút "Thêm vào giỏ hàng" trên trang sản phẩm (nếu có)
    const nutThemSanPham = document.querySelectorAll(".product-card .btn");
    nutThemSanPham.forEach(btn => {
        // Lấy thông tin sản phẩm từ thẻ cha .product-card
        btn.addEventListener("click", function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
            const productCard = this.closest('.product-card');
            const id = productCard.querySelector('a').href.split('/').pop().replace('.html', ''); // Lấy ID từ href hoặc thêm data-id
            const ten = productCard.querySelector('h3').textContent;
            const giaText = productCard.querySelector('p').textContent;
            const gia = parseInt(giaText.replace(/\D/g, '')); // Loại bỏ ký tự không phải số và chuyển đổi

            themVaoGioHang({ id: id, ten: ten, gia: gia, soLuong: 1 }); // Thêm 1 sản phẩm
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

    // ======== TRANG CHI TIẾT (Xử lý nút "Thêm giỏ hàng" trên Butbithienlong.html) ========
    const addToCartBtn = document.getElementById("addToCartBtn");
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            const id = addToCartBtn.dataset.id; // Lấy id sản phẩm
            const ten = addToCartBtn.dataset.ten;
            const gia = parseInt(addToCartBtn.dataset.gia); // Giá đã là số trong data-gia
            const soLuong = parseInt(document.getElementById("quantity").value);

            if (isNaN(soLuong) || soLuong < 1) {
                alert("Số lượng không hợp lệ.");
                return;
            }

            themVaoGioHang({ id: id, ten: ten, gia: gia, soLuong: soLuong });
            alert("Đã thêm vào giỏ hàng!");
        });
    }

    // Xử lý thumbnail trên trang chi tiết sản phẩm
    const mainProductImage = document.getElementById('mainProductImage');
    const thumbnailContainer = document.getElementById('thumbnailContainer');

    if (mainProductImage && thumbnailContainer) {
        const thumbnails = thumbnailContainer.querySelectorAll('.thumbnail');

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const fullImageUrl = this.getAttribute('data-full-image');
                mainProductImage.src = fullImageUrl;

                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // ======== HIỂN THỊ GIỎ HÀNG TRÊN TRANG GIOHANG.HTML ========
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalElement = document.getElementById("cartTotal");

    if (cartItemsContainer && cartTotalElement) {
        hienThiGioHang();
    }

    function hienThiGioHang() {
        const gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
        cartItemsContainer.innerHTML = ""; // Xóa các mục cũ

        let tongTien = 0;

        if (gioHang.length === 0) {
            cartItemsContainer.innerHTML = "<p>Giỏ hàng của bạn đang trống.</p>";
        } else {
            gioHang.forEach(sanPham => {
                const itemDiv = document.createElement("div");
                itemDiv.classList.add("cart-item");
                const itemTotalPrice = sanPham.gia * sanPham.soLuong;
                tongTien += itemTotalPrice;

                itemDiv.innerHTML = `
                    <div class="item-info">
                        <h3>${sanPham.ten}</h3>
                        <p>Giá: ${sanPham.gia.toLocaleString('vi-VN')} VNĐ</p>
                        <p>Số lượng: <input type="number" class="item-quantity" data-id="${sanPham.id}" value="${sanPham.soLuong}" min="1"></p>
                        <p>Thành tiền: ${(itemTotalPrice).toLocaleString('vi-VN')} VNĐ</p>
                    </div>
                    <button class="remove-item-btn" data-id="${sanPham.id}">Xóa</button>
                `;
                cartItemsContainer.appendChild(itemDiv);
            });
        }

        cartTotalElement.textContent = tongTien.toLocaleString('vi-VN') + " VNĐ";

        // Gán sự kiện cho các nút xóa và input số lượng sau khi render
        document.querySelectorAll(".remove-item-btn").forEach(button => {
            button.addEventListener("click", xoaSanPhamKhoiGioHang);
        });

        document.querySelectorAll(".item-quantity").forEach(input => {
            input.addEventListener("change", capNhatSoLuongTrongGioHang);
        });
    }

    function xoaSanPhamKhoiGioHang(event) {
        const idCanXoa = event.target.dataset.id;
        let gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
        gioHang = gioHang.filter(sanPham => sanPham.id !== idCanXoa);
        localStorage.setItem("gioHang", JSON.stringify(gioHang));
        hienThiGioHang(); // Cập nhật lại giao diện giỏ hàng
        capNhatSoLuongGioHang(); // Cập nhật số lượng trên header
    }

    function capNhatSoLuongTrongGioHang(event) {
        const idCanCapNhat = event.target.dataset.id;
        const newQuantity = parseInt(event.target.value);

        if (isNaN(newQuantity) || newQuantity < 1) {
            alert("Số lượng không hợp lệ. Vui lòng nhập một số dương.");
            event.target.value = 1; // Đặt lại về 1 nếu nhập sai
            return;
        }

        let gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
        const index = gioHang.findIndex(sanPham => sanPham.id === idCanCapNhat);

        if (index !== -1) {
            gioHang[index].soLuong = newQuantity;
            localStorage.setItem("gioHang", JSON.stringify(gioHang));
            hienThiGioHang(); // Cập nhật lại giao diện giỏ hàng
            capNhatSoLuongGioHang(); // Cập nhật số lượng trên header
        }
    }
});
