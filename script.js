/**
 * Nxt Trendz - Indian E-Commerce Clone Logic
 * Handles Authentication, View Transitions, and Commerce
 */

class NxtTrendzApp {
    constructor() {
        this.products = [
            { id: 1, title: "Premium Men's Jacket", brand: "Pepe Jeans", price: 2999, rating: 4.5, image: "https://assets.ccbp.in/frontend/react-js/nxt-trendz/men-jacket-1.png", category: "Clothing" },
            { id: 2, title: "Ethnic Saree", brand: "Biba", price: 4999, rating: 4.8, image: "https://assets.ccbp.in/frontend/react-js/nxt-trendz/women-saree-1.png", category: "Clothing" },
            { id: 3, title: "Modern Coffee Mug", brand: "Prestige", price: 499, rating: 4.2, image: "https://assets.ccbp.in/frontend/react-js/nxt-trendz/home-mug-1.png", category: "Home" },
            { id: 4, title: "Premium Sneakers", brand: "Adidas", price: 3499, rating: 4.4, image: "https://assets.ccbp.in/frontend/react-js/nxt-trendz/men-shoes-1.png", category: "Footwear" },
            { id: 5, title: "Comfortable Hoodie", brand: "Puma", price: 1999, rating: 4.3, image: "https://assets.ccbp.in/frontend/react-js/nxt-trendz/men-hoodie-1.png", category: "Clothing" },
            { id: 6, title: "Designer Table Lamp", brand: "Philips", price: 1299, rating: 4.6, image: "https://assets.ccbp.in/frontend/react-js/nxt-trendz/home-lamp-1.png", category: "Home" },
            { id: 7, title: "Sports Running Shoes", brand: "Nike", price: 5999, rating: 4.9, image: "https://assets.ccbp.in/frontend/react-js/nxt-trendz/men-shoes-2.png", category: "Footwear" },
            { id: 8, title: "Classic Analog Watch", brand: "Titan", price: 3999, rating: 4.7, image: "https://assets.ccbp.in/frontend/react-js/nxt-trendz/watches-1.png", category: "Electronics" }
        ];

        this.state = this.loadState();
        this.currentView = this.state.isLoggedIn ? 'home' : 'login';
        this.filters = { category: 'All', rating: 0, search: '', sort: 'PRICE_HIGH' };
        
        this.init();
    }

    // --- STATE & PERSISTENCE ---
    loadState() {
        const saved = localStorage.getItem('nxt_trendz_state');
        if (saved) return JSON.parse(saved);
        return {
            isLoggedIn: false,
            username: '',
            cart: []
        };
    }

    saveState() {
        localStorage.setItem('nxt_trendz_state', JSON.stringify(this.state));
        this.updateCartBadge();
    }

    // --- INITIALIZATION ---
    init() {
        this.setupEventListeners();
        this.renderView(this.currentView);
        this.renderCategories();
        this.renderRatings();
        
        // Hide loader after simulation
        setTimeout(() => {
            document.getElementById('loader').style.opacity = '0';
            setTimeout(() => document.getElementById('loader').style.display = 'none', 500);
        }, 1000);
    }

    setupEventListeners() {
        // Login Form
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));

        // Sorting
        document.getElementById('sort-price').addEventListener('change', (e) => {
            this.filters.sort = e.target.value;
            this.renderProducts();
        });

        // Searching
        document.getElementById('product-search').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.renderProducts();
        });

        // Chatbot Enter
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChat();
        });
    }

    // --- AUTHENTICATION ---
    handleLogin(e) {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-msg');

        // Credentials from Nxt Trendz Specs
        if (user === 'rahul' && pass === 'rahul@2021') {
            this.state.isLoggedIn = true;
            this.state.username = user;
            this.saveState();
            this.navigate('home');
            errorMsg.textContent = '';
        } else {
            errorMsg.textContent = '*Invalid Username or Password';
        }
    }

    logout() {
        this.state.isLoggedIn = false;
        this.state.username = '';
        this.saveState();
        this.navigate('login');
    }

    // --- NAVIGATION ---
    navigate(viewId) {
        if (!this.state.isLoggedIn && viewId !== 'login') {
            this.currentView = 'login';
        } else {
            this.currentView = viewId;
        }
        this.renderView(this.currentView);
    }

    renderView(viewId) {
        // Hide/Show Navbar
        document.getElementById('main-nav').style.display = (viewId === 'login' ? 'none' : 'block');
        
        // Hide all views
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
        
        const activeSec = document.getElementById(`${viewId}-view`);
        if (activeSec) {
            activeSec.classList.add('active');
        } else {
            document.getElementById('notfound-view').classList.add('active');
        }

        // View Specific Renders
        if (viewId === 'products') this.renderProducts();
        if (viewId === 'cart') this.renderCart();

        // Update Nav Active State
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        const activeLink = document.getElementById(`nav-${viewId}`);
        if (activeLink) activeLink.classList.add('active');

        window.scrollTo({ top: 0, behavior: 'smooth' });
        lucide.createIcons();
    }

    // --- PRODUCTS LOGIC ---
    renderCategories() {
        const categories = ['All', 'Clothing', 'Electronics', 'Footwear', 'Home'];
        const list = document.getElementById('category-list');
        list.innerHTML = categories.map(cat => `
            <li class="filter-item ${this.filters.category === cat ? 'active' : ''}" 
                onclick="app.setFilter('category', '${cat}')">${cat}</li>
        `).join('');
    }

    renderRatings() {
        const ratings = [4, 3, 2, 1];
        const list = document.getElementById('rating-list');
        list.innerHTML = ratings.map(r => `
            <li class="filter-item ${this.filters.rating === r ? 'active' : ''}" 
                onclick="app.setFilter('rating', ${r})">& ${r} Stars up</li>
        `).join('');
    }

    setFilter(key, value) {
        this.filters[key] = value;
        this.renderCategories();
        this.renderRatings();
        this.renderProducts();
    }

    clearFilters() {
        this.filters = { category: 'All', rating: 0, search: '', sort: 'PRICE_HIGH' };
        this.renderCategories();
        this.renderRatings();
        this.renderProducts();
    }

    renderProducts() {
        let filtered = this.products.filter(p => {
            const matchCat = this.filters.category === 'All' || p.category === this.filters.category;
            const matchRating = p.rating >= this.filters.rating;
            const matchSearch = p.title.toLowerCase().includes(this.filters.search);
            return matchCat && matchRating && matchSearch;
        });

        // Sort
        if (this.filters.sort === 'PRICE_HIGH') filtered.sort((a, b) => b.price - a.price);
        else filtered.sort((a, b) => a.price - b.price);

        const list = document.getElementById('products-list');
        const empty = document.getElementById('no-products');

        if (filtered.length === 0) {
            list.innerHTML = '';
            empty.classList.remove('hidden');
        } else {
            empty.classList.add('hidden');
            list.innerHTML = filtered.map(p => `
                <div class="product-card" onclick="app.renderDetail(${p.id})">
                    <img src="${p.image}" alt="${p.title}" class="card-img">
                    <h3 class="card-title">${p.title}</h3>
                    <p class="card-brand">by ${p.brand}</p>
                    <div class="card-price-rating">
                        <p class="card-price">₹${p.price}</p>
                        <p class="rating-p">${p.rating} <i data-lucide="star" style="width:12px; height:12px"></i></p>
                    </div>
                </div>
            `).join('');
        }
        lucide.createIcons();
    }

    // --- PRODUCT DETAIL ---
    renderDetail(id) {
        const p = this.products.find(item => item.id === id);
        const container = document.getElementById('product-detail-container');
        container.innerHTML = `
            <img src="${p.image}" alt="${p.title}" class="detail-img">
            <div class="detail-info">
                <h1>${p.title}</h1>
                <p class="detail-price">₹${p.price}</p>
                <div style="display:flex; gap:12px; align-items:center">
                    <p class="rating-p">${p.rating} ★</p>
                    <p style="color:var(--text-muted)">120 Reviews</p>
                </div>
                <p class="detail-desc">Premium quality ${p.category} item by ${p.brand}. Experience the best in class design and comfort with Nxt Trendz quality standards.</p>
                <p><b>Available:</b> In Stock</p>
                <p><b>Brand:</b> ${p.brand}</p>
                <div class="quantity-controller">
                    <button class="qty-btn" onclick="app.adjustQty(-1)">-</button>
                    <span id="detail-qty">1</span>
                    <button class="qty-btn" onclick="app.adjustQty(1)">+</button>
                </div>
                <button class="btn btn-primary" style="width:fit-content" onclick="app.addToCart(${p.id})">ADD TO CART</button>
            </div>
        `;
        this.navigate('product-detail');
        lucide.createIcons();
    }

    adjustQty(delta) {
        const el = document.getElementById('detail-qty');
        let qty = parseInt(el.textContent);
        qty = Math.max(1, qty + delta);
        el.textContent = qty;
    }

    // --- CART LOGIC ---
    addToCart(id) {
        const p = this.products.find(item => item.id === id);
        const qty = parseInt(document.getElementById('detail-qty')?.textContent || 1);
        
        const existing = this.state.cart.find(i => i.id === id);
        if (existing) {
            existing.quantity += qty;
        } else {
            this.state.cart.push({ ...p, quantity: qty });
        }
        
        this.saveState();
        this.navigate('cart');
    }

    removeFromCart(id) {
        this.state.cart = this.state.cart.filter(i => i.id !== id);
        this.saveState();
        this.renderCart();
    }

    updateCartQty(id, delta) {
        const item = this.state.cart.find(i => i.id === id);
        if (item) {
            item.quantity = Math.max(1, item.quantity + delta);
            this.saveState();
            this.renderCart();
        }
    }

    clearCart() {
        this.state.cart = [];
        this.saveState();
        this.renderCart();
    }

    renderCart() {
        const list = document.getElementById('cart-list');
        const empty = document.getElementById('empty-cart');
        const summary = document.getElementById('cart-summary');

        if (this.state.cart.length === 0) {
            list.innerHTML = '';
            empty.classList.remove('hidden');
            summary.classList.add('hidden');
        } else {
            empty.classList.add('hidden');
            summary.classList.remove('hidden');
            
            list.innerHTML = this.state.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4 class="card-title">${item.title}</h4>
                        <p class="card-brand">by ${item.brand}</p>
                    </div>
                    <div class="quantity-controller">
                        <button class="qty-btn" onclick="app.updateCartQty(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="app.updateCartQty(${item.id}, 1)">+</button>
                    </div>
                    <p class="cart-item-price">₹${item.price * item.quantity}</p>
                    <button class="btn-remove" onclick="app.removeFromCart(${item.id})"><i data-lucide="x-circle"></i></button>
                </div>
            `).join('');

            const total = this.state.cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
            document.getElementById('total-price').textContent = `Order Total: ₹${total}`;
            document.getElementById('total-items').textContent = `${this.state.cart.length} items in cart`;
        }
        lucide.createIcons();
    }

    updateCartBadge() {
        const count = this.state.cart.reduce((acc, i) => acc + i.quantity, 0);
        document.getElementById('cart-count').textContent = count;
        document.getElementById('cart-count-mob').textContent = count;
    }

    // --- CHATBOT ---
    toggleChatbot() {
        document.getElementById('chatbot').style.display = 
            (document.getElementById('chatbot').style.display === 'flex' ? 'none' : 'flex');
    }

    sendChat() {
        const input = document.getElementById('chat-input');
        const val = input.value.trim().toLowerCase();
        if (!val) return;

        this.addMessage(input.value, 'user');
        input.value = '';

        setTimeout(() => {
            let res = "I'm not sure about that. Try asking about products, login, or cart.";
            if (val.includes('hello')) res = "Hello! How can I help you shop today?";
            else if (val.includes('rahul')) res = "Rahul is our demo user! You can login with 'rahul' and 'rahul@2021'.";
            else if (val.includes('order')) res = "To order, add products to your cart and click Checkout!";
            else if (val.includes('rupees')) res = "Yes! All our products are priced in Indian Rupees (₹).";
            
            this.addMessage(res, 'bot');
        }, 800);
    }

    addMessage(text, side) {
        const container = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.className = `msg ${side}`;
        div.textContent = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
}

// Global instance
const app = new NxtTrendzApp();
