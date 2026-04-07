window.onload = function() {
    console.log("PretzelHouse Script: Optimized Version Loaded!");
    const hamburger = document.querySelector(".hamburger");
    const menu = document.querySelector(".menu");
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
    const mainImg = document.getElementById("MainImg");
    const smallImgs = document.querySelectorAll(".small-img");
    if (mainImg && smallImgs.length > 0) {
        smallImgs.forEach(img => {
            img.onclick = () => { mainImg.src = img.src; };
        });
    }
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
                if (document.querySelector(".product-name")) 
                    document.querySelector(".product-name").innerText = "Pretzel " + this.innerText.trim();
                if (document.querySelector(".product-price") && price) 
                    document.querySelector(".product-price").innerText = parseInt(price).toLocaleString('vi-VN') + "đ";
                if (document.getElementById("dynamic-desc") && desc) 
                    document.getElementById("dynamic-desc").innerText = desc;
            };
        });
    }
    const addBtn = document.querySelector(".add-to-cart-btn");
    if (addBtn) {
        addBtn.onclick = function() {
            const activeItem = document.querySelector(".topping-item.active");
            const qtyInput = document.querySelector(".action-bar input");
            
            if (!activeItem) {
                alert("Bạn chưa chọn vị bánh!");
                return;
            }

            const product = {
                name: "Pretzel " + activeItem.innerText.trim(),
                price: parseInt(activeItem.getAttribute("data-price")) || 0,
                image: activeItem.getAttribute("data-src") || "assets/img/Classic.png",
                quantity: parseInt(qtyInput?.value) || 1
            };

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let index = cart.findIndex(item => item.name === product.name);
            
            if (index > -1) {
                cart[index].quantity += product.quantity;
            } else {
                cart.push(product);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Đã thêm " + product.name + " vào giỏ hàng!");
        };
    }

    if (document.getElementById("cart-content")) {
        renderCart();
    }
};
window.renderCart = function() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const tableBody = document.getElementById("cart-content");
    const totalEl = document.getElementById("total-final");
    
    if (!tableBody) return;
    tableBody.innerHTML = "";
    let totalAll = 0;

    if (cart.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='6' style='text-align:center; padding:30px;'>Giỏ hàng đang trống!</td></tr>";
    } else {
        cart.forEach((item, index) => {
            const price = item.price || 0;
            const subtotal = price * item.quantity;
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
                    <td><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)" style="width:50px"></td>
                    <td style="font-weight:bold; color:#c1121f;">${subtotal.toLocaleString('vi-VN')}đ</td>
                </tr>`;
        });
    }
    if (totalEl) totalEl.innerText = totalAll.toLocaleString('vi-VN') + "đ";
};
window.deleteItem = (index) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
};

window.updateQuantity = (index, val) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let newQty = parseInt(val);
    if (newQty < 1 || isNaN(newQty)) newQty = 1;
    cart[index].quantity = newQty;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
};

// Slider scroll functions
window.scrollLeft = function() {
    const slider = document.getElementById("pretzelSlider");
    if (slider) slider.scrollBy({ left: -250, behavior: "smooth" });
};

window.scrollRight = function() {
    const slider = document.getElementById("pretzelSlider");
    if (slider) slider.scrollBy({ left: 250, behavior: "smooth" });
};

// Cart toggle function
window.toggleCart = function() {
    const cart = document.getElementById("cart");
    if (cart) cart.classList.toggle("active");
};

// Add to cart function
window.addToCart = function(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1, image: "assets/img/Classic.png" });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm " + name + " vào giỏ hàng!");
};

// Place order function
window.placeOrder = function(e) {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }
    alert("Đặt hàng thành công! Cảm ơn bạn đã mua hàng.");
    localStorage.removeItem("cart");
    renderCart();
};

// Product filter function
window.filterProduct = function(category) {
    const products = document.querySelectorAll(".card");
    
    products.forEach(product => {
        const productItem = product.querySelector(".product-item");
        if (!productItem) return;
        
        const categories = productItem.getAttribute("data-category") || "";
        
        if (category === "all" || categories.includes(category)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
    
    // Update active button state
    const buttons = document.querySelectorAll(".filter-box .btn-primary");
    buttons.forEach(btn => {
        btn.style.opacity = "0.7";
    });
    event.target.style.opacity = "1";
};