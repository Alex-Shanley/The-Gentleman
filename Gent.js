document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel");
    const leftButton = document.querySelector(".left-btn");
    const rightButton = document.querySelector(".right-btn");
    const counter = document.querySelector(".counter");
    
    const cards = document.querySelectorAll(".whats-new-products-card"); 
    const visibleCards = 4;
    const totalCards = cards.length; 
    const cardWidth = cards[0].offsetWidth + 20; 
    let currentIndex = 0; 

    
    function updateCounter() {
        let end = Math.min(currentIndex + visibleCards, totalCards);
        counter.textContent = `${end} of ${totalCards} `;
    }

    rightButton.addEventListener("click", function () {
        if (currentIndex + visibleCards < totalCards) {
            currentIndex += 1;
            carousel.scrollBy({ left: cardWidth, behavior: "smooth" });
            updateCounter();
        }
    });

    leftButton.addEventListener("click", function () {
        if (currentIndex > 0) {
            currentIndex -= 1;
            carousel.scrollBy({ left: -cardWidth, behavior: "smooth" });
            updateCounter();
        }
    });

    
    updateCounter();
});
