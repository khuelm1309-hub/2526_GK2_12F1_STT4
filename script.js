window.onload = function() {
    console.log("PretzelHouse Script: Optimized Version Loaded!");

    // Cache DOM references for performance
    const hamburger = document.querySelector(".hamburger");
    const menu = document.querySelector(".menu");
    const mainImg = document.getElementById("MainImg");
    const productNameEl = document.querySelector(".product-name");
    const productPriceEl = document.querySelector(".product-price");
    const dynamicDescEl = document.getElementById("dynamic-desc");
    const qtyInput = document.querySelector(".action-bar input");
    const addBtn = document.querySelector(".add-to-cart-btn");
    const cartContentEl = document.getElementById("cart-content");

    // Mobile menu toggle
    if (hamburger && menu) {
        hamburger.onclick = function() {
            hamburger.classList.toggle("active");
            menu.classList.toggle("active");
        };
        document.querySelectorAll(".menu li a").forEach(link => {
            link.onclick = () => {
                hamburger.classList.remove("active");
                menu.classList.remove("active");
            };
        });
    }

    // Product image gallery
    const smallImgs = document.querySelectorAll(".small-img");
    if (mainImg && smallImgs.length > 0) {
        smallImgs.forEach(img => {
            img.onclick = () => { mainImg.src = img.src; };
        });
    }

    // Topping selection
    const toppingItems = document.querySelectorAll(".topping-item");
    if (toppingItems.length > 0) {
        toppingItems.forEach(item => {
            item.onclick = function() {
                document.querySelector(".topping-item.active")?.classList.remove("active");
                this.classList.add("active");
                const price = this.getAttribute("data-price");
                const src = this.getAttribute("data-src");
                const desc = this.getAttribute("data-desc");

                if (mainImg && src) mainImg.src = src;
                if (productNameEl) productNameEl.innerText = "Pretzel " + this.innerText.trim();
                if (productPriceEl && price) {
                    const parsedPrice = parseInt(price);
                    if (!isNaN(parsedPrice)) {
                        productPriceEl.innerText = parsedPrice.toLocaleString('vi-VN') + "đ";
                    }
                }
                if (dynamicDescEl && desc) dynamicDescEl.innerText = desc;
            };
        });
    }

    // Add to cart
    if (addBtn) {
        addBtn.onclick = function() {
            const activeItem = document.querySelector(".topping-item.active");
            if (!activeItem) {
                alert("Bạn chưa chọn vị bánh!");
                return;
            }

            // Validate quantity input
            const rawQty = parseInt(qtyInput?.value);
            const productQty = (isNaN(rawQty) || rawQty < 1) ? 1 : Math.floor(rawQty);

            // Validate price
            const rawPrice = parseInt(activeItem.getAttribute("data-price"));
            const productPrice = (isNaN(rawPrice) || rawPrice < 0) ? 0 : rawPrice;

            const product = {
                name: "Pretzel " + activeItem.innerText.trim(),
                price: productPrice,
                image: activeItem.getAttribute("data-src") || "assets/img/Classic.png",
                quantity: productQty
            };

            // Safe localStorage operations
            try {
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                let index = cart.findIndex(item => item.name === product.name);

                if (index > -1) {
                    cart[index].quantity += product.quantity;
                } else {
                    cart.push(product);
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                alert("Đã thêm " + product.name + " vào giỏ hàng!");
            } catch (e) {
                console.error("Lỗi khi thêm vào giỏ hàng:", e);
                alert("Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại!");
            }
        };
    }

    // Render cart if on cart page
    if (cartContentEl) {
        renderCart();
    }
};

// Cart management functions
window.renderCart = function() {
    let cart;
    try {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
        console.error("Lỗi khi đọc giỏ hàng:", e);
        cart = [];
    }

    const tableBody = document.getElementById("cart-content");
    const totalEl = document.getElementById("total-final");

    if (!tableBody) return;
    tableBody.innerHTML = "";
    let totalAll = 0;

    if (cart.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='6' style='text-align:center; padding:30px;'>Giỏ hàng đang trống!</td></tr>";
    } else {
        cart.forEach((item, index) => {
            // Validate price and quantity
            const price = (typeof item.price === 'number' && !isNaN(item.price)) ? item.price : 0;
            const quantity = (typeof item.quantity === 'number' && !isNaN(item.quantity) && item.quantity >= 1) ? item.quantity : 1;
            const subtotal = price * quantity;
            totalAll += subtotal;
            const productImg = item.image ? item.image : "assets/img/Classic.png";

            tableBody.innerHTML += `
                <tr>
                    <td><button onclick="deleteItem(${index})" style="color:red; border:none; background:none; cursor:pointer;"><i class="far fa-times-circle"></i> Xóa</button></td>
                    <td>
                        <div class="cart-img-container">
                            <img src="${productImg}" width="50" onerror="this.src='assets/img/Classic.png'">
                        </div>
                    </td>
                    <td>${item.name}</td>
                    <td>${price.toLocaleString('vi-VN')}đ</td>
                    <td><input type="number" value="${quantity}" min="1" onchange="updateQuantity(${index}, this.value)" style="width:50px"></td>
                    <td style="font-weight:bold; color:#c1121f;">${subtotal.toLocaleString('vi-VN')}đ</td>
                </tr>`;
        });
    }
    if (totalEl) totalEl.innerText = totalAll.toLocaleString('vi-VN') + "đ";
};

window.deleteItem = function(index) {
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    } catch (e) {
        console.error("Lỗi khi xóa sản phẩm:", e);
    }
};

window.updateQuantity = function(index, val) {
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let newQty = parseInt(val);
        if (newQty < 1 || isNaN(newQty)) newQty = 1;
        cart[index].quantity = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    } catch (e) {
        console.error("Lỗi khi cập nhật số lượng:", e);
    }
};

// Product filtering
function filterProduct(category) {
    const items = document.querySelectorAll(".product-item");
    if (!items || items.length === 0) {
        console.warn("filterProduct: Không tìm thấy sản phẩm nào để lọc.");
        return;
    }

    items.forEach(item => {
        const itemCategory = item.getAttribute("data-category");
        const parentElement = item.parentElement;

        if (!parentElement) return;

        if (category === "all" || (itemCategory && itemCategory.includes(category))) {
            parentElement.style.display = "block";
        } else {
            parentElement.style.display = "none";
        }
    });
}
