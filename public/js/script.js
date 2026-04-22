// Global Configuration
const API_URL = 'http://localhost:3000/api';

// Utility: Check Authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
        return JSON.parse(userStr);
    }
    return null;
}

// Utility: Update Navbar based on Auth State
function updateNavbar() {
    const user = checkAuth();
    const authLinksDiv = document.getElementById('auth-links');
    
    if (!authLinksDiv) return;

    if (user) {
        authLinksDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-weight: 600; color: var(--primary);">Hi, ${user.name.split(' ')[0]}</span>
                ${user.role === 'admin' ? `<li><a href="admin.html" class="btn btn-outline" style="padding: 0.5rem 1rem;">Admin</a></li>` : ''}
                <li><a href="#" onclick="logout(event)" class="btn btn-primary" style="padding: 0.5rem 1rem;">Logout</a></li>
            </div>
        `;
    }
}

// Global Logout function
function logout(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Global Back Button Injector
function injectBackButton() {
    if (document.getElementById('global-back-btn')) return;

    const backBtn = document.createElement('button');
    backBtn.id = 'global-back-btn';
    backBtn.className = 'global-back-btn';
    backBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    backBtn.title = 'Go Back';
    
    backBtn.addEventListener('click', () => {
        if (window.history.length > 2) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
    });

    document.body.appendChild(backBtn);
}

// Initialize common UI elements
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    injectBackButton();
});

// --- Specific Page Logic ---

// 1. Home Page & Cars Listing: Fetch Cars
async function fetchCars(limit = null, containerId = 'cars-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/cars`);
        if (!response.ok) throw new Error('Failed to fetch cars');
        
        let cars = await response.json();
        
        if (limit) {
            cars = cars.slice(0, limit);
        }

        renderCars(cars, container);
    } catch (error) {
        console.error(error);
        container.innerHTML = `<div class="alert error" style="display:block; grid-column: 1/-1;">Error loading cars. Please ensure backend is running.</div>`;
    }
}

// Fetch only 3 for home page
function fetchFeaturedCars() {
    fetchCars(3, 'featured-cars-container');
}

// Fetch all for Cars page
function fetchAllCars() {
    fetchCars(null, 'cars-container');
}

// Render Cars HTML
function renderCars(cars, container) {
    if (cars.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">No cars available currently.</div>`;
        return;
    }

    const html = cars.map(car => `
        <div class="car-card">
            <div class="car-price-tag">₹${car.price_per_day}/day</div>
            <div class="car-img-wrapper">
                <img src="${car.image}" alt="${car.car_name}">
            </div>
            <div class="car-info">
                <h3 class="car-name">${car.car_name}</h3>
                <div class="car-specs">
                    <div class="spec-item"><i class="fa-solid fa-gas-pump"></i> ${car.fuel_type}</div>
                    <div class="spec-item"><i class="fa-solid fa-users"></i> ${car.seats} Seats</div>
                    <div class="spec-item"><i class="fa-solid ${car.availability ? 'fa-check text-success' : 'fa-xmark text-error'}"></i> ${car.availability ? 'Available' : 'Booked'}</div>
                </div>
                <div class="car-action">
                    <a href="car-details.html?id=${car.id}" class="btn btn-outline btn-block">View Details</a>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}
