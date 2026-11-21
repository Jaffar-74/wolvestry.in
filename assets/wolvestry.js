// WOLVESTRY Theme JavaScript
// Vanilla JS — no jQuery dependency

(function() {
  'use strict';

  // =============================================
  // SCROLL REVEAL
  // =============================================
  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.wv-reveal').forEach(el => observer.observe(el));
  }

  // =============================================
  // CART DRAWER
  // =============================================
  class CartDrawer {
    constructor() {
      this.drawer = document.querySelector('.wv-cart-drawer');
      this.overlay = document.querySelector('.wv-cart-drawer__overlay');
      if (!this.drawer) return;
      
      this.bindEvents();
    }

    bindEvents() {
      // Open cart
      document.querySelectorAll('[data-cart-toggle]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      });

      // Close cart
      document.querySelectorAll('[data-cart-close]').forEach(btn => {
        btn.addEventListener('click', () => this.close());
      });

      if (this.overlay) {
        this.overlay.addEventListener('click', () => this.close());
      }

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });
    }

    open() {
      this.drawer.classList.add('open');
      if (this.overlay) this.overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      this.drawer.setAttribute('aria-hidden', 'false');
    }

    close() {
      this.drawer.classList.remove('open');
      if (this.overlay) this.overlay.classList.remove('open');
      document.body.style.overflow = '';
      this.drawer.setAttribute('aria-hidden', 'true');
    }

    async updateCart() {
      try {
        const response = await fetch('/cart.js');
        const cart = await response.json();
        this.updateCartCount(cart.item_count);
        return cart;
      } catch (err) {
        console.error('Cart update failed:', err);
      }
    }

    updateCartCount(count) {
      document.querySelectorAll('[data-cart-count]').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? '' : 'none';
      });
    }
  }

  // =============================================
  // PRODUCT FORM
  // =============================================
  class ProductForm {
    constructor(form) {
      this.form = form;
      if (!this.form) return;
      
      this.variantSelects = this.form.querySelectorAll('[data-variant-select]');
      this.addButton = this.form.querySelector('[data-add-to-cart]');
      this.priceDisplay = document.querySelector('[data-product-price]');
      this.comparePriceDisplay = document.querySelector('[data-product-compare-price]');
      
      this.bindEvents();
    }

    bindEvents() {
      // Variant pill selection
      this.form.querySelectorAll('.wv-variant-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
          e.preventDefault();
          const group = pill.closest('.wv-variant-group');
          if (!group) return;
          
          group.querySelectorAll('.wv-variant-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          
          // Update hidden select
          const select = group.querySelector('select');
          if (select) {
            select.value = pill.dataset.value;
            select.dispatchEvent(new Event('change'));
          }
        });
      });

      // Add to cart
      this.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.addToCart();
      });
    }

    async addToCart() {
      const formData = new FormData(this.form);
      
      try {
        this.addButton.disabled = true;
        this.addButton.textContent = 'Adding...';
        
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Add to cart failed');
        
        const item = await response.json();
        
        // Update cart count
        const cartResponse = await fetch('/cart.js');
        const cart = await cartResponse.json();
        document.querySelectorAll('[data-cart-count]').forEach(el => {
          el.textContent = cart.item_count;
          el.style.display = cart.item_count > 0 ? '' : 'none';
        });

        // Open cart drawer if available
        const drawer = document.querySelector('.wv-cart-drawer');
        if (drawer) {
          drawer.classList.add('open');
          const overlay = document.querySelector('.wv-cart-drawer__overlay');
          if (overlay) overlay.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
        
        this.addButton.textContent = 'Added!';
        setTimeout(() => {
          this.addButton.disabled = false;
          this.addButton.textContent = 'Add to cart';
        }, 1500);
        
      } catch (err) {
        console.error('Add to cart error:', err);
        this.addButton.disabled = false;
        this.addButton.textContent = 'Add to cart';
      }
    }
  }

  // =============================================
  // COLLAPSIBLE / ACCORDION
  // =============================================
  function initCollapsibles() {
    document.querySelectorAll('.wv-collapsible__trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const content = trigger.nextElementSibling;
        const icon = trigger.querySelector('.wv-collapsible__icon');
        const isOpen = content.classList.contains('open');
        
        content.classList.toggle('open');
        trigger.setAttribute('aria-expanded', !isOpen);
        
        if (icon) {
          icon.textContent = isOpen ? '+' : '−';
        }
      });
    });
  }

  // =============================================
  // QUANTITY SELECTOR
  // =============================================
  function initQuantitySelectors() {
    document.querySelectorAll('.wv-quantity').forEach(qty => {
      const input = qty.querySelector('input');
      const minus = qty.querySelector('[data-qty-minus]');
      const plus = qty.querySelector('[data-qty-plus]');
      
      if (!input) return;
      
      if (minus) {
        minus.addEventListener('click', () => {
          const val = parseInt(input.value) || 1;
          if (val > 1) {
            input.value = val - 1;
            input.dispatchEvent(new Event('change'));
          }
        });
      }
      
      if (plus) {
        plus.addEventListener('click', () => {
          const val = parseInt(input.value) || 1;
          input.value = val + 1;
          input.dispatchEvent(new Event('change'));
        });
      }
    });
  }

  // =============================================
  // MOBILE STICKY ADD TO CART
  // =============================================
  function initStickyAddToCart() {
    const stickyBar = document.querySelector('.wv-sticky-atc');
    if (!stickyBar || window.innerWidth > 768) return;
    
    const addButton = document.querySelector('[data-add-to-cart]');
    if (!addButton) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        stickyBar.classList.toggle('visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    
    observer.observe(addButton);
    
    const stickyBtn = stickyBar.querySelector('button');
    if (stickyBtn) {
      stickyBtn.addEventListener('click', () => addButton.click());
    }
  }

  // =============================================
  // INIT
  // =============================================
  function init() {
    initScrollReveal();
    new CartDrawer();
    initCollapsibles();
    initQuantitySelectors();
    initStickyAddToCart();
    
    // Init product forms
    document.querySelectorAll('[data-product-form]').forEach(form => {
      new ProductForm(form);
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-init for Shopify theme editor
  document.addEventListener('shopify:section:load', init);
})();
