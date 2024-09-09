const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const productsContainer = document.getElementById('products-container');
const adminContainer = document.getElementById('admin-container');
const logoutBtn = document.getElementById('logout-btn');
const productsDiv = document.getElementById('products');
const cartUl = document.getElementById('cart');
const checkoutBtn = document.getElementById('checkout-btn');
let cart = [];
let token = '';
let role = '';

// Login Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        console.log('Login response data:', data);
 
            token = data.token;
            // console.log("Role of token",token);
            if (data.message.includes('admin')) {
                role = 'superadmin';
            } else {
                role = 'user';
            }
            
            
            // Show welcome message
            document.getElementById('login-message').innerText = `Hello, ${email}!`;

            // Hide login form and show other sections
            loginContainer.classList.add('hidden');
            productsContainer.classList.remove('hidden');
            logoutBtn.classList.remove('hidden');

            // If user is superadmin, show admin panel
            if (role === 'superadmin') {
                adminContainer.classList.remove('hidden');
            }

            // Fetch and display products
            loadProducts();
        
    } catch (err) {
        console.error('Login Error:', err);
    }
});

// Load Products from Backend
async function loadProducts() {
    const res = await fetch('/api/products');
    const products = await res.json();

    productsDiv.innerHTML = ''; // Clear current products

    products.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <p>${product.imageUrl}
            <button onclick="addToCart('${product._id}', '${product.title}')">Add to Cart</button>
        `;
        productsDiv.appendChild(productDiv);
    });
}

// Add Product to Cart
function addToCart(id, title) {
    cart.push({ id, title });
    renderCart();
}

// Render Cart Items
function renderCart() {
    cartUl.innerHTML = '';
    cart.forEach((item) => {
        const li = document.createElement('li');
        li.innerText = item.title;
        cartUl.appendChild(li);
    });
}

// Checkout Cart
checkoutBtn.addEventListener('click', async () => {
    try {
        const res = await fetch('/api/cart/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ cart, shippingAddress: '123 Main St' }),
        });
        const data = await res.json();

        if (res.status === 200) {
            alert('Checkout successful!');
            cart = []; // Clear cart
            renderCart();
        } else {
            alert(data.message || 'Checkout failed');
        }
    } catch (err) {
        console.error('Checkout Error:', err);
    }
});

// Logout Functionality
logoutBtn.addEventListener('click', () => {
    token = '';
    role = '';
    cart = [];

    // Reset UI
    loginContainer.classList.remove('hidden');
    productsContainer.classList.add('hidden');
    adminContainer.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    document.getElementById('login-message').innerText = '';
});
