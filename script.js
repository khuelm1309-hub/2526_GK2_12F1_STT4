let cart = [];
let total = 0;
function showOrder() {
    const home = document.getElementById("homePage");
    const order = document.getElementById("orderPage");

    if (home && order) {
        home.style.display = "none";
        order.style.display = "block";
    }
}
function addToCart(name, price) {
    cart.push({ name, price });
    total += price;

    const count = document.getElementById("cart-count");
    if (count) count.innerText = cart.length;

    updateCart();
}
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    if (!cartItems) return;

    cartItems.innerHTML = "";

    cart.forEach(item => {
        const li = document.createElement("li");
        li.innerText = `${item.name} - $${item.price}`;
        cartItems.appendChild(li);
    });

    const totalEl = document.getElementById("total");
    if (totalEl) totalEl.innerText = total.toFixed(2);
}
function toggleCart() {
    const cartBox = document.getElementById("cart");
    if (cartBox) cartBox.classList.toggle("active");
}
function placeOrder(e) {
    e.preventDefault();
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    cart = [];
    total = 0;
    const count = document.getElementById("cart-count");
    if (count) count.innerText = 0;
    updateCart();
}
function scrollLeft() {
    const slider = document.getElementById("pretzelSlider");
    if (slider) slider.scrollBy({ left: -300, behavior: "smooth" });
}
function scrollRight() {
    const slider = document.getElementById("pretzelSlider");
    if (slider) slider.scrollBy({ left: 300, behavior: "smooth" });
}
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const menu = document.querySelector(".menu");
    if (hamburger && menu) {
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation(); 
            menu.classList.toggle("active");
            hamburger.classList.toggle("active");
        });
        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
                menu.classList.remove("active");
                hamburger.classList.remove("active");
            }
        });
    }
});