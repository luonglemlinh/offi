document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const priceSort = document.getElementById("priceSort");
    const categoryFilter = document.getElementById("categoryFilter");
    const productGrid = document.getElementById("productGrid");
    const feedbackLink = document.getElementById("feedbackLink");
    const homeLink = document.getElementById("homeLink");
    const cartCount = document.querySelector(".cart-count"); // Using querySelector for class

//Tự động thêm số lượng bên cạnh giỏ hàng 
    function capNhatSoLuongGioHang() {
        const gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
        const tong = gioHang.reduce((sum, sp) => sum + sp.soLuong, 0);
        if (cartCount) {
            cartCount.textContent = tong;
        }
    }


    capNhatSoLuongGioHang();

    //Thêm sản phẩm mới vào giỏ hàng
    function themVaoGioHang(sanPhamMoi) {
        let gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
        //Đảm bảo sản phẩm mới có ID
        if (!sanPhamMoi.id) {
            console.error("Sản phẩm thiếu ID. Không thể thêm vào giỏ hàng.", sanPhamMoi);
            return;
        }

        const index = gioHang.findIndex(item => item.id === sanPhamMoi.id);

        if (index !== -1) {
            // Nếu sản phẩm này đã có trong giỏ hàng thì +số lượng
            gioHang[index].soLuong += sanPhamMoi.soLuong;
        } else {
            
            gioHang.push(sanPhamMoi);
        }
        localStorage.setItem("gioHang", JSON.stringify(gioHang));
        capNhatSoLuongGioHang(); // Update cart count in header
    }


    // ======== TRANG CHỦ & TRANG SẢN PHẨM: Search, Filter, Sort ========
    if (productGrid) { // This block runs only on 'sanpham.html'
        let originalProducts = Array.from(productGrid.querySelectorAll(".product-card"));

        function getPriceValue(card) {
            const priceText = card.querySelector("p").textContent;
            // Remove all non-digit characters except the comma/dot for thousands separator if present, then parse
            // For example, "7.000 VNĐ" -> "7000"
            const cleanedPriceText = priceText.replace(/\D/g, ''); // Removes non-digits
            return parseInt(cleanedPriceText) || 0;
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
            filtered.forEach(card => productGrid.appendChild(card.cloneNode(true))); // Use cloneNode to re-add elements cleanly
            
            // Re-attach event listeners for "Mua ngay" buttons after re-rendering the grid
            attachProductCardBuyButtonsEvents();
        }

        // Event listeners for filters and sort on sanpham.html
        if (searchButton) searchButton.addEventListener("click", applyFilters);
        if (priceSort) priceSort.addEventListener("change", applyFilters);
        if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);

        // Apply filters based on URL parameters when loading sanpham.html
        const params = new URLSearchParams(window.location.search);
        const keywordFromURL = params.get("search");
        const categoryFromURL = params.get("category");

        if (keywordFromURL && searchInput) searchInput.value = keywordFromURL;
        if (categoryFromURL && categoryFilter) categoryFilter.value = categoryFromURL;

        applyFilters(); // Initial application of filters
    } else { // This block runs on pages other than 'sanpham.html' (like index.html)
        if (searchButton && searchInput) {
            searchButton.addEventListener("click", () => {
                const keyword = searchInput.value.trim();
                window.location.href = `sanpham.html${keyword ? `?search=${encodeURIComponent(keyword)}` : ''}`;
            });
        }
    }


    // ======== ATTACH EVENT LISTENERS FOR "MUA NGAY" BUTTONS ON PRODUCT LISTINGS (sanpham.html and index.html) ========
    // This function can be called initially and after filtering/sorting if product cards are re-rendered
    function attachProductCardBuyButtonsEvents() {
        const nutThemSanPham = document.querySelectorAll(".product-item .btn, .product-card .btn"); // Target buttons on both index.html and sanpham.html
        nutThemSanPham.forEach(btn => {
            // Remove existing listeners to prevent duplicates if function is called multiple times (e.g., after filter)
            btn.removeEventListener("click", handleProductCardBuyClick);
            btn.addEventListener("click", handleProductCardBuyClick);
        });
    }

    function handleProductCardBuyClick(event) {
        event.preventDefault(); // Prevent default link behavior if inside an <a> tag
        const productItem = this.closest('.product-item') || this.closest('.product-card'); // Get the parent product container
        if (!productItem) {
            console.error("Không tìm thấy thẻ cha sản phẩm.");
            return;
        }

        const ten = productItem.querySelector('h3').textContent.trim();
        const giaText = productItem.querySelector('p.price, p').textContent; // Get price text
        const gia = parseInt(giaText.replace(/\D/g, '')); // Clean and parse price

        // Derive a unique ID from the link's href or other data
        const linkElement = productItem.querySelector('a');
        let id;
        if (linkElement && linkElement.href) {
            const pathSegments = linkElement.href.split('/');
            const filename = pathSegments[pathSegments.length - 1]; // e.g., "Butbithienlong.html"
            id = filename.replace('.html', ''); // Use "Butbithienlong" as ID
        } else {
            id = ten.replace(/\s/g, ''); // Fallback: simplify name if no link
        }
        
        if (isNaN(gia)) {
            console.error("Giá sản phẩm không hợp lệ:", giaText);
            alert("Không thể thêm sản phẩm này vào giỏ hàng do lỗi giá.");
            return;
        }

        themVaoGioHang({ id: id, ten: ten, gia: gia, soLuong: 1 }); // Add 1 quantity by default
        alert(`Đã thêm "${ten}" vào giỏ hàng!`);
    }

    // Attach events for product card "Mua ngay" buttons on initial load
    attachProductCardBuyButtonsEvents();


    // ======== ADD TO CART BUTTON ON PRODUCT DETAIL PAGES (e.g., Butbithienlong.html) ========
    const addToCartBtn = document.getElementById("addToCartBtn");
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            const id = addToCartBtn.dataset.id; 
            const ten = addToCartBtn.dataset.ten; 
            const gia = parseInt(addToCartBtn.dataset.gia); 
            const soLuongInput = document.getElementById("quantity");
            const soLuong = parseInt(soLuongInput.value);

            if (isNaN(soLuong) || soLuong < 1) {
                alert("Số lượng không hợp lệ. Vui lòng nhập một số nguyên dương.");
                soLuongInput.value = 1; // Reset to 1 if invalid
                return;
            }
            
            // Check if gia is a valid number
            if (isNaN(gia)) {
                console.error("Giá sản phẩm từ data-gia không hợp lệ:", addToCartBtn.dataset.gia);
                alert("Không thể thêm sản phẩm này vào giỏ hàng do lỗi giá.");
                return;
            }

            themVaoGioHang({ id: id, ten: ten, gia: gia, soLuong: soLuong });
            alert(`Đã thêm "${ten}" với số lượng ${soLuong} vào giỏ hàng!`);
        });
    }

    // ======== NAVIGATION LINKS ========
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

    // ======== THUMBNAIL GALLERY (for product detail pages) ========
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

// ======== PROCEED TO CHECKOUT BUTTON ON GIOHANG.HTML ========
    const proceedToCheckoutBtn = document.getElementById("proceedToCheckoutBtn");

    if (proceedToCheckoutBtn) {
        proceedToCheckoutBtn.addEventListener("click", function(event) {
            // Tùy chọn: Kiểm tra xem giỏ hàng có trống không trước khi chuyển hướng
            const gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
            if (gioHang.length === 0) {
                alert("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
                event.preventDefault(); // Ngăn chặn chuyển hướng nếu giỏ hàng trống
                return;
            }
            
            // Nếu giỏ hàng có sản phẩm, chuyển hướng đến trang thanh toán
            window.location.href = "thanhtoan.html";
        });
    }


    
    // ======== Hiển thị giỏ hàng ========
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalElement = document.getElementById("cartTotal");

    //Hàm đảm bảo chỉ chạy trên trang giỏ hàng
    if (cartItemsContainer && cartTotalElement) {
        hienThiGioHang(); 
    }

    function hienThiGioHang() {
        const gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
        cartItemsContainer.innerHTML = ""; 

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

        // Thêm event listener cho thêm và xóa các sản phẩm riêng trong giỏ hàng
        document.querySelectorAll(".item-quantity").forEach(input => {
            input.removeEventListener("change", capNhatSoLuongTrongGioHang); //chống trùng lặp
            input.addEventListener("change", capNhatSoLuongTrongGioHang);
        });

        document.querySelectorAll(".remove-item-btn").forEach(button => {
            button.removeEventListener("click", xoaSanPhamKhoiGioHang); //chống trùng lặp
            button.addEventListener("click", xoaSanPhamKhoiGioHang);
        });
    }

    function xoaSanPhamKhoiGioHang(event) {
        const idCanXoa = event.target.dataset.id;
        let gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
        gioHang = gioHang.filter(sanPham => sanPham.id !== idCanXoa); //lọc sản phẩm cần xóa
        localStorage.setItem("gioHang", JSON.stringify(gioHang)); //cập nhập lại giỏ hàng
        hienThiGioHang();
        capNhatSoLuongGioHang(); 
    }

    function capNhatSoLuongTrongGioHang(event) {
        const idCanCapNhat = event.target.dataset.id;
        const newQuantity = parseInt(event.target.value);

        if (isNaN(newQuantity) || newQuantity < 1) {
            alert("Số lượng không hợp lệ. Vui lòng nhập một số dương.");
            event.target.value = 1; // đặt lại thành 1
            return;
        }

        let gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
        const index = gioHang.findIndex(sanPham => sanPham.id === idCanCapNhat);

        if (index !== -1) {
            gioHang[index].soLuong = newQuantity;
            localStorage.setItem("gioHang", JSON.stringify(gioHang)); // cập nhập lại giỏ hàng
            hienThiGioHang(); 
            capNhatSoLuongGioHang(); 
        }
    }
});


