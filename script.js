document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const priceSort = document.getElementById("priceSort");
    const productGrid = document.getElementById("productGrid");

    if (!productGrid) return; // Nếu không phải trang sản phẩm thì không chạy

    // Lấy danh sách gốc các sản phẩm từ HTML
    let originalProducts = Array.from(productGrid.querySelectorAll(".product-card"));

    // Hàm lọc và sắp xếp
    function applyFilters() {
        const keyword = searchInput.value.trim().toLowerCase();
        const sortOrder = priceSort.value;

        // Lọc theo từ khóa
        let filtered = originalProducts.filter(card => {
            const name = card.querySelector("h3").textContent.toLowerCase();
            return name.includes(keyword);
        });

        // Sắp xếp theo giá
        filtered.sort((a, b) => {
            const priceA = getPriceValue(a);
            const priceB = getPriceValue(b);
            return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
        });

        // Gán lại vào grid
        productGrid.innerHTML = "";
        filtered.forEach(card => productGrid.appendChild(card));
    }

    // Lấy giá sản phẩm từ HTML
    function getPriceValue(card) {
        const priceText = card.querySelector("p").textContent;
        const numberMatch = priceText.match(/\d+/g);
        return numberMatch ? parseInt(numberMatch.join("")) : 0;
    }

    // Gắn sự kiện
    if (searchButton) searchButton.addEventListener("click", applyFilters);
    if (priceSort) priceSort.addEventListener("change", applyFilters);
});

// Điều hướng về trang chủ khi bấm "Trang chủ"
// Xử lý nút "Trang chủ" bằng JS nếu href không tự hoạt động
document.addEventListener("DOMContentLoaded", function () {
    const homeLink = document.getElementById("homeLink");
    if (homeLink) {
        homeLink.addEventListener("click", function (e) {
            e.preventDefault(); // Chặn hành vi mặc định
            window.location.href = "Văn phòng phẩm.html"; // Điều hướng đúng file
        });
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const homeLink = document.getElementById("homeLink");
    if (homeLink) {
        homeLink.addEventListener("click", function (e) {
            if (window.location.href.includes("Văn phòng phẩm.html")) {
                // Nếu đang ở trang chủ rồi thì chỉ cần reload lại
                e.preventDefault();
                window.location.reload();
            } else {
                // Nếu đang ở trang khác thì điều hướng về trang chủ
                e.preventDefault();
                window.location.href = "Văn phòng phẩm.html";
            }
        });
    }
});



document.addEventListener("DOMContentLoaded", function () {
    // Xử lý tìm kiếm từ trang chủ → chuyển đến products.html với query
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    if (searchInput && searchButton) {
        searchButton.addEventListener("click", function () {
            const keyword = searchInput.value.trim();
            if (keyword !== "") {
                window.location.href = "products.html?search=" + encodeURIComponent(keyword);
            }
        });
    }

    // Nếu đang ở trang products.html → lọc theo từ khóa trong URL
    const productGrid = document.getElementById("productGrid");
    if (productGrid) {
        const params = new URLSearchParams(window.location.search);
        const keyword = params.get("search");
        if (keyword) {
            const products = productGrid.querySelectorAll(".product-card");
            products.forEach(card => {
                const name = card.querySelector("h3").textContent.toLowerCase();
                if (name.includes(keyword.toLowerCase())) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        }
    }
});


//Phản hồi
document.addEventListener("DOMContentLoaded", function () {
    const feedbackLink = document.getElementById("feedbackLink");
    if (feedbackLink) {
        feedbackLink.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href = "Phản hồi.html";
        });
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const priceSort = document.getElementById("priceSort");
    const categoryFilter = document.getElementById("categoryFilter");
    const productGrid = document.getElementById("productGrid");

    if (!productGrid) return;

    let originalProducts = Array.from(productGrid.querySelectorAll(".product-card"));

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

    function getPriceValue(card) {
        const priceText = card.querySelector("p").textContent;
        const numberMatch = priceText.match(/\d+/g);
        return numberMatch ? parseInt(numberMatch.join("")) : 0;
    }

    // Gắn sự kiện
    if (searchButton) searchButton.addEventListener("click", applyFilters);
    if (priceSort) priceSort.addEventListener("change", applyFilters);
    if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);

    // Nếu có từ khóa trên URL
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("search");
    if (keyword && searchInput) {
        searchInput.value = keyword;
        applyFilters();
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const priceSort = document.getElementById("priceSort");
    const categoryFilter = document.getElementById("categoryFilter");
    const productGrid = document.getElementById("productGrid");

    if (!productGrid) return;

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

    // Sự kiện lọc
    if (searchButton) searchButton.addEventListener("click", applyFilters);
    if (priceSort) priceSort.addEventListener("change", applyFilters);
    if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);

    // Đọc URL và áp dụng nếu có ?category=
    const params = new URLSearchParams(window.location.search);
    const categoryFromURL = params.get("category");
    if (categoryFromURL && categoryFilter) {
        categoryFilter.value = categoryFromURL;
    }

    // Sau khi set giá trị ban đầu → lọc
    applyFilters();
});







