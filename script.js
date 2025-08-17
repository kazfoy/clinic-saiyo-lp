// === GAS Web App Endpoint ===
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzxtMF5dWlmvngH5E9M1Sv9hQUmcO2aAjZk-ys3RYIPCfHyaJ61rGs3O8KWA7hP8BIC/exec';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initFAQ();
    initSmoothScroll();
    initContactForm();
    initScrollEffects();
    initAnimations();
    initMobileMenu();
});

// FAQ Accordion Functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    // 初期化：各 .faq-question に role="button" と aria-expanded="false" を付与
    document.querySelectorAll('.faq-question').forEach(q=>{
        q.setAttribute('role','button');
        q.setAttribute('aria-expanded','false');
    });
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                const btn = faqItem.querySelector('.faq-question');
                if (btn){
                    btn.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
            
            // Toggle current item 後に追記：
            const btn = item.querySelector('.faq-question');
            if (btn){
                btn.setAttribute('aria-expanded', String(!isActive));
            }
        });
    });
}

// Smooth Scroll Functionality
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form Functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (validateForm(data)) {
                // Simulate form submission
                submitForm();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

// Form validation
function validateForm(data) {
    let isValid = true;
    const form = document.getElementById('contactForm');
    
    // Remove previous error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    // Remove error classes
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
    
    // Required fields validation
    const requiredFields = {
        company: '会社名を入力してください',
        name: 'お名前を入力してください',
        email: 'メールアドレスを入力してください'
    };
    
    Object.keys(requiredFields).forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, requiredFields[field]);
            isValid = false;
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        showFieldError('email', '正しいメールアドレスを入力してください');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove existing error
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        const messages = {
            company: '会社名を入力してください',
            name: 'お名前を入力してください',
            email: 'メールアドレスを入力してください'
        };
        showFieldError(fieldName, messages[fieldName] || 'この項目は必須です');
        return false;
    }
    
    // Email validation
    if (fieldName === 'email' && value && !isValidEmail(value)) {
        showFieldError('email', '正しいメールアドレスを入力してください');
        return false;
    }
    
    return true;
}

function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#f44336';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form submission
function submitForm() {
  const form = document.getElementById('contactForm');
  const submitButton = document.querySelector('.form-submit button');
  const originalText = submitButton.textContent;

  submitButton.textContent = '送信中...';
  submitButton.disabled = true;

  // 送信データ
  const fd = new FormData(form);
  fd.append('page', window.location.href);
  const obj = Object.fromEntries(fd.entries());
  const params = new URLSearchParams();
  Object.keys(obj).forEach(k => params.append(k, obj[k]));

  fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: params.toString(),
    mode: 'no-cors' // ← CORSの可視化を捨てて確実に送る
  })
  // no-cors ではレスポンスを読めないため、成功UIは then 側で必ず出す
  .then(() => {
    showSuccessMessage();
    form.reset();
  })
  .catch(() => {
    alert('通信に失敗しました。時間をおいて再度お試しください。');
  })
  .finally(() => {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  });
}

function showSuccessMessage() {
    // Create success overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 3rem;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;
    
    modal.innerHTML = `
        <div style="color: #4caf50; font-size: 4rem; margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="color: #1b5e20; margin-bottom: 1rem;">送信完了</h3>
        <p style="color: #666; margin-bottom: 2rem;">
            お問い合わせありがとうございます。<br>
            営業担当からの連絡をお待ち下さい。
        </p>
        <button onclick="this.closest('.success-overlay').remove()" 
                style="background: #4caf50; color: white; border: none; padding: 0.75rem 2rem; 
                       border-radius: 25px; cursor: pointer; font-weight: 600;">
            閉じる
        </button>
    `;
    
    overlay.className = 'success-overlay';
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Auto close after 3 seconds
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
        }
    }, 3000);
}

// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    const throttledScroll = throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header background on scroll
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    }, 16);
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
}

// Animation on Scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translate3d(0, 0, 0)';
                entry.target.style.willChange = 'auto';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .problem-item,
        .service-item,
        .testimonial-item,
        .pricing-item,
        .faq-item
    `);
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translate3d(0, 30px, 0)';
        el.style.transition = `opacity 0.4s ease ${index * 0.08}s, transform 0.4s ease ${index * 0.08}s`;
        el.style.willChange = 'transform, opacity';
        observer.observe(el);
    });
}

// Statistics Counter Animation
function initStatsAnimation() {
    const statsNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const numbers = text.match(/\d+/g);
                if (numbers && numbers.length > 0) {
                    const finalNumber = parseInt(numbers[0]);
                    if (!isNaN(finalNumber)) {
                        animateNumber(target, 0, finalNumber, 2000);
                    }
                }
                statsObserver.unobserve(target);
            }
        });
    });
    
    statsNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateNumber(element, start, end, duration) {
    const originalText = element.textContent;
    const suffix = element.querySelector('span') ? element.querySelector('span').textContent : '';
    const prefix = originalText.replace(/\d+/g, '').replace(suffix, '');
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        
        requestAnimationFrame(() => {
            element.innerHTML = prefix + Math.floor(current) + (suffix ? `<span>${suffix}</span>` : '');
        });
    }, 16);
}

// Mobile Menu Toggle (if needed)
function initMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuButton && nav) {
        mobileMenuButton.addEventListener('click', function() {
            nav.classList.toggle('is-open');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-open');
                mobileMenuButton.classList.remove('active');
            });
        });
    }
}

// Utility function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility function to throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}


// Initialize stats animation after DOM is loaded - DISABLED (replaced by new counter animation)
// document.addEventListener('DOMContentLoaded', function() {
//     setTimeout(initStatsAnimation, 500);
// });

// Add some CSS for error states dynamically
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #f44336;
        background-color: #fff5f5;
    }
    
    .error-message {
        animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .success-overlay {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// ===== ヒーロー実績カウントアップアニメーション =====
(function(){
  function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

  function countUp(el){
    const to = parseFloat(el.getAttribute('data-count-to') || '0');
    const from = parseFloat(el.getAttribute('data-count-from') || '0');
    const duration = parseInt(el.getAttribute('data-duration') || '1200', 10);
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce){ el.textContent = to.toFixed(decimals); return; }

    let start = null;
    const step = (ts)=>{
      if(!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const val = from + (to - from) * easeOutCubic(p);
      el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val).toString());
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = (decimals ? to.toFixed(decimals) : Math.round(to).toString());
    };
    // 視覚的な開始演出
    el.closest('.hero__metric')?.classList.add('counting');
    el.textContent = from.toFixed(decimals);
    requestAnimationFrame(step);
  }

  function initCounters(){
    const cards = document.querySelectorAll('.hero__metric');
    if (!cards.length) return;

    const obs = new IntersectionObserver((entries,observer)=>{
      entries.forEach(entry=>{
        const card = entry.target;
        if (entry.isIntersecting && !card.classList.contains('is-counted')){
          card.classList.add('is-visible');
          const target = card.querySelector('.em[data-count-to]');
          if (target){ countUp(target); }
          card.classList.add('is-counted');
          observer.unobserve(card);
        }
      });
    },{ threshold: 0.4 });

    cards.forEach(c=>obs.observe(c));
  }

  document.addEventListener('DOMContentLoaded', initCounters);
})();