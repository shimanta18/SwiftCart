
let cart = JSON.parse(localStorage.getItem('swiftCart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    const categoryList = document.getElementById('category-list');
    const productGrid = document.getElementById('product-grid');

  
    if (categoryList && productGrid) {
 
        fetchCategories();
        loadProducts('https://fakestoreapi.com/products');
    } 
    else if (productGrid) {
        
        loadTrendingItems();
    }
});


async function loadTrendingItems() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '<div class="col-span-full flex justify-center py-20"><span class="loading loading-spinner loading-lg text-primary"></span></div>';

    try {
        const res = await fetch('https://fakestoreapi.com/products?limit=3');
        const products = await res.json();
        grid.innerHTML = ''; 

        products.forEach(p => {
            grid.innerHTML += renderProductCard(p, "lg"); 
        });
    } catch (err) {
        grid.innerHTML = '<p class="text-error col-span-full text-center">Failed to load trending items.</p>';
    }
}


async function loadProducts(url) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '<div class="col-span-full flex justify-center py-20"><span class="loading loading-spinner loading-lg text-primary"></span></div>';

    try {
        const res = await fetch(url);
        const products = await res.json();
        grid.innerHTML = ''; 

        products.forEach(p => {
            grid.innerHTML += renderProductCard(p, "sm"); 
        });
    } catch (err) {
        grid.innerHTML = '<p class="text-error col-span-full text-center">Failed to load products.</p>';
    }
}


function renderProductCard(p, size) {
    const imgHeight = size === "lg" ? "h-64" : "h-48";
    return `
        <div class="card bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden">
            <figure class="p-6 ${imgHeight} bg-gray-50">
                <img src="${p.image}" class="h-full w-full object-contain" alt="product" />
            </figure>
            <div class="card-body p-5">
                <div class="flex justify-between items-center mb-2">
                    <span class="badge badge-sm bg-indigo-50 text-indigo-600 border-none capitalize">${p.category}</span>
                    <span class="text-xs font-semibold text-orange-400">★ ${p.rating.rate}</span>
                </div>
                <h2 class="text-sm font-bold text-gray-800 line-clamp-1">${p.title}</h2>
                <p class="text-lg font-bold text-indigo-700 mt-1 mb-4">$${p.price.toFixed(2)}</p>
                <div class="flex gap-2">
                    <button onclick="viewDetails(${p.id})" class="btn btn-sm btn-outline flex-1">Details</button>
                    <button onclick="addToCart(${p.id}, '${p.title.replace(/'/g, "")}', ${p.price})" class="btn btn-sm btn-primary flex-1 bg-indigo-600 border-none">Add</button>
                </div>
            </div>
        </div>`;
}

// --- Categories ---
async function fetchCategories() {
    const res = await fetch('https://fakestoreapi.com/products/categories');
    const categories = await res.json();
    const container = document.getElementById('category-list');
    if(!container) return;
    
    container.innerHTML = `<button onclick="handleCategory('all', this)" class="btn btn-sm btn-primary category-btn">All</button>`;
    categories.forEach(cat => {
        container.innerHTML += `<button onclick="handleCategory('${cat}', this)" class="btn btn-sm btn-ghost category-btn capitalize">${cat}</button>`;
    });
}

function handleCategory(category, btn) {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.replace('btn-primary', 'btn-ghost'));
    btn.classList.replace('btn-ghost', 'btn-primary');
    const url = category === 'all' ? 'https://fakestoreapi.com/products' : `https://fakestoreapi.com/products/category/${category}`;
    loadProducts(url);
}

// Modal & Cart
async function viewDetails(id) {
    const modal = document.getElementById('details_modal');
    const content = document.getElementById('modal_body');
    modal.showModal();
    content.innerHTML = '<span class="loading loading-dots loading-md"></span>';
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const p = await res.json();
    content.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6">
            <div class="w-full md:w-1/2 flex justify-center items-center bg-white p-4 rounded-xl">
                <img src="${p.image}" class="max-h-64 object-contain" />
            </div>
            <div class="flex-1 text-left">
                <h3 class="font-bold text-xl">${p.title}</h3>
                <div class="badge badge-secondary my-2">${p.category}</div>
                <p class="py-4 text-sm text-gray-500">${p.description}</p>
                <div class="flex items-center justify-between mt-4">
                    <span class="text-2xl font-bold text-indigo-700">$${p.price}</span>
                    <span class="text-sm font-semibold">Rating: ${p.rating.rate} ⭐</span>
                </div>
                <button onclick="addToCart(${p.id}, '${p.title.replace(/'/g, "")}', ${p.price})" class="btn btn-primary w-full mt-6">Add to Cart</button>
            </div>
        </div>`;
}

function addToCart(id, title, price) {
    cart.push({ id, title, price });
    localStorage.setItem('swiftCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const countBadge = document.getElementById('cart-count');
    if (countBadge) countBadge.innerText = cart.length;
}