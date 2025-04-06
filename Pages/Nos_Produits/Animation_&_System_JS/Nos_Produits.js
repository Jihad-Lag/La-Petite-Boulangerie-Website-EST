// ---- Created_by_Jihad_Laglil ----
document.addEventListener("DOMContentLoaded", function() {
    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    let currentFilter = "all";

    
    let productCountElement = document.querySelector('.product-count');
    if (!productCountElement) {
        productCountElement = document.createElement('div');
        productCountElement.className = 'product-count';
        document.querySelector('.title_subtitle').appendChild(productCountElement);
    }

    function updateProductCount() {
        console.log("updateProductCount called"); 
        const visibleProducts = document.querySelectorAll('.produit:not([style*="none"])').length;
        productCountElement.textContent = ""; 
        productCountElement.textContent = `${visibleProducts} produits disponibles`;

        const filterTitle = document.querySelector('.title_subtitle h1');
        if (currentFilter === "all") {
            filterTitle.textContent = "Tous nos produits";
        } else {
            filterTitle.textContent = `Nos ${currentFilter.toLowerCase()}s`;
        }
    }

    function initFilters() {
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentFilter = e.target.dataset.filter;

                document.querySelectorAll('.nav-list a').forEach(a => a.classList.remove('active'));
                e.target.classList.add('active');

                document.querySelectorAll('.produit').forEach(produit => {
                    const tag = produit.dataset.tag;
                    const shouldShow = currentFilter === "all" || tag === currentFilter;
                    produit.style.display = shouldShow ? 'block' : 'none';

                    if (shouldShow) {
                        produit.style.opacity = '1';
                        produit.style.transform = 'translateY(0)';
                    }
                });

                updateProductCount();
            });
        });
    }

    function initCart() {
        document.querySelectorAll(".produit").forEach(produit => {
            const name = produit.getAttribute("data-name");
            const tag = produit.getAttribute("data-tag");
            const price = parseInt(produit.getAttribute("data-price"));

            let textContainer = produit.querySelector(".text-container");
            if (!textContainer) {
                textContainer = document.createElement("div");
                textContainer.className = "text-container";
                textContainer.innerHTML = `
                    <span class="tag">${tag}</span>
                    <h3 class="product-name">${name}</h3>
                    <p class="price">${price} DH / Unité</p>
                `;
                produit.appendChild(textContainer);
            }

            let quantityWrapper = produit.querySelector(".quantity-wrapper");
            if (!quantityWrapper) {
                quantityWrapper = document.createElement("div");
                quantityWrapper.className = "quantity-wrapper";
                quantityWrapper.innerHTML = `
                    <button class="minus">-</button>
                    <input type="number" value="0" min="0" class="quantity">
                    <button class="plus">+</button>
                    <p class="total-price">Total: 0 DH</p>
                `;
                produit.appendChild(quantityWrapper);
            }

            const minusBtn = quantityWrapper.querySelector(".minus");
            const plusBtn = quantityWrapper.querySelector(".plus");
            const input = quantityWrapper.querySelector(".quantity");
            const totalPrice = quantityWrapper.querySelector(".total-price");

            if (cart[name]) {
                input.value = cart[name].quantity;
                updateTotal();
            }

            function updateTotal() {
                const quantity = parseInt(input.value);
                if (isNaN(quantity)) {
                    input.value = 0;
                    return;
                }
                const itemTotal = quantity * price;
                totalPrice.textContent = `Total: ${itemTotal} DH`;
                updateCartItem(name, quantity, price);
            }

            minusBtn.addEventListener("click", function() {
                if (input.value > 0) {
                    input.value = parseInt(input.value) - 1;
                    updateTotal();
                }
            });

            plusBtn.addEventListener("click", function() {
                input.value = parseInt(input.value) + 1;
                updateTotal();
            });

            input.addEventListener("change", function() {
                const quantity = parseInt(input.value);
                if (quantity < 0) input.value = 0;
                updateTotal();
            });
        });
    }

    function updateCartItem(name, quantity, price) {
        if (quantity === 0) {
            delete cart[name];
        } else {
            cart[name] = { quantity: quantity, price: price };
        }
        updateCart();
    }

    function updateCart() {
        const cartItems = document.getElementById("cart-items");
        const cartTotal = document.getElementById("cart-total");
        const cartBar = document.getElementById("cart-bar");
        cartItems.innerHTML = "";

        let total = 0;
        let itemCount = 0;

        for (let item in cart) {
            const itemTotal = cart[item].quantity * cart[item].price;
            total += itemTotal;
            itemCount += cart[item].quantity;

            const li = document.createElement("li");
            li.innerHTML = `
                ${item} - ${cart[item].quantity} x ${cart[item].price} DH = ${itemTotal} DH
                <button class="remove-item" data-name="${item}">X</button>
            `;
            cartItems.appendChild(li);
        }

        cartTotal.textContent = `Total: ${total} DH`;
        cartBar.classList.toggle("show", itemCount > 0);
        localStorage.setItem("cart", JSON.stringify(cart));

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function() {
                const itemName = button.getAttribute("data-name");
                removeItemFromCart(itemName);
            });
        });
    }

    function removeItemFromCart(name) {
        if (cart[name]) {
            delete cart[name];
            document.querySelectorAll(".produit").forEach(produit => {
                const itemName = produit.getAttribute("data-name");
                if (itemName === name) {
                    const input = produit.querySelector(".quantity");
                    input.value = 0;
                    const totalPrice = produit.querySelector(".total-price");
                    totalPrice.textContent = `Total: 0 DH`;
                }
            });
            updateCart();
        }
    }

    initFilters();
    initCart();
    updateProductCount(); 

    document.getElementById("checkout").addEventListener("click", function() {
        if (Object.keys(cart).length > 0) {
            document.getElementById("commander-form").style.display = "block";
        } else {
            alert("Votre panier est vide !");
        }
    });

    document.getElementById("close-form").addEventListener("click", function() {
        document.getElementById("commander-form").style.display = "none";
    });

    document.getElementById("commande-form").addEventListener("submit", function(e) {
        e.preventDefault();
        
    });

  
    const categoryNav = document.querySelector(".category-nav");
    const sticky = categoryNav.offsetTop;

    window.onscroll = function() {
        if (window.pageYOffset >= sticky) {
            categoryNav.classList.add("sticky");
        } else {
            categoryNav.classList.remove("sticky");
        }

        const navbar = document.querySelector(".navbar");
        const sticknavbar = document.querySelector(".navbar-sticky");

        if (window.scrollY > 1) {
            navbar.classList.add("scrolled");
            sticknavbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
            sticknavbar.classList.remove("scrolled");
        }
    };

   
    const toggles = document.querySelectorAll('.toggle');
    const togglesvg1 = document.querySelector('.toggle-big svg path');
    const togglesvg2 = document.querySelector('.toggle-sticky svg path');
    const dropdownmenu = document.querySelector('.dropdown_menu');

    dropdownmenu.classList.remove('open');

    toggles.forEach((toggle) => {
        toggle.onclick = function () {
            dropdownmenu.classList.toggle('open');
            const isOpen = dropdownmenu.classList.contains('open');
        
            togglesvg1.setAttribute('d', isOpen
                ? 'M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z'
                : 'M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z'
            );
            togglesvg2.setAttribute('d', isOpen
                ? 'M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z'
                : 'M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z'
            );
        };
    });
});

// ---- Created_by_Jihad_Laglil_Version_Mobile ----
document.addEventListener("DOMContentLoaded", function() {
    const navList = document.querySelector(".nav-list");

    let isDragging = false;
    let startX, scrollLeft;

    navList.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.pageX - navList.offsetLeft;
        scrollLeft = navList.scrollLeft;
    });

    navList.addEventListener("mouseleave", () => {
        isDragging = false;
    });

    navList.addEventListener("mouseup", () => {
        isDragging = false;
    });

    navList.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - navList.offsetLeft;
        const walk = (x - startX) * 2; 
        navList.scrollLeft = scrollLeft - walk;
    });
});