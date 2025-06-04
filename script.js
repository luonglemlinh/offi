document.addEventListener("DOMContentLoaded", function () {
    // Lấy phần tử
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const priceSort = document.getElementById("priceSort");
    const categoryFilter = document.getElementById("categoryFilter");
    const productGrid = document.getElementById("productGrid");
    const homeLink = document.getElementById("homeLink");

    // Xử lý bấm "Trang chủ"
    if (homeLink) {
        homeLink.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href = "index.html";
        });
    }

    // Tìm kiếm từ trang chủ → sang trang sản phẩm
    if (!productGrid && searchInput && searchButton) {
        searchButton.addEventListener("click", function () {
            const keyword = searchInput.value.trim();
            if (keyword !== "") {
                window.location.href = "sanpham.html?search=" + encodeURIComponent(keyword);
            }
        });
        return;
    }

    // Nếu không có productGrid thì dừng (để tránh lỗi ở trang khác)
    if (!productGrid) return;

    // Danh sách gốc
    let originalProducts = Array.from(productGrid.querySelectorAll(".product-card"));

    // Lấy giá
    function getPriceValue(card) {
        const priceText = card.querySelector("p").textContent;
        const numberMatch = priceText.match(/\d+/g);
        return numberMatch ? parseInt(numberMatch.join("")) : 0;
    }

    // Hàm lọc
    function applyFilters() {
        const keyword = searchInput?.value.trim().toLowerCase() || "";
        const sortOrder = priceSort?.value || "asc";
        const selectedCategory = categoryFilter?.value || "all";

        let filtered = originalProducts.filter(card => {
            const name = card.querySelector("h3").textContent.toLowerCase();
            const category = card.getAttribute("data-category") || "all";

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

    // Gắn sự kiện
    if (searchButton) searchButton.addEventListener("click", applyFilters);
    if (priceSort) priceSort.addEventListener("change", applyFilters);
    if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);

    // Nếu có ?search= từ URL thì tự động tìm
    const params = new URLSearchParams(window.location.search);
    const keywordFromURL = params.get("search");
    if (keywordFromURL && searchInput) {
        searchInput.value = keywordFromURL;
    }

    const categoryFromURL = params.get("category");
    if (categoryFromURL && categoryFilter) {
        categoryFilter.value = categoryFromURL;
    }

    // Lọc lúc đầu
    applyFilters();
});
