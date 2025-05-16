// cart.js - Handles shopping cart functionality

// Elements
const cartItemsContainer = document.getElementById('cart-items-container');
const totalElement = document.getElementById('total-amount');
const itemCountElement = document.getElementById('item-count');
const checkoutBtn = document.getElementById('btn-place-order');

// Initialize cart
let cartItems = [];
let cartTotal = 0;
let itemCount = 0;

// Load cart items from localStorage
function loadCartItems() {
    if (localStorage.getItem('cartItems')) {
        cartItems = JSON.parse(localStorage.getItem('cartItems'));
        renderCartItems();
        updateCartSummary();
    } else {
        showEmptyCart();
    }
}

// Render cart items
function renderCartItems() {
    // Clear container
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        showEmptyCart();
        return;
    }
    
    // Create items
    cartItems.forEach(item => {
        const cartItemCard = document.createElement('div');
        cartItemCard.className = 'item';
        
        // Create item image
        const imgContainer = document.createElement('div');
        imgContainer.className = 'item-img';
        
        const img = document.createElement('img');
        img.src = item.preview;
        img.alt = item.name;
        
        imgContainer.appendChild(img);
        
        // Create item details
        const itemDetails = document.createElement('div');
        itemDetails.className = 'item-details';
        
        const itemName = document.createElement('h3');
        itemName.textContent = item.name;
        
        const itemCount = document.createElement('p');
        itemCount.innerHTML = `x<span>${item.quantity}</span>`;
        
        const itemPrice = document.createElement('p');
        itemPrice.innerHTML = `Amount: Rs <span>${item.price * item.quantity}</span>`;
        
        itemDetails.appendChild(itemName);
        itemDetails.appendChild(itemCount);
        itemDetails.appendChild(itemPrice);
        
        // Create remove button
        const removeBtn = document.createElement('div');
        removeBtn.className = 'remove-item';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        
        // Add remove event
        removeBtn.addEventListener('click', () => removeItem(item.id));
        
        // Assemble the card
        cartItemCard.appendChild(imgContainer);
        cartItemCard.appendChild(itemDetails);
        cartItemCard.appendChild(removeBtn);
        
        // Add to container
        cartItemsContainer.appendChild(cartItemCard);
    });
}

// Show empty cart message
function showEmptyCart() {
    cartItemsContainer.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <a href="../index.html" class="continue-shopping">Continue Shopping</a>
        </div>
    `;
    
    // Disable checkout button
    if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('disabled');
    }
}

// Update cart summary
function updateCartSummary() {
    // Calculate totals
    cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    
    // Update display
    totalElement.textContent = cartTotal;
    itemCountElement.textContent = itemCount;
    
    // Update badge
    const badge = document.getElementById('badge');
    if (badge) {
        badge.textContent = itemCount;
    }
    
    // Update cookie
    document.cookie = "counter=" + itemCount;
    
    // Enable/disable checkout button
    if (checkoutBtn) {
        if (cartItems.length > 0) {
            checkoutBtn.disabled = false;
            checkoutBtn.classList.remove('disabled');
        } else {
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('disabled');
        }
    }
}

// Remove item from cart
function removeItem(id) {
    // Find item index
    const itemIndex = cartItems.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        // Remove item
        cartItems.splice(itemIndex, 1);
        
        // Update localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Re-render cart
        renderCartItems();
        updateCartSummary();
    }
}

// Handle checkout
function checkout() {
    if (cartItems.length > 0) {
        // Store order details for order confirmation page
        localStorage.setItem('orderDetails', JSON.stringify({
            items: cartItems,
            total: cartTotal,
            itemCount: itemCount,
            orderId: generateOrderId(),
            orderDate: new Date().toISOString()
        }));
        
        // Clear cart
        localStorage.removeItem('cartItems');
        
        // Reset cookie
        document.cookie = "counter=0";
        
        // Redirect to order confirmation
        window.location.href = 'orderPlaced.html';
    }
}

// Generate random order ID
function generateOrderId() {
    return 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    
    // Add checkout event
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});