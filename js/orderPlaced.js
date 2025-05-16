// orderPlaced.js - Handles order confirmation functionality

// Elements
const orderIdElement = document.getElementById('order-id');
const orderDateElement = document.getElementById('order-date');
const totalItemsElement = document.getElementById('total-items');
const totalAmountElement = document.getElementById('total-amount');
const deliveryAddressElement = document.getElementById('delivery-address');
const orderItemsContainer = document.getElementById('order-items');
const continueShoppingBtn = document.getElementById('continue-shopping');

// Load order details
function loadOrderDetails() {
    // Get order details from localStorage
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));
    
    if (!orderDetails) {
        // If no order details found, redirect to homepage
        window.location.href = '../index.html';
        return;
    }
    
    // Display order ID
    orderIdElement.textContent = orderDetails.orderId;
    
    // Format and display order date
    const orderDate = new Date(orderDetails.orderDate);
    orderDateElement.textContent = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Display total items
    totalItemsElement.textContent = orderDetails.itemCount;
    
    // Display total amount
    totalAmountElement.textContent = orderDetails.total;
    
    // Display delivery address (using mock data)
    deliveryAddressElement.textContent = '123 Main Street, Apt 4B, New York, NY 10001';
    
    // Display order items
    displayOrderItems(orderDetails.items);
    
    // Reset cart badge
    document.getElementById('badge').textContent = '0';
    
    // Add event listener to continue shopping button
    continueShoppingBtn.addEventListener('click', function() {
        window.location.href = '../index.html';
    });
}

// Display order items
function displayOrderItems(items) {
    // Clear container
    orderItemsContainer.innerHTML = '';
    
    // Display each item
    items.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        
        // Create item image
        const itemImg = document.createElement('div');
        itemImg.className = 'item-img';
        
        const img = document.createElement('img');
        img.src = item.preview;
        img.alt = item.name;
        
        itemImg.appendChild(img);
        
        // Create item details
        const itemDetails = document.createElement('div');
        itemDetails.className = 'item-details';
        
        const itemName = document.createElement('h3');
        itemName.textContent = item.name;
        
        const itemQuantity = document.createElement('p');
        itemQuantity.className = 'item-quantity';
        itemQuantity.textContent = `Quantity: ${item.quantity}`;
        
        const itemAmount = document.createElement('p');
        itemAmount.className = 'item-amount';
        itemAmount.textContent = `Amount: Rs ${item.price * item.quantity}`;
        
        itemDetails.appendChild(itemName);
        itemDetails.appendChild(itemQuantity);
        itemDetails.appendChild(itemAmount);
        
        // Assemble order item
        orderItem.appendChild(itemImg);
        orderItem.appendChild(itemDetails);
        
        // Add to container
        orderItemsContainer.appendChild(orderItem);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadOrderDetails();
    
    // Reset cart data after 1 second (just to ensure the page loads correctly first)
    setTimeout(() => {
        // Clear localStorage order details
        localStorage.removeItem('orderDetails');
    }, 1000);
});