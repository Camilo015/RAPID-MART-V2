document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartContainer = document.querySelector('.cart-container');
    const closeCartButton = document.querySelector('.close-cart');

    // Actualizar visualización inicial
    CartManager.updateDisplay();

    // Mostrar/Ocultar carrito
    cartIcon.addEventListener('click', () => {
        cartContainer.classList.remove('hidden');
    });

    closeCartButton.addEventListener('click', () => {
        cartContainer.classList.add('hidden');
    });

    // Eventos para los botones del carrito
    cartContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            CartManager.removeItem(e.target.dataset.id);
            showNotification('Producto eliminado del carrito');
        } else if (e.target.classList.contains('quantity-btn')) {
            const id = e.target.dataset.id;
            const change = e.target.classList.contains('plus') ? 1 : -1;
            CartManager.updateQuantity(id, change);
            showNotification('Cantidad actualizada');
        }
    });

    // Cerrar carrito al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (!cartContainer.contains(event.target) && !cartIcon.contains(event.target)) {
            cartContainer.classList.add('hidden');
        }
    });

    // Función para mostrar notificaciones
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 2000);
        }, 100);
    }
}); 