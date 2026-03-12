let cart = [];
let total = 0;

function showOrder() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("orderPage").style.display = "block";
}

function addToCart(name, price) {
    cart.push({ name, price });
    total += price;

    document.getElementById("cart-count").innerText = cart.length;
    updateCart();
}

function updateCart() {
    let cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    cart.forEach(item => {
        let li = document.createElement("li");
        li.innerText = item.name + " - $" + item.price;
        cartItems.appendChild(li);
    });

    document.getElementById("total").innerText = total.toFixed(2);
}

function toggleCart() {
    document.getElementById("cart").classList.toggle("active");
}

function placeOrder(e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert("Order placed successfully!");
    cart = [];
    total = 0;
    updateCart();
    document.getElementById("cart-count").innerText = 0;
}
function scrollLeft() {
    const slider = document.getElementById("pretzelSlider");
    slider.scrollBy({
        left: -300,
        behavior: "smooth"
    });
}

function scrollRight() {
    const slider = document.getElementById("pretzelSlider");
    slider.scrollBy({
        left: 300,
        behavior: "smooth"
    });
}
