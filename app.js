/**
 * Skyline Integrated Services LTD - Client-Side App Script
 * Author: Antigravity Code Assistant
 * Date: June 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initMobileMenu();
  initHeaderScroll();
  initCanvasBackground();
  initCalculator();
  initTestimonialSlider();
  initContactForm();
  initScrollSpy();
});

/* ==========================================================================
   Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('active');
      
      // Toggle menu icon
      const icon = menuToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }
}

/* ==========================================================================
   Header Scroll Styling
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    });
    // Check state on load
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    }
  }
}

/* ==========================================================================
   Interactive Hero Canvas Background (Particle Network)
   ========================================================================== */
function initCanvasBackground() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;
  
  // Particle definition
  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 15000));
  const connectionDistance = 120;
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2.5 + 1;
      this.alpha = Math.random() * 0.5 + 0.3;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce off walls
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(197, 168, 128, ${this.alpha})`; // Premium Gold
      ctx.fill();
    }
  }
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        
        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.12;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Handle resize
  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });
}

/* ==========================================================================
   Scroll Spy (Active Nav Link)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Interactive Pricing Cost Calculator
   ========================================================================== */
let calcState = {
  service: 'residential',
  size: 2,
  frequency: 'one-time'
};

// Base cost configuration
const calcConfig = {
  services: {
    residential: {
      name: 'Residential Cleaning',
      base: 30, // cost per unit/room
      unitName: 'Bedrooms',
      stepText: (val) => `approx. ${val} Bedroom${val > 1 ? 's' : ''} / ${val * 400} sq ft`
    },
    commercial: {
      name: 'Commercial Cleaning',
      base: 45,
      unitName: 'Workspaces',
      stepText: (val) => `approx. ${val} Office Area${val > 1 ? 's' : ''} / ${val * 600} sq ft`
    },
    deep: {
      name: 'Deep Cleaning',
      base: 55,
      unitName: 'Rooms',
      stepText: (val) => `Intensive clean of ${val} Room${val > 1 ? 's' : ''} / spaces`
    },
    maintenance: {
      name: 'Regular Maintenance',
      base: 25,
      unitName: 'Clean Units',
      stepText: (val) => `Scheduled maintenance for ${val} Unit${val > 1 ? 's' : ''}`
    }
  },
  frequencies: {
    'one-time': { name: 'One-Time', factor: 1.0, label: 'total cost' },
    'weekly': { name: 'Weekly', factor: 0.80, label: 'per visit' }, // 20% off
    'bi-weekly': { name: 'Bi-Weekly', factor: 0.85, label: 'per visit' }, // 15% off
    'monthly': { name: 'Monthly', factor: 0.90, label: 'per visit' }   // 10% off
  }
};

function initCalculator() {
  updateCalcValues();
}

function selectCalcService(serviceKey) {
  calcState.service = serviceKey;
  
  // Update UI active buttons
  document.querySelectorAll('.service-option-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-service') === serviceKey) {
      btn.classList.add('active');
    }
  });
  
  // Adjust slider constraints or values if needed
  const serviceInfo = calcConfig.services[serviceKey];
  const slider = document.getElementById('size-slider');
  const sizeLabel = document.getElementById('size-label');
  
  if (sizeLabel && slider) {
    sizeLabel.textContent = `2. Size of Space (${serviceInfo.stepText(slider.value)})`;
  }
  
  updateCalcValues();
}

function selectCalcFreq(freqKey) {
  calcState.frequency = freqKey;
  
  // Update UI active buttons
  document.querySelectorAll('.freq-option-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-freq') === freqKey) {
      btn.classList.add('active');
    }
  });
  
  updateCalcValues();
}

function updateCalcValues() {
  const slider = document.getElementById('size-slider');
  if (!slider) return;
  
  calcState.size = parseInt(slider.value);
  
  const serviceInfo = calcConfig.services[calcState.service];
  const freqInfo = calcConfig.frequencies[calcState.frequency];
  
  // Update slider label
  const sizeLabel = document.getElementById('size-label');
  if (sizeLabel) {
    sizeLabel.textContent = `2. Size of Space (${serviceInfo.stepText(calcState.size)})`;
  }
  
  const sizeDisplay = document.getElementById('size-display');
  if (sizeDisplay) {
    sizeDisplay.textContent = `${calcState.size} ${serviceInfo.unitName}`;
  }
  
  // Calculate price
  let baseCost = serviceInfo.base * calcState.size;
  let finalCost = Math.round(baseCost * freqInfo.factor);
  
  // Animate pricing change
  animatePrice(finalCost);
  
  // Update summary details
  document.getElementById('summary-service').textContent = serviceInfo.name;
  document.getElementById('summary-size').textContent = `${calcState.size} ${serviceInfo.unitName}`;
  document.getElementById('summary-frequency').textContent = freqInfo.name;
  document.getElementById('price-freq-label').textContent = freqInfo.label;
}

// Animate pricing changes smoothly
let currentPriceVal = 0;
function animatePrice(targetVal) {
  const priceDisplay = document.getElementById('price-val');
  if (!priceDisplay) return;
  
  const start = currentPriceVal;
  const end = targetVal;
  const duration = 250; // ms
  const startTime = performance.now();
  
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out quad
    const easeProgress = progress * (2 - progress);
    const val = Math.round(start + (end - start) * easeProgress);
    
    priceDisplay.textContent = `£${val}`;
    currentPriceVal = val;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      priceDisplay.textContent = `£${end}`;
      currentPriceVal = end;
    }
  }
  
  requestAnimationFrame(update);
}

// Transfer calculator parameters to the Booking Form
function applyEstimateToForm() {
  const serviceSelect = document.getElementById('form-service');
  const sizeInput = document.getElementById('form-size');
  const freqSelect = document.getElementById('form-frequency');
  
  if (serviceSelect) {
    serviceSelect.value = calcState.service;
    // Trigger change event to activate label float
    serviceSelect.dispatchEvent(new Event('change'));
  }
  
  if (sizeInput) {
    const serviceInfo = calcConfig.services[calcState.service];
    sizeInput.value = `${calcState.size} ${serviceInfo.unitName}`;
    sizeInput.dispatchEvent(new Event('input'));
  }
  
  if (freqSelect) {
    freqSelect.value = calcState.frequency;
    freqSelect.dispatchEvent(new Event('change'));
  }
  
  // Scroll to contact form smoothly
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    showToast('Estimate Applied!', 'Your calculator settings have been loaded into the booking form.', 'success');
  }
}

// Global mappings for service click events
window.selectCalcService = selectCalcService;
window.selectCalcFreq = selectCalcFreq;
window.updateCalcValues = updateCalcValues;
window.applyEstimateToForm = applyEstimateToForm;


/* ==========================================================================
   Service Detail Overlays (Modal Window)
   ========================================================================== */
const serviceModalData = {
  commercial: {
    title: 'Commercial Cleaning Services',
    icon: 'fa-solid fa-building',
    content: `
      <p>We deliver professional commercial cleaning solutions custom-tailored to support business operations of all scopes, ensuring a hygienic workspace for personnel and guests.</p>
      <strong>What is included:</strong>
      <ul>
        <li>Desk, monitor, and phone disinfection</li>
        <li>Communal office area vacuuming & hard floor sanitization</li>
        <li>Breakroom, kitchen, and cafeteria deep clean</li>
        <li>Office restroom washing, disinfecting, and restocking</li>
        <li>Emptying trash and recycling bins</li>
        <li>Window sills, high-dusting, and detail vacuuming</li>
      </ul>
      <p style="margin-top:1rem;">All cleanings are scheduled after-hours or at off-peak times to guarantee zero interruption to daily workflows.</p>
    `
  },
  residential: {
    title: 'Residential House Cleaning',
    icon: 'fa-solid fa-house-chimney',
    content: `
      <p>Our standard residential cleaning services are crafted to keep your home spotless, sanitary, and organized, letting you enjoy your free time.</p>
      <strong>What is included:</strong>
      <ul>
        <li>Dusting of all surfaces, ornaments, and electronics</li>
        <li>Vacuuming carpets, rugs, and mopping hard floor surfaces</li>
        <li>Kitchen counters, sinks, appliance exteriors cleaned</li>
        <li>Bathrooms: tub, shower, toilet, and mirrors scrubbed</li>
        <li>Making beds (linen changing on request)</li>
        <li>Emptying general waste bins</li>
      </ul>
      <p style="margin-top:1rem;">We offer flexible schedules tailored to your lifestyle: choose from weekly, bi-weekly, or monthly plans.</p>
    `
  },
  deep: {
    title: 'Detailed Deep Cleaning',
    icon: 'fa-solid fa-wand-magic-sparkles',
    content: `
      <p>Our Deep Cleaning service is a thorough top-to-bottom scrub designed for properties that haven't been cleaned in a while, or before/after move-ins.</p>
      <strong>What is included:</strong>
      <ul>
        <li>Everything in standard residential cleaning</li>
        <li>Wiping down baseboards, doors, and doorframes</li>
        <li>Cleaning inside microwave, oven, and fridge</li>
        <li>Scrubbing bathroom tile grout</li>
        <li>Detailed dusting of blinds, vents, and light fixtures</li>
        <li>Behind and under furniture cleaning</li>
      </ul>
      <p style="margin-top:1rem;">Recommended at least twice a year to maintain optimal hygiene and indoor air quality.</p>
    `
  },
  maintenance: {
    title: 'Regular Maintenance Packages',
    icon: 'fa-solid fa-calendar-days',
    content: `
      <p>For individuals and companies looking for a highly consistent and cost-effective schedule, our maintenance plans provide priority bookings and discounts.</p>
      <strong>What is included:</strong>
      <ul>
        <li>Customized cleaning checklist based on your priorities</li>
        <li>Vetted, dedicated cleaner assigned to your account</li>
        <li>Flexible scheduling with priority rescheduling options</li>
        <li>No long-term contracts: suspend or adjust frequency anytime</li>
        <li>Regular inspections by quality assurance managers</li>
      </ul>
      <p style="margin-top:1rem;">Ideal for busy families, shared apartments, commercial hubs, and retail outlets.</p>
    `
  }
};

let currentModalService = '';

function openServiceModal(serviceKey) {
  const modal = document.getElementById('service-modal');
  const iconContainer = document.getElementById('modal-icon-container');
  const titleText = document.getElementById('modal-title-text');
  const bodyText = document.getElementById('modal-body-text');
  
  if (!modal || !serviceModalData[serviceKey]) return;
  
  currentModalService = serviceKey;
  
  const data = serviceModalData[serviceKey];
  iconContainer.innerHTML = `<i class="${data.icon}"></i>`;
  titleText.textContent = data.title;
  bodyText.innerHTML = data.content;
  
  // Show Modal
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Accessibility Focus Trap setup
  modal.focus();
}

function closeServiceModal() {
  const modal = document.getElementById('service-modal');
  if (!modal) return;
  
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

function bookFromModal() {
  closeServiceModal();
  if (!currentModalService) return;
  
  const serviceSelect = document.getElementById('form-service');
  if (serviceSelect) {
    serviceSelect.value = currentModalService;
    serviceSelect.dispatchEvent(new Event('change'));
  }
  
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Global modal triggers mapping
window.openServiceModal = openServiceModal;
window.closeServiceModal = closeServiceModal;
window.bookFromModal = bookFromModal;


/* ==========================================================================
   Interactive Testimonials Slider
   ========================================================================== */
function initTestimonialSlider() {
  const slider = document.getElementById('testimonial-wrapper');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const dotsContainer = document.getElementById('slider-dots');
  
  if (!slider || slides.length === 0) return;
  
  let currentIdx = 0;
  let autoplayTimer = null;
  const slideCount = slides.length;
  
  // Create navigation dots
  dotsContainer.innerHTML = '';
  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  }
  
  const dots = document.querySelectorAll('.slider-dot');
  
  function goToSlide(idx) {
    currentIdx = idx;
    slider.style.transform = `translateX(-${currentIdx * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIdx);
    });
  }
  
  function nextSlide() {
    let nextIdx = (currentIdx + 1) % slideCount;
    goToSlide(nextIdx);
  }
  
  function prevSlide() {
    let prevIdx = (currentIdx - 1 + slideCount) % slideCount;
    goToSlide(prevIdx);
  }
  
  // Button Event Listeners
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  
  // Autoplay functionality
  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 5000);
  }
  
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }
  
  // Start slide timer
  startAutoplay();
  
  // Pause on hover
  slider.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  slider.addEventListener('mouseleave', startAutoplay);
}


/* ==========================================================================
   Booking & Contact Form Validation & Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;
  
  const inputs = form.querySelectorAll('.form-control');
  
  // Track float labels correctly when pre-filled via javascript
  inputs.forEach(input => {
    // Check on input/change
    const updateLabel = () => {
      if (input.value !== '') {
        input.classList.add('not-empty');
      } else {
        input.classList.remove('not-empty');
      }
    };
    
    input.addEventListener('input', updateLabel);
    input.addEventListener('change', updateLabel);
    
    // Initial trigger
    updateLabel();
  });
  
  // Submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit');
    
    // Form variables
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const service = document.getElementById('form-service').value;
    const size = document.getElementById('form-size').value.trim();
    const frequency = document.getElementById('form-frequency').value;
    const message = document.getElementById('form-message').value.trim();
    
    // Reset feedback
    feedback.className = 'form-feedback';
    feedback.innerHTML = '';
    feedback.style.display = 'none';
    
    // Simple Validation
    if (!name || !email || !phone || !service) {
      feedback.classList.add('error');
      feedback.textContent = 'Please fill in all required fields (Name, Email, Phone, and Service).';
      feedback.style.display = 'block';
      return;
    }
    
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedback.classList.add('error');
      feedback.textContent = 'Please enter a valid email address.';
      feedback.style.display = 'block';
      return;
    }
    
    // Loading State UI
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing booking request...';
    
    // Simulate API delay
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Booking Request';
      
      // Success State
      feedback.classList.add('success');
      feedback.innerHTML = `<strong>Success!</strong> Thank you, ${name}. Your booking request for ${service} cleaning has been received. Our Manchester team will contact you at ${phone} or ${email} within 2 hours.`;
      feedback.style.display = 'block';
      
      // Show beautiful custom Toast notification
      showToast('Booking Request Received!', `We've sent a summary to ${email}.`, 'success');
      
      // Clear form inputs
      form.reset();
      inputs.forEach(input => input.classList.remove('not-empty'));
      
    }, 1500);
  });
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(title, message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
  
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fa-solid ${icon}"></i>
    </div>
    <div class="toast-content">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
  `;
  
  container.appendChild(toast);
  
  // Animate entry
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Auto remove after 4.5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    // Remove from DOM after transition finishes
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4500);
}
