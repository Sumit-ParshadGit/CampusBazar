// =========================================
// GLOBAL VARIABLES & DATA
// =========================================
const PRODUCTS = [
    { id: 1, title: "Table fan", price: "2,000", rentPrice: "500/month", seller: "User_101", condition: "Good", type: "both" },
    { id: 2, title: "iPhone 14", price: "60,000", rentPrice: null, seller: "User_202", condition: "Like New", type: "buy" },
    { id: 3, title: "DSLR Camera", price: "35,000", rentPrice: "800/day", seller: "User_303", condition: "Mint", type: "rent" },
    { id: 4, title: "Study Table", price: "3,500", rentPrice: null, seller: "User_303", condition: "Fair", type: "buy" }
];

// =========================================
// THEME TOGGLE
// =========================================
const themeBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', currentTheme);

if(themeBtn) {
    themeBtn.addEventListener('click', () => {
        const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// =========================================
// USER AUTHENTICATION
// =========================================
const userData = JSON.parse(localStorage.getItem('retrade_user_data'));
const authLink = document.getElementById('auth-link');

if(authLink) {
    if(userData) {
        authLink.innerText = "My Profile";
        authLink.href = "profile.html";
    } else {
        authLink.innerText = "Log In / Sign Up";
        authLink.href = "login.html";
    }
}

// Profile button click handler
function handleProfileClick() {
    if(localStorage.getItem('retrade_user_data')) {
        window.location.href = 'profile.html';
    } else {
        window.location.href = 'login.html';
    }
}

// =========================================
// HELPER FUNCTIONS
// =========================================
function checkUserProfile() {
    const user = JSON.parse(localStorage.getItem('retrade_user_data'));
    if (!user) {
        return false;
    }
    return user.name && user.rollNumber && user.branch && user.hostel && user.roomNumber && user.phone;
}

function redirectToLogin(productId, type) {
    window.location.href = `login.html?redirect=checkout&productId=${productId}&type=${type}`;
}

// =========================================
// HOME PAGE LOGIC
// =========================================
if (document.body.classList.contains('page-home')) {
    const grid = document.getElementById('productGrid');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    function renderProducts(filter = "") {
        grid.innerHTML = ""; 
        
        const filteredProducts = PRODUCTS.filter(p => 
            p.title.toLowerCase().includes(filter.toLowerCase())
        );

        if(filteredProducts.length === 0) {
            grid.innerHTML = '<p style="text-align:center; color: var(--text-muted); grid-column: 1/-1; padding: 3rem;">No products found</p>';
            return;
        }

        filteredProducts.forEach(p => {
            let priceHtml = "";
            if(p.type === 'buy') {
                priceHtml = `<span style="color:var(--primary); font-weight:bold;">₹${p.price}</span>`;
            } else if(p.type === 'rent') {
                priceHtml = `<span style="color:var(--rent-color); font-weight:bold;">Rent: ₹${p.rentPrice}</span>`;
            } else {
                priceHtml = `<span style="color:var(--primary); font-weight:bold;">₹${p.price}</span> <span class="rent-tag">OR Rent: ₹${p.rentPrice}</span>`;
            }

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div style="height:180px; background:#111; display:flex; align-items:center; justify-content:center; font-size:40px; color:#555;">📦</div>
                <div class="card-body">
                    <h3 style="margin-bottom: 0.5rem;">${p.title}</h3>
                    <p style="margin-bottom:0.5rem;">${priceHtml}</p>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom: 1rem;">Seller: ${p.seller}</p>
                    
                    <div style="display:flex; gap:8px; margin-bottom: 8px;">
                        <button class="btn-outline" style="flex:1; font-size:0.8rem;" onclick="window.location.href='condition.html?id=${p.id}'">
                            <i class="fa-solid fa-wand-magic-sparkles"></i> Condition
                        </button>
                        <button class="btn-outline" style="flex:1; font-size:0.8rem;" onclick="window.location.href='profile.html?view=chat&seller=${p.seller}'">
                            <i class="fa-regular fa-comments"></i> Enquiry
                        </button>
                    </div>
                    
                    <button class="btn-primary" style="width:100%;" onclick="window.location.href='product_details.html?id=${p.id}'">
                        ${p.type === 'rent' ? 'Rent Now' : 'Buy / Rent Now'}
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Search functionality - works with BOTH Enter key and button click
    function performSearch() {
        const searchTerm = searchInput.value;
        renderProducts(searchTerm);
    }

    // Enter key press
    if(searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });

        // Also search on input (real-time)
        searchInput.addEventListener('input', (e) => {
            renderProducts(e.target.value);
        });
    }

    // Button click
    if(searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // Initial render
    renderProducts();
}

// =========================================
// CONDITION PAGE LOGIC
// =========================================
if (document.body.classList.contains('page-condition')) {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const product = PRODUCTS.find(p => p.id == productId);

    if(product) {
        document.getElementById('cond-title').innerText = product.title;
        document.getElementById('cond-price').innerText = product.type === 'rent' ? "Rent: ₹"+product.rentPrice : "Price: ₹"+product.price;
        document.getElementById('cond-desc').innerText = product.condition;
    } else {
        document.getElementById('cond-title').innerText = "Product Not Found";
    }
}

// =========================================
// PRODUCT DETAILS PAGE LOGIC
// =========================================
if (document.body.classList.contains('page-details')) {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const product = PRODUCTS.find(p => p.id == productId);

    if(product) {
        document.getElementById('det-title').innerText = product.title;
        
        const buyBtn = document.getElementById('btn-buy-action');
        const rentBtn = document.getElementById('btn-rent-action');

        if(product.type === 'rent') {
            buyBtn.style.display = 'none';
            rentBtn.innerText = `Rent for ₹${product.rentPrice}`;
            rentBtn.onclick = () => {
                if (checkUserProfile()) {
                    window.location.href = `checkout.html?id=${productId}&type=rent`;
                } else {
                    redirectToLogin(productId, 'rent');
                }
            };
        } else if (product.type === 'buy') {
            rentBtn.style.display = 'none';
            buyBtn.innerText = `Buy for ₹${product.price}`;
            buyBtn.onclick = () => {
                if (checkUserProfile()) {
                    window.location.href = `checkout.html?id=${productId}&type=buy`;
                } else {
                    redirectToLogin(productId, 'buy');
                }
            };
        } else {
            buyBtn.innerText = `Buy for ₹${product.price}`;
            rentBtn.innerText = `Rent for ₹${product.rentPrice}`;
            buyBtn.onclick = () => {
                if (checkUserProfile()) {
                    window.location.href = `checkout.html?id=${productId}&type=buy`;
                } else {
                    redirectToLogin(productId, 'buy');
                }
            };
            rentBtn.onclick = () => {
                if (checkUserProfile()) {
                    window.location.href = `checkout.html?id=${productId}&type=rent`;
                } else {
                    redirectToLogin(productId, 'rent');
                }
            };
        }
    }
}

// =========================================
// CHECKOUT PAGE LOGIC
// =========================================
if (document.body.classList.contains('page-checkout')) {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const type = params.get('type');
    const product = PRODUCTS.find(p => p.id == productId);
    const user = JSON.parse(localStorage.getItem('retrade_user_data'));

    // Check if user is logged in
    if (!user || !checkUserProfile()) {
        redirectToLogin(productId, type);
    } else if(product) {
        document.getElementById('checkout-title').innerText = product.title;
        const checkoutType = document.getElementById('checkout-type');
        const checkoutPrice = document.getElementById('checkout-price');
        
        if(type === 'rent') {
            checkoutType.innerText = 'Rental';
            checkoutPrice.innerText = '₹' + product.rentPrice;
        } else {
            checkoutType.innerText = 'Purchase';
            checkoutPrice.innerText = '₹' + product.price;
        }

        // Display user delivery information
        const deliveryInfo = document.getElementById('delivery-info');
        if (deliveryInfo) {
            deliveryInfo.innerHTML = `
                <div class="info-item">
                    <i class="fa-solid fa-user"></i>
                    <div>
                        <span class="info-label">Name</span>
                        <span class="info-value">${user.name}</span>
                    </div>
                </div>
                <div class="info-item">
                    <i class="fa-solid fa-id-card"></i>
                    <div>
                        <span class="info-label">Roll Number</span>
                        <span class="info-value">${user.rollNumber}</span>
                    </div>
                </div>
                <div class="info-item">
                    <i class="fa-solid fa-graduation-cap"></i>
                    <div>
                        <span class="info-label">Branch</span>
                        <span class="info-value">${user.branch}</span>
                    </div>
                </div>
                <div class="info-item">
                    <i class="fa-solid fa-building"></i>
                    <div>
                        <span class="info-label">Hostel/Block</span>
                        <span class="info-value">${user.hostel}</span>
                    </div>
                </div>
                <div class="info-item">
                    <i class="fa-solid fa-door-open"></i>
                    <div>
                        <span class="info-label">Room Number</span>
                        <span class="info-value">${user.roomNumber}</span>
                    </div>
                </div>
                <div class="info-item">
                    <i class="fa-solid fa-phone"></i>
                    <div>
                        <span class="info-label">Phone</span>
                        <span class="info-value">${user.phone}</span>
                    </div>
                </div>
            `;
        }

        const confirmBtn = document.getElementById('confirmOrderBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                const notes = document.getElementById('additional-notes').value;
                alert('Order Placed Successfully! 🎉\n\nThe seller will contact you soon at your provided phone number.');
                window.location.href = 'profile.html';
            });
        }
    }
}

// =========================================
// SELL PAGE LOGIC
// =========================================
if (document.body.classList.contains('page-sell')) {
    const sellBtn = document.querySelector('.btn-primary');
    if(sellBtn) {
        sellBtn.addEventListener('click', ()=> {
            alert("Listing Submitted! 📦"); 
            window.location.href='profile.html';
        });
    }
}
