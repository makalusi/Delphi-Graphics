document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCountBadge = document.getElementById('cart-count-badge');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    
    // 2. State
    let cart = JSON.parse(localStorage.getItem('delphi_cart')) || [];

    // 3. Functions
    function saveCart() {
        localStorage.setItem('delphi_cart', JSON.stringify(cart));
        renderCart();
    }

    function updateBadge() {
        if (!cartCountBadge) return;
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        if (totalItems > 0) {
            cartCountBadge.innerText = totalItems;
            cartCountBadge.classList.remove('hidden');
        } else {
            cartCountBadge.classList.add('hidden');
        }
    }

    function renderCart() {
        updateBadge();
        if (!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            if (emptyCartMsg) emptyCartMsg.style.display = 'flex';
            cartItemsContainer.appendChild(emptyCartMsg);
            if (cartTotalElement) cartTotalElement.innerText = 'KSh 0';
            return;
        }

        if (emptyCartMsg) emptyCartMsg.style.display = 'none';

        cart.forEach((item, index) => {
            const itemPrice = parseInt(item.price.replace(/[^\d]/g, '')) || 0;
            const itemTotal = itemPrice * (item.quantity || 1);
            total += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 group';
            itemElement.innerHTML = `
                <div class="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                    <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
                </div>
                <div class="flex-grow">
                    <h4 class="font-bold text-gray-900 text-sm leading-tight mb-1">${item.title}</h4>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <button class="qty-btn dec-btn w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100" data-index="${index}">-</button>
                            <span class="text-sm font-semibold w-4 text-center">${item.quantity || 1}</span>
                            <button class="qty-btn inc-btn w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100" data-index="${index}">+</button>
                        </div>
                        <span class="text-delphi-blue font-bold text-sm">KSh ${itemTotal.toLocaleString()}</span>
                    </div>
                </div>
                <button class="remove-btn text-gray-300 hover:text-red-500 transition-colors p-1" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        if (cartTotalElement) cartTotalElement.innerText = `KSh ${total.toLocaleString()}`;
        
        // Bind events to new elements
        document.querySelectorAll('.dec-btn').forEach(btn => btn.onclick = (e) => updateQty(e.target.dataset.index, -1));
        document.querySelectorAll('.inc-btn').forEach(btn => btn.onclick = (e) => updateQty(e.target.dataset.index, 1));
        document.querySelectorAll('.remove-btn').forEach(btn => btn.onclick = (e) => removeItem(e.currentTarget.dataset.index));
    }

    function updateQty(index, delta) {
        const item = cart[index];
        item.quantity = (item.quantity || 1) + delta;
        if (item.quantity < 1) {
            removeItem(index);
        } else {
            saveCart();
        }
    }

    function removeItem(index) {
        cart.splice(index, 1);
        saveCart();
    }

    function toggleCart() {
        if (!cartDrawer) return;
        const isOpening = cartDrawer.classList.contains('translate-x-full');
        if (isOpening) {
            cartDrawer.classList.remove('translate-x-full');
            cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
            renderCart();
        } else {
            cartDrawer.classList.add('translate-x-full');
            cartOverlay.classList.add('opacity-0', 'pointer-events-none');
        }
    }

    // 4. Public API (called from service-detail.html)
    window.addToCart = function(product) {
        const existing = cart.find(item => item.title === product.title);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        toggleCart(); // Open drawer automatically
    };

    // 5. Initial Bindings
    if (cartIconBtn) cartIconBtn.onclick = toggleCart;
    if (closeCartBtn) closeCartBtn.onclick = toggleCart;
    if (cartOverlay) cartOverlay.onclick = toggleCart;

    renderCart(); // Initial render
});
