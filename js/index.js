// Main JavaScript for the homepage
console.log('SHOPLANE - E-commerce Website');

// Update cart badge if items are in the cart
if (document.cookie.indexOf(',counter=') >= 0) {
    let counter = document.cookie.split(',')[1].split('=')[1];
    document.getElementById("badge").innerHTML = counter;
}

// Main container and product containers
const containerClothing = document.getElementById("containerClothing");
const containerAccessories = document.getElementById("containerAccessories");

// Function to create product card elements
function createProductCard(product) {
    // Create card elements
    const card = document.createElement("div");
    card.className = "product-card";
    
    // Create link wrapper
    const cardLink = document.createElement("a");
    cardLink.href = `pages/contentDetails.html?${product.id}`;
    
    // Create image element
    const imgTag = document.createElement("img");
    imgTag.src = product.preview;
    imgTag.alt = product.name;
    
    // Create details container
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "product-details";
    
    // Create product name
    const productName = document.createElement("h3");
    productName.className = "product-name";
    productName.textContent = product.name;
    
    // Create brand name
    const brandName = document.createElement("h4");
    brandName.className = "product-brand";
    brandName.textContent = product.brand;
    
    // Create price
    const price = document.createElement("h2");
    price.className = "product-price";
    price.textContent = `Rs. ${product.price}`;
    
    // Assemble the card
    detailsDiv.appendChild(productName);
    detailsDiv.appendChild(brandName);
    detailsDiv.appendChild(price);
    
    cardLink.appendChild(imgTag);
    cardLink.appendChild(detailsDiv);
    
    card.appendChild(cardLink);
    
    return card;
}

// Fetch products from API
fetch('https://5d76bf96515d1a0014085cf9.mockapi.io/product')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(products => {
        console.log('Products loaded:', products.length);
        
        // Clear existing content
        containerClothing.innerHTML = '';
        containerAccessories.innerHTML = '';
        
        // Sort products by priority
        products.sort((a, b) => a.priority - b.priority);
        
        // Populate products in their respective containers
        products.forEach(product => {
            if (product.isAccessory) {
                containerAccessories.appendChild(createProductCard(product));
            } else {
                containerClothing.appendChild(createProductCard(product));
            }
        });
    })
    .catch(error => {
        console.error('Error fetching products:', error);
        
        // Show error message on the page
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Failed to load products. Please try again later.';
        
        containerClothing.innerHTML = '';
        containerClothing.appendChild(errorMessage);
    });

// Add smooth scrolling for navigation
document.addEventListener('DOMContentLoaded', function() {
    // Get all anchor links
    const links = document.querySelectorAll('a[href^="/#"]');
    
    // Add click event listener to each link
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get the target section id
            const targetId = this.getAttribute('href').substring(2);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});