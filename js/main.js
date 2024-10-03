document.addEventListener('DOMContentLoaded', function () {
    const menuContainer = document.getElementById('menu-items');
    const cartIcon = document.getElementById('cart-icon');
    const cartWindow = document.getElementById('cart-window');    
    const cartContent = document.getElementById('cart-content');
    const cartCount = document.getElementById('cart-count');
    const subTotalElement = document.getElementById('sub-total');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');
    document.getElementById('checkout-button').addEventListener('click', loadOrderPage);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function displayMenu() {
        menuContainer.innerHTML = '';
        menuItems.forEach(item => {
            const col = document.createElement('div');
            col.classList.add('col-md-4', 'mb-4');

            const card = document.createElement('div');
            card.classList.add('card');

            const img = document.createElement('img');
            img.src = item.image;
            img.classList.add('card-img-top');
            img.alt = item.name;

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const itemName = document.createElement('h5');
            itemName.textContent = item.name;
            itemName.classList.add('card-title');

            const itemPrice = document.createElement('p');
            itemPrice.textContent = `LKR ${item.price}`;
            itemPrice.classList.add('card-text');

            const addButton = document.createElement('button');
            addButton.textContent = 'Add to Cart';
            addButton.classList.add('btn', 'btn-primary');
            addButton.addEventListener('click', function () {
                addToCart(item);
            });

            cardBody.appendChild(itemName);
            cardBody.appendChild(itemPrice);
            cardBody.appendChild(addButton);

            card.appendChild(img);
            card.appendChild(cardBody);
            col.appendChild(card);

            menuContainer.appendChild(col);
        });
    }

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.code === item.code);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }

        updateCart();
    }

    function removeFromCart(itemCode) {
        cart = cart.filter(cartItem => cartItem.code !== itemCode);
        updateCart();
    }

    function decreaseQuantity(itemCode) {
        const cartItem = cart.find(cartItem => cartItem.code === itemCode);
        if (cartItem && cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            removeFromCart(itemCode);
        }
        updateCart();
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartIcon();
        console.log(cart);
    }

    function renderCart() {
        cartContent.innerHTML = '';

        let subTotal = 0;
        let discount = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subTotal += itemTotal;

            const itemDiscount = item.discount ? (itemTotal * item.discount) / 100 : 0;
            discount += itemDiscount;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-3');

            const itemName = document.createElement('span');
            itemName.textContent = `${item.name} (${item.quantity})`;

            const itemActions = document.createElement('div');
            itemActions.classList.add('item-actions', 'd-flex', 'align-items-center');

            const decreaseButton = document.createElement('button');
            decreaseButton.textContent = '-';
            decreaseButton.classList.add('btn', 'btn-sm', 'btn-danger', 'me-2');
            decreaseButton.addEventListener('click', () => decreaseQuantity(item.code));

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('btn', 'btn-sm', 'btn-danger', 'me-2');
            removeButton.addEventListener('click', () => removeFromCart(item.code));

            itemActions.appendChild(decreaseButton);
            itemActions.appendChild(removeButton);

            cartItem.appendChild(itemName);
            cartItem.appendChild(itemActions);

            cartContent.appendChild(cartItem);
        });

        subTotalElement.textContent = subTotal.toFixed(2);
        discountElement.textContent = discount.toFixed(2);
        totalElement.textContent = (subTotal - discount).toFixed(2);
    }

    function updateCartIcon() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        if (totalItems > 0) {
            cartIcon.classList.remove('d-none');
        } else {
            cartIcon.classList.add('d-none');
        }
    }

    cartIcon.addEventListener('click', function () {
        cartWindow.classList.toggle('d-none');
    });

    document.getElementById('close-cart').addEventListener('click', function () {
        cartWindow.classList.add('d-none');
    });

    updateCart();
    displayMenu();
});

var menuItems = [
    { code: 'B1001', name: 'Classic Burger (Large)', price: 750, image: 'assets/images/items/classic_burger.png' },
    { code: 'B1002', name: 'Classic Burger (Regular)', price: 1500, discount: 15, image: 'assets/images/items/classic_burger.png' },
    { code: 'B1003', name: 'Turkey Burger', price: 1600, image: 'assets/images/items/turkey_burger.png' },
    { code: 'B1004', name: 'Chicken Burger (Large)', price: 1400, image: 'assets/images/items/chicken_burger.png' },
    { code: 'B1005', name: 'Chicken Burger (Regular)', price: 800, discount: 20, image: 'assets/images/items/chicken_burger.png' },
    { code: 'B1006', name: 'Cheese Burger (Large)', price: 1000, image: 'assets/images/items/cheese_burger.png' },
    { code: 'B1007', name: 'Cheese Burger (Regular)', price: 600, image: 'assets/images/items/cheese_burger.png' },
    { code: 'B1008', name: 'Bacon Burger', price: 650, discount: 15, image: 'assets/images/items/bacon_burger.png' },
    { code: 'B1009', name: 'Shawarma Burger', price: 800, image: 'assets/images/items/shawarma_burger.png' },
    { code: 'B1010', name: 'Olive Burger', price: 1800, image: 'assets/images/items/olive_burger.png' },
    { code: 'B1012', name: 'Double-Cheese Burger', price: 1250, discount: 20, image: 'assets/images/items/double_cheese_burger.png' },
    { code: 'B1013', name: 'Crispy Chicken Burger (Regular)', price: 1200, image: 'assets/images/items/crispy_chicken_burger.png' },
    { code: 'B1014', name: 'Crispy Chicken Burger (Large)', price: 1600, discount: 10, image: 'assets/images/items/crispy_chicken_burger.png' },
    { code: 'B1015', name: 'Paneer Burger', price: 900, image: 'assets/images/items/paneer_burger.png' },
    { code: 'B1016', name: 'Crispy Chicken Submarine (Large)', price: 2000, image: 'assets/images/items/crispy_chicken_submarine.png' },
    { code: 'B1017', name: 'Crispy Chicken Submarine (Regular)', price: 1500, image: 'assets/images/items/crispy_chicken_submarine.png' },
    { code: 'B1018', name: 'Chicken Submarine (Large)', price: 1800, discount: 3, image: 'assets/images/items/chicken_submarine.png' },
    { code: 'B1019', name: 'Chicken Submarine (Regular)', price: 1400, image: 'assets/images/items/chicken_submarine.png' },
    { code: 'B1020', name: 'Grinder Submarine', price: 2300, image: 'assets/images/items/grinder_submarine.png' },
    { code: 'B1021', name: 'Cheese Submarine', price: 2200, image: 'assets/images/items/cheese_submarine.png' },
    { code: 'B1022', name: 'Double Cheese n Chicken Submarine', price: 1900, discount: 16, image: 'assets/images/items/double_cheese_n_chicken_submarine.png' },
    { code: 'B1023', name: 'Special Horgie Submarine', price: 2800, image: 'assets/images/items/special_horgie_submarine.png' },
    { code: 'B1024', name: 'MOS Special Submarine', price: 3000, image: 'assets/images/items/mos_special_submarine.png' },
    { code: 'B1025', name: 'Steak Fries (Large)', price: 1200, image: 'assets/images/items/steak_fries.png' },
    { code: 'B1026', name: 'Steak Fries (Medium)', price: 600, image: 'assets/images/items/steak_fries.png' },
    { code: 'B1027', name: 'French Fries (Large)', price: 800, image: 'assets/images/items/french_fries.png' },
    { code: 'B1028', name: 'French Fries (Medium)', price: 650, image: 'assets/images/items/french_fries.png' },
    { code: 'B1029', name: 'French Fries (Small)', price: 450, image: 'assets/images/items/french_fries.png' },
    { code: 'B1030', name: 'Sweet Potato Fries (Large)', price: 600, image: 'assets/images/items/sweet_potato_fries.png' },
    { code: 'B1031', name: 'Chicken n Cheese Pasta', price: 1600, discount: 15, image: 'assets/images/items/chicken_n_cheese_pasta.png' },
    { code: 'B1032', name: 'Chicken Penne Pasta', price: 1700, image: 'assets/images/items/chicken_penne_pasta.png' },
    { code: 'B1033', name: 'Ground Turkey Pasta Bake', price: 2900, discount: 10, image: 'assets/images/items/ground_turkey_pasta_bake.png' },
    { code: 'B1034', name: 'Creamy Shrimp Pasta', price: 2000, image: 'assets/images/items/creamy_shrimp_pasta.png' },
    { code: 'B1035', name: 'Lemon Butter Pasta', price: 1950, image: 'assets/images/items/lemon_butter_pasta.png' },
    { code: 'B1036', name: 'Tagliatelle Pasta', price: 2400, discount: 1, image: 'assets/images/items/tagliatelle_pasta.png' },
    { code: 'B1037', name: 'Baked Ravioli', price: 2000, discount: 1, image: 'assets/images/items/baked_ravioli.png' },
    { code: 'B1038', name: 'Fried Chicken (Small)', price: 1200, image: 'assets/images/items/fried_chicken.png' },
    { code: 'B1039', name: 'Fried Chicken (Regular)', price: 2300, discount: 10, image: 'assets/images/items/fried_chicken.png' },
    { code: 'B1040', name: 'Fried Chicken (Large)', price: 3100, discount: 5, image: 'assets/images/items/fried_chicken.png' },
    { code: 'B1041', name: 'Hot Wings (Large)', price: 2400, image: 'assets/images/items/hot_wings.png' },
    { code: 'B1042', name: 'Devilled Chicken (Large)', price: 900, image: 'assets/images/items/devilled_chicken.png' },
    { code: 'B1043', name: 'BBQ Chicken (Regular)', price: 2100, image: 'assets/images/items/bbq_chicken.png' },
    { code: 'B1044', name: 'Pepsi (330ml)', price: 990, discount: 5, image: 'assets/images/items/pepsi.png' },
    { code: 'B1045', name: 'Coca-Cola (330ml)', price: 1230, image: 'assets/images/items/coca_cola.png' },
    { code: 'B1046', name: 'Sprite (330ml)', price: 1500, discount: 3, image: 'assets/images/items/sprite.png' },
    { code: 'B1047', name: 'Mirinda (330ml)', price: 850, discount: 7, image: 'assets/images/items/mirinda.png' }
];

function loadOrderPage() {
    window.location.href = 'orders.html';
}