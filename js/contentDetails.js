// contentDetails.js - Handles product detail page functionality

// Get product ID from URL
const productId = window.location.search.split('?')[1];
const containerProduct = document.getElementById("containerProduct");

// Function to add items to cart
function addToCart() {
    // Get product data from localStorage if available
    const productData = JSON.parse(localStorage.getItem('product-' + productId));
    
    if (!productData) {
        alert('Unable to add to cart. Please try again later.');
        return;
    }
    
    // Initialize cart items array
    let cartItems = [];
    
    if (localStorage.getItem('cartItems')) {
        // If cart already has items, parse them
        cartItems = JSON.parse(localStorage.getItem('cartItems'));
    }
    
    // Check if product already exists in cart
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        // If product exists, increment quantity
        existingItem.quantity += 1;
    } else {
        // If product doesn't exist, add it with quantity 1
        cartItems.push({
            id: productId,
            name: productData.name,
            price: productData.price,
            preview: productData.preview,
            quantity: 1
        });
    }
    
    // Update cart in localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update cart counter in cookie
    let counter = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.cookie = "productId=" + productId + ",counter=" + counter;
    
    // Update cart badge
    document.getElementById("badge").innerHTML = counter;
    
    // Show confirmation
    alert('Product added to cart successfully!');
}

// Function to create product detail elements
function createProductDetails(product) {
    // Store product data in localStorage for cart use
    localStorage.setItem('product-' + product.id, JSON.stringify(product));
    
    // Create left section (preview image)
    const leftSection = document.createElement("div");
    leftSection.className = "left-column";
    
    const productImg = document.createElement("img");
    productImg.id = "productImg";
    productImg.src = product.preview;
    productImg.alt = product.name;
    
    leftSection.appendChild(productImg);
    
    // Create right section (product details)
    const rightSection = document.createElement("div");
    rightSection.className = "right-column";
    
    // Product description
    const productDescription = document.createElement("div");
    productDescription.className = "product-description";
    
    const productTitle = document.createElement("h1");
    productTitle.textContent = product.name;
    
    const productBrand = document.createElement("h4");
    productBrand.textContent = product.brand;
    
    const productPrice = document.createElement("h3");
    productPrice.textContent = "Price: Rs ";
    
    const priceValue = document.createElement("span");
    priceValue.textContent = product.price;
    
    productPrice.appendChild(priceValue);
    
    const productDescTitle = document.createElement("div");
    productDescTitle.className = "description";
    productDescTitle.textContent = "Description";
    
    const productDescText = document.createElement("p");
    productDescText.textContent = product.description;
    
    // Product configuration
    const productConfig = document.createElement("div");
    productConfig.className = "product-configuration";
    
    // Product color options
    const productColor = document.createElement("div");
    productColor.className = "product-color";
    
    const colorTitle = document.createElement("span");
    colorTitle.textContent = "Color";
    
    const colorContainer = document.createElement("div");
    colorContainer.className = "color-choose";
    
    // Create color options from photos array
    for (let i = 0; i < product.photos.length; i++) {
        const colorOption = document.createElement("div");
        
        const colorInput = document.createElement("input");
        colorInput.type = "radio";
        colorInput.id = `color-${i+1}`;
        colorInput.name = "color";
        colorInput.value = i;
        
        if (i === 0) {
            colorInput.checked = true;
        }
        
        // Add change event to update preview image
        colorInput.addEventListener('change', function() {
            document.getElementById('productImg').src = product.photos[this.value];
        });
        
        const colorLabel = document.createElement("label");
        colorLabel.setAttribute("for", `color-${i+1}`);
        colorLabel.style.backgroundImage = `url(${product.photos[i]})`;
        
        colorOption.appendChild(colorInput);
        colorOption.appendChild(colorLabel);
        colorContainer.appendChild(colorOption);
    }
    
    // Cart action
    const cartAction = document.createElement("div");
    cartAction.className = "cart-btn";
    
    const addButton = document.createElement("button");
    addButton.id = "add-to-cart";
    addButton.textContent = "Add to Cart";
    
    // Add click event to button
    addButton.addEventListener('click', addToCart);
    
    // Assemble the components
    productColor.appendChild(colorTitle);
    productColor.appendChild(colorContainer);
    
    productConfig.appendChild(productColor);
    
    productDescription.appendChild(productTitle);
    productDescription.appendChild(productBrand);
    productDescription.appendChild(productPrice);
    productDescription.appendChild(productDescTitle);
    productDescription.appendChild(productDescText);
    
    cartAction.appendChild(addButton);
    
    rightSection.appendChild(productDescription);
    rightSection.appendChild(productConfig);
    rightSection.appendChild(cartAction);
    
    // Add sections to container
    containerProduct.appendChild(leftSection);
    containerProduct.appendChild(rightSection);
}

// Fetch product details
fetch('https://5d76bf96515d1a0014085cf9.mockapi.io/product/' + productId)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(product => {
        // Display product details
        createProductDetails(product);
    })
    .catch(error => {
        console.error('Error fetching product:', error);
        
        // Show error message
        containerProduct.innerHTML = `
            <div class="error-message">
                <h2>Product Not Found</h2>
                <p>Sorry, we couldn't find the product you're looking for.</p>
                <a href="../index.html">Return to Homepage</a>
            </div>
        `;
    });