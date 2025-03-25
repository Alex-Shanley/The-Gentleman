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
});

function setupWishlist() {
    document.querySelectorAll(".hover-icons .icon img[alt='star']").forEach(star => {
        star.addEventListener("click", function () {
            const productCard = this.closest(".whats-new-products-card, .best-sellers-products-card");
            const productName = productCard.querySelector (".product-name") .textContent;
            const productPrice = productCard.querySelector (".product-price") .textContent;
            const productImage = productCard.querySelector("img").src;

            let favourites = JSON.parse (localStorage.getItem ("favourites")) || [];

            if (favourites.some(item => item.name === productName)) {
                alert("Looks like you already favoured this");
                return;
            }

            favourites.push({
                name: productName,
                price: productPrice,
                image: productImage,
                date: new Date().toLocaleDateString("en-UK", {month:"long", day:"numeric", year: "numeric"})
            });

                localStorage.setItem("favourites", JSON.stringify (favourites));
                alert ("Added to favourites");

            });
        });
    }
    
    setupWishlist();

