// Funciones compartidas del carrito
const CartManager = {
    getCart: function() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },

    saveCart: function(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    },

    updateDisplay: function() {
        const cart = this.getCart();
        const cartCount = document.querySelectorAll('.cart-count');
        const cartItems = document.querySelector('.cart-items');
        const totalAmount = document.querySelector('.total-amount');

        // Actualizar contador
        const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);
        cartCount.forEach(count => count.textContent = totalItems);

        // Actualizar items
        if (cartItems) {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="item-details">
                        <h4>${item.nombre}</h4>
                        <div class="price-quantity">
                            <div class="quantity-controls">
                                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                <span>${item.cantidad}</span>
                                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                            </div>
                            ${item.precioOriginal ? `
                                <div class="price-container">
                                    <p class="original-price">$${(item.precioOriginal * item.cantidad).toLocaleString()}</p>
                                    <p class="discounted-price">$${(item.precio * item.cantidad).toLocaleString()}</p>
                                </div>
                            ` : `
                                <p>$${(item.precio * item.cantidad).toLocaleString()}</p>
                            `}
                            <button class="remove-item" data-id="${item.id}">Eliminar</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Agregar eventos a los botones después de actualizar el HTML
            this.addEventListeners();
        }

        // Actualizar total
        if (totalAmount) {
            const total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            totalAmount.textContent = `$${total.toLocaleString()}`;
        }
    },

    addEventListeners: function() {
        const cartItems = document.querySelector('.cart-items');
        
        // Eliminar eventos anteriores
        const oldElement = cartItems;
        const newElement = oldElement.cloneNode(true);
        oldElement.parentNode.replaceChild(newElement, oldElement);

        // Agregar nuevos eventos
        newElement.addEventListener('click', (e) => {
            const target = e.target;

            // Evento para botón eliminar
            if (target.classList.contains('remove-item')) {
                e.stopPropagation();
                const id = target.dataset.id;
                this.removeItem(id);
            }

            // Eventos para botones de cantidad
            if (target.classList.contains('quantity-btn')) {
                e.stopPropagation();
                const id = target.dataset.id;
                const change = target.classList.contains('plus') ? 1 : -1;
                this.updateQuantity(id, change);
            }
        });
    },

    addItem: function(id, nombre, precio, precioOriginal = null) {
        const cart = this.getCart();
        // Convertir id a string para asegurar una comparación consistente
        const stringId = id.toString();
        const existingItem = cart.find(item => item.id.toString() === stringId);
        
        if (existingItem) {
            existingItem.cantidad++;
            // Actualizar precio y precioOriginal si el producto viene de promociones
            if (precioOriginal !== null) {
                existingItem.precio = precio;
                existingItem.precioOriginal = precioOriginal;
            }
        } else {
            cart.push({
                id: stringId,
                nombre,
                precio,
                precioOriginal,
                cantidad: 1
            });
        }
        
        this.saveCart(cart);
        this.updateDisplay();
    },

    removeItem: function(id) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== id);
        this.saveCart(cart);
        this.updateDisplay();
    },

    updateQuantity: function(id, change) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === id);
        
        if (item) {
            item.cantidad += change;
            if (item.cantidad <= 0) {
                this.removeItem(id);
            } else {
                this.saveCart(cart);
                this.updateDisplay();
            }
        }
    }
}; 