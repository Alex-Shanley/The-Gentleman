document.addEventListener('DOMContentLoaded', function () {
    const favouritesContainer = document.querySelector(".my-fav");
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

    favourites.forEach(product => { 
        const favItem = document.createElement("div");
        favItem.classList.add("fav-list");
        favItem.innerHTML = `
            <div class="fav-item">
                <button class="remove-fav"><img src="Images/remove.svg" alt="cancel"></button>
                <img src="${product.image}" alt="${product.name}">
                <div class="fav-details">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price}</p>
                    <p class="date">${product.date}</p>
                </div>
                <button class="view-btn">VIEW OPTIONS</button>
            </div>
        `;

        favouritesContainer.appendChild(favItem);
    });

    //
    document.addEventListener("click", function (event) {
        if (event.target.closest(".remove-fav")) {
            const favItem = event.target.closest(".fav-item"); 
            const productName = favItem.querySelector("h3").textContent.trim();

            let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
            favourites = favourites.filter(item => item.name.trim() !== productName);

            localStorage.setItem("favourites", JSON.stringify(favourites));

            favItem.parentElement.remove(); 
        }
    });
});
