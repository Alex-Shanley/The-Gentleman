document.addEventListener("DOMContentLoaded", function () {
    function setupCarousel(sectionClass, cardClass) {
        const section = document.querySelector(`.${sectionClass}`);
        if (!section) return;

        const carousel = section.querySelector(".carousel");
        const leftButton = section.querySelector(".left-btn");
        const rightButton = section.querySelector(".right-btn");
        const counter = section.querySelector(".counter");
        const cards = section.querySelectorAll(`.${cardClass}`);

        const visibleCards = 4;
        const totalCards = cards.length;
        if (totalCards === 0) return;

        const cardWidth = cards[0].offsetWidth + 115;
        let currentIndex = 0;

        function updateCounter() {
            let end = Math.min(currentIndex + visibleCards, totalCards);
            counter.textContent = `${end} of ${totalCards}`;
        }

        function scrollToIndex(index) {
            const scrollPosition = index * cardWidth;
            carousel.scrollTo({ left: scrollPosition, behavior: "smooth" });
        }

        rightButton.addEventListener("click", function () {
            if (currentIndex + visibleCards < totalCards) {
                currentIndex += 1;
                scrollToIndex(currentIndex);
                updateCounter();
            }
        });

        leftButton.addEventListener("click", function () {
            if (currentIndex > 0) {
                currentIndex -= 1;
                scrollToIndex(currentIndex);
                updateCounter();
            }
        });

        carousel.addEventListener("scroll", function () {
            let closestIndex = Math.round(carousel.scrollLeft / cardWidth);
            if (closestIndex !== currentIndex) {
                currentIndex = closestIndex;
                updateCounter();
            }
        });

        updateCounter();
    }

    setupCarousel("whats-new", "whats-new-products-card");
    setupCarousel("best-sellers", "best-sellers-products-card");

    function setupWishlist() {
        document.querySelectorAll(".hover-icons .icon img[alt='star']").forEach(star => {
            star.addEventListener("click", function () {
                const productCard = this.closest(".whats-new-products-card, .best-sellers-products-card");
                const productName = productCard.querySelector(".product-name").textContent;
                const productPrice = productCard.querySelector(".product-price").textContent;
                const productImage = productCard.querySelector("img").src;

                let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

                if (favourites.some(item => item.name === productName)) {
                    alert("Looks like you already favoured this");
                    return;
                }

                favourites.push({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    date: new Date().toLocaleDateString("en-UK", { month: "long", day: "numeric", year: "numeric" })
                });

                localStorage.setItem("favourites", JSON.stringify(favourites));
                alert("Added to favourites");
            });
        });
    }

    setupWishlist();

    function setupAddToCart() {
        document.querySelectorAll(".hover-icons .icon img[alt='bag']").forEach(cartIcon => {
            cartIcon.addEventListener("click", function () {
                const productCard = this.closest(".whats-new-products-card, .best-sellers-products-card");
                const productName = productCard.querySelector(".product-name").textContent;
                const productPrice = productCard.querySelector(".product-price").textContent;
                const productImage = productCard.querySelector("img").src;

                let cart = JSON.parse(localStorage.getItem("cart")) || [];

                const existingItemIndex = cart.findIndex(item => item.name === productName);
                if (existingItemIndex !== -1) {
                    alert("This product is already in your cart.");
                    return;
                }

                cart.push({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });

                localStorage.setItem("cart", JSON.stringify(cart));
                alert("Added to cart");
            });
        });
    }

    setupAddToCart();
});

const cartItemsContainer = document.querySelector(".my-cart");

const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

cartItemsContainer.innerHTML = "";


const myCartContainer = document.createElement('div');
myCartContainer.classList.add('my-cart');


myCartContainer.innerHTML = `
    <h2 class="my-bag">MY BAG</h2>
    <hr>
`;


cartItemsContainer.appendChild(myCartContainer);


cartItems.forEach(item => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    
    
    const itemPrice = parseFloat(item.price.replace('€', '').replace(',', '')); 
    const totalPrice = (itemPrice * item.quantity).toFixed(2); 
    
    
    itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-details">
            <p class="name">${item.name}</p>
            <p>Size: ${item.size || 'S'}</p>
        </div>
        <span class="cart-price">${item.price}</span>
        <input type="number" class="amt-box" value="${item.quantity}">
        
        <button class="delete-btn"><img src="Images/Bin Icon.svg" alt="Delete Item"></button>
    `;
    
    
    cartItemsContainer.appendChild(itemElement);
});


document.addEventListener("DOMContentLoaded", function() {
    const cartItemsContainer = document.querySelector(".my-cart");
    const subtotalElement = document.querySelector(".subtotal span");
    const totalElement = document.querySelector(".total span");
    const shippingOptions = document.querySelectorAll(".shipping-option input");

    function updateOrderSummary() {
        let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

        let subtotal = cartItems.reduce((sum, item) => {
            let itemPrice = parseFloat(item.price.replace(/[^0-9,.]/g, "").replace(",", "."));
            return sum + itemPrice * item.quantity;
        }, 0);

        let shippingCost = 0;
        shippingOptions.forEach(option => {
            if (option.checked && option.nextSibling.textContent.includes("€10")) {
                shippingCost = 10;
            }
        });

        let total = subtotal + shippingCost;

        subtotalElement.textContent = `€${subtotal.toFixed(2)}`;
        totalElement.textContent = `€${total.toFixed(2)}`;
    }

    updateOrderSummary();

    shippingOptions.forEach(option => {
        option.addEventListener("change", updateOrderSummary);
    });

    cartItemsContainer.addEventListener("click", function(event) {
        if (event.target.closest(".delete-btn")) {
            const cartItem = event.target.closest(".cart-item");

            if (cartItem) {
                const itemName = cartItem.querySelector(".name").textContent.trim();
                let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
                const updatedCart = cartItems.filter(item => item.name !== itemName);

                localStorage.setItem("cart", JSON.stringify(updatedCart));

                cartItem.remove();

                updateOrderSummary();

                console.log("Item removed from cart:", itemName);
            }
        }
    });

   
    cartItemsContainer.addEventListener("input", function(event) {
        if (event.target.classList.contains("amt-box")) {
            const cartItem = event.target.closest(".cart-item");
            const itemName = cartItem.querySelector(".name").textContent.trim();
            let newQuantity = parseInt(event.target.value);

            if (newQuantity < 1) {
                event.target.value = 1;
                newQuantity = 1;
            }

            let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
            let itemIndex = cartItems.findIndex(item => item.name === itemName);

            if (itemIndex !== -1) {
                cartItems[itemIndex].quantity = newQuantity;
                localStorage.setItem("cart", JSON.stringify(cartItems));
                updateOrderSummary();
            }
        }
    });
});



function showSidebar(){
    const sidebar= document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
  }
  
  function hideSidebar() {
    const sidebar= document.querySelector('.sidebar')
    sidebar.style.display = 'none'
  }


 

function messageSent(event) {
    event.preventDefault();

    const firstName=document.getElementById('firstName').value;
    const lastName=document.getElementById('lastName').value;


    const notificationMessage = `Thank you for reaching out to the Gentleman, ${firstName} ${lastName}, Your message has been sent successfully.`;

    alert(notificationMessage);

    document.getElementById('contactForm').reset();
}