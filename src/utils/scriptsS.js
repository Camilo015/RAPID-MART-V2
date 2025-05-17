document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad del carrito
    const cartIcon = document.querySelector('.cart-icon');
    const cartContainer = document.querySelector('.cart-container');
    const closeCartButton = document.querySelector('.close-cart');
    const addToCartButtons = document.querySelectorAll('.agregar-carrito');

    // Mostrar/Ocultar carrito
    cartIcon.addEventListener('click', () => {
        cartContainer.classList.remove('hidden');
    });

    closeCartButton.addEventListener('click', () => {
        cartContainer.classList.add('hidden');
    });

    // Cerrar carrito al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (!cartContainer.contains(event.target) && !cartIcon.contains(event.target)) {
            cartContainer.classList.add('hidden');
        }
    });

    // Actualizar visualización inicial del carrito
    CartManager.updateDisplay();

    // Agregar eventos a los botones de "Agregar al Carrito"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const nombre = button.dataset.nombre;
            const precio = parseInt(button.dataset.precio);
            const precioOriginal = button.dataset.precioOriginal ? 
                parseInt(button.dataset.precioOriginal) : null;
            
            CartManager.addItem(id, nombre, precio, precioOriginal);
            showNotification('Producto agregado al carrito');
        });
    });

    // Agregar manejo de modal para las imágenes de productos
    const productImages = document.querySelectorAll('.producto-card img');
    
    // Crear el modal una sola vez
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <img class="modal-image" src="" alt="">
            <h3 class="modal-title"></h3>
            <p class="modal-description"></p>
            <p class="modal-price"></p>
            <button class="agregar-carrito-modal">Agregar al Carrito</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Agregar evento click a cada imagen
    productImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            const card = img.closest('.producto-card');
            const addButton = card.querySelector('.agregar-carrito');
            const modalImage = modal.querySelector('.modal-image');
            const modalAddButton = modal.querySelector('.agregar-carrito-modal');
            const precioOriginal = card.querySelector('.precio-original')?.textContent || '';
            const descuentoBadge = card.querySelector('.descuento-badge')?.textContent || '';

            modalImage.src = img.src;
            modalImage.alt = img.alt;

            // Actualizar precios en el modal
            if (precioOriginal) {
                modal.querySelector('.precio-original').textContent = precioOriginal;
                modal.querySelector('.precio-original').style.display = 'block';
            } else {
                modal.querySelector('.precio-original').style.display = 'none';
            }

            modalAddButton.dataset.id = addButton.dataset.id;
            modalAddButton.dataset.nombre = addButton.dataset.nombre;
            modalAddButton.dataset.precio = addButton.dataset.precio;
            modalAddButton.dataset.precioOriginal = addButton.dataset.precioOriginal || '';
            
            modal.classList.add('modal-show');
        });
    });

    // Agregar evento al botón de agregar al carrito en el modal
    modal.querySelector('.agregar-carrito-modal').addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const nombre = e.target.dataset.nombre;
        const precio = parseInt(e.target.dataset.precio);
        
        CartManager.addItem(id, nombre, precio);
        showNotification('Producto agregado al carrito');
    });

    // Cerrar modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('modal-show');
    });

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('modal-show');
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