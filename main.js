document.getElementById("CurrentYear").innerText = new Date().getFullYear();

// ================= THEME TOGGLE =================
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const html = document.documentElement;

// Get saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

// Update icon based on theme
function updateThemeIcon(theme) {
    const toggles = [themeToggle, themeToggleMobile].filter(Boolean);
    toggles.forEach(toggle => {
        const moonIcon = toggle.querySelector('.fa-moon');
        const sunIcon = toggle.querySelector('.fa-sun');
        if (theme === 'light') {
            if (moonIcon) moonIcon.style.display = 'none';
            if (sunIcon) sunIcon.style.display = 'block';
        } else {
            if (moonIcon) moonIcon.style.display = 'block';
            if (sunIcon) sunIcon.style.display = 'none';
        }
    });
}

updateThemeIcon(savedTheme);

// Toggle theme function
function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Add event listeners to both toggle buttons
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}
if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
}
// 1. Mobile Menu Toggle
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.querySelector('i').classList.remove('fa-times');
        menuBtn.querySelector('i').classList.add('fa-bars');
    });
});

// 2. Scroll Animation (Fade In Up)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
});

// 3. Dynamic Header (Shrink on Scroll) & Enhanced Active Menu Link (Scroll Spy)
function updateActiveSection() {
    const header = document.getElementById('main-header');
    const scrollY = window.pageYOffset || window.scrollY;
    
    // Shrink header
    if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Enhanced Active Menu Highlight (Scroll Spy)
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a:not(.btn)');
    const headerHeight = header.offsetHeight;
    const scrollPosition = scrollY + headerHeight + 100; // Offset for better detection

    let currentSection = '';
    let minDistance = Infinity;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        // Check if section is in viewport
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const distance = Math.abs(scrollPosition - (sectionTop + sectionHeight / 2));
            if (distance < minDistance) {
                minDistance = distance;
                currentSection = sectionId;
            }
        }
    });

    // If no section found, check which section is closest to viewport
    if (!currentSection) {
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionCenter = sectionTop + sectionHeight / 2;
            const distance = Math.abs(scrollPosition - sectionCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                currentSection = section.getAttribute('id');
            }
        });
    }

    // Update active class on nav items
    navItems.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.includes(currentSection)) {
            link.classList.add('active');
        }
    });

    // Special case for hero section (top of page)
    if (scrollY < 300) {
        navItems.forEach(link => link.classList.remove('active'));
    }
}

// Throttle scroll event for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(updateActiveSection);
});

// Initial call
updateActiveSection();
let captchaValue = "";
const MAX_LIMIT = 2;

/* ================= CAPTCHA ================= */
function generateCaptcha() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    captchaValue = "";
    for (let i = 0; i < 6; i++) {
        captchaValue += chars[Math.floor(Math.random() * chars.length)];
    }
    document.getElementById("captchaText").innerText = captchaValue;
}

document.getElementById("refreshCaptcha").addEventListener("click", generateCaptcha);

/* ================= ERROR SYSTEM (NO HTML SMALL) ================= */
function getErrorEl(input) {
    let error = input._errorEl;

    if (!error) {
        error = document.createElement("small");
        error.style.color = "red";
        error.style.display = "none";
        error.style.fontSize = "12px";
        error.style.marginTop = "4px";
        error.style.display = "block";

        // insert AFTER input or captcha-row
        if (input.parentElement.classList.contains("captcha-row")) {
            input.parentElement.after(error);
        } else {
            input.after(error);
        }

        input._errorEl = error;
    }

    return error;
}

function showError(input, msg){
    const error = getErrorEl(input);
    error.innerText = msg;
    error.style.display = "block";
}

function clearError(input) {
    const error = input._errorEl;
    if (error) {
        error.innerText = "";
        error.style.display = "none";
    }
}

/* ================= TOAST ================= */
function showToast(msg) {
    const toast = document.getElementById("showToast");
    toast.innerText = msg;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}

/* ================= FORM SUBMIT ================= */
document.getElementById("hireForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const project = document.getElementById("projectType");
    const message = document.getElementById("message");
    const captcha = document.getElementById("captchaInput");
    const captchaMessage = document.getElementById("captchaMessage");

    // NAME
    if (!name.value.trim()) {
        showError(name, "Name is required");
        valid = false;
    } else clearError(name);

    // EMAIL
    if (!email.value.trim()) {
        showError(email, "Email is required");
        valid = false;
    } else clearError(email);

    // PROJECT
    if (!project.value) {
        showError(project, "Project type required");
        valid = false;
    } else clearError(project);

    // MESSAGE
    if (!message.value.trim()) {
        showError(message, "Message required");
        valid = false;
    } else clearError(message);

    // CAPTCHA
    if (!captcha.value.trim()) {
        showError(captchaMessage, "CAPTCHA required");
        valid = false;
    } else if (captcha.value !== captchaValue) {
        showError(captchaMessage, "CAPTCHA not matched");
        generateCaptcha();
        valid = false;
    } else clearError(captchaMessage);

    // ❌ STOP IF INVALID
    if (!valid) return;

    // LIMIT
    let count = Number(localStorage.getItem("contact_limit") || 0);
    if (count >= MAX_LIMIT) {
        showToast("Only 2 messages allowed");
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://flixgo.store/telegram-freelancer.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);

            if (response.status === "success") {
                localStorage.setItem("contact_limit", count + 1);
                showToast(response.message);
                document.getElementById("hireForm").reset();
                generateCaptcha();
            } else {
                showToast(response.message);
            }
        } else {
            showToast("Server error. Try again.");
        }
    };

    const data =
        "name=" + encodeURIComponent(name.value) +
        "&email=" + encodeURIComponent(email.value) +
        "&projectType=" + encodeURIComponent(project.value) +
        "&message=" + encodeURIComponent(message.value);

    xhr.send(data);
});

/* INIT */
generateCaptcha();

// Project Modal JS Code
const modal = document.getElementById("projectModal");
const closeBtn = document.getElementById("closeModal");

const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalFeatures = document.getElementById("modalFeatures");
const modalTech = document.getElementById("modalTech");

document.querySelectorAll(".view-project").forEach(button => {
    button.addEventListener("click", () => {

        modalTitle.textContent = button.dataset.title;
        modalDescription.textContent = button.dataset.description;
        modalTech.innerHTML = "";
        button.dataset.tech.split(",").forEach(tech => {
            const span = document.createElement("span");
            span.textContent = tech.trim();
            modalTech.appendChild(span);
        });

        // Clear old features
        modalFeatures.innerHTML = "";

        // Add new features
        const features = button.dataset.features.split(",");
        features.forEach(feature => {
            const li = document.createElement("li");
            li.textContent = feature;
            modalFeatures.appendChild(li);
        });
        modal.style.display = "flex";
    });
});

// Close only from close button
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Disable outside click
modal.addEventListener("click", e => e.stopPropagation());

// Disable ESC key
document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        e.preventDefault();
    }
});