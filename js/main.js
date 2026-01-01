/**
 * ===================================
 * ОСНОВНАЯ ЛОГИКА — Oleg Suvorov IWE
 * ===================================
 */

(function() {
  'use strict';

  /**
   * Анимации появления элементов при скролле
   */
  const ScrollAnimations = {
    observer: null,
    animatedElements: [],

    init() {
      // Элементы для анимации
      this.animatedElements = document.querySelectorAll(
        '.section__header, .about__inner, .calculator-card, .book__inner, ' +
        '.video-card, .blog-card, .testimonial-card, .contact__inner'
      );

      if (!this.animatedElements.length) return;

      // Настройка Intersection Observer
      const options = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      }, options);

      // Начальное состояние элементов
      this.animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        this.observer.observe(el);
      });

      console.log('✓ Scroll animations initialized');
    },

    animateElement(element) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  };

  /**
   * Карусель отзывов (если нужно)
   */
  const TestimonialsCarousel = {
    container: null,
    cards: [],
    currentIndex: 0,
    autoplayInterval: null,

    init() {
      this.container = document.querySelector('.testimonials__grid');
      if (!this.container) return;

      this.cards = this.container.querySelectorAll('.testimonial-card');
      if (this.cards.length <= 3) return; // Не нужна карусель для малого числа карточек

      // Можно добавить логику карусели, если карточек много
      console.log('✓ Testimonials carousel ready');
    }
  };

  /**
   * Управление видео
   */
  const VideoPlayer = {
    playButtons: [],

    init() {
      this.playButtons = document.querySelectorAll('.video-card__play');
      
      this.playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const card = btn.closest('.video-card');
          const thumbnail = card.querySelector('.video-card__thumbnail img');
          
          // Здесь можно открыть модальное окно с видео
          // или заменить thumbnail на iframe YouTube
          this.openVideoModal(card);
        });
      });

      console.log('✓ Video player initialized');
    },

    openVideoModal(card) {
      // Placeholder для функционала модального окна
      const title = card.querySelector('.video-card__title')?.textContent;
      console.log(`Opening video: ${title}`);
      
      // TODO: Реализовать модальное окно с видео
      alert(`Видео "${title}" будет доступно скоро!`);
    }
  };

  /**
   * Lazy Loading изображений
   */
  const LazyImages = {
    observer: null,

    init() {
      const images = document.querySelectorAll('img[data-src]');
      if (!images.length) return;

      if ('IntersectionObserver' in window) {
        const options = {
          root: null,
          rootMargin: '50px',
          threshold: 0.01
        };

        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target);
              this.observer.unobserve(entry.target);
            }
          });
        }, options);

        images.forEach(img => this.observer.observe(img));
      } else {
        // Fallback для старых браузеров
        images.forEach(img => this.loadImage(img));
      }

      console.log('✓ Lazy loading initialized');
    },

    loadImage(img) {
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
      }
    }
  };

  /**
   * Счётчики статистики с анимацией
   */
  const StatCounters = {
    init() {
      const stats = document.querySelectorAll('.hero__stat-value');
      if (!stats.length) return;

      const options = {
        root: null,
        threshold: 0.5
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateValue(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, options);

      stats.forEach(stat => observer.observe(stat));

      console.log('✓ Stat counters initialized');
    },

    animateValue(element) {
      const text = element.textContent;
      const match = text.match(/(\d+)/);
      
      if (!match) return;
      
      const endValue = parseInt(match[1]);
      const suffix = text.replace(match[1], '');
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(endValue * easeOut);
        
        element.textContent = currentValue + suffix;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = text; // Возврат оригинального текста
        }
      };

      requestAnimationFrame(animate);
    }
  };

  /**
   * Плавное появление страницы
   */
  const PageTransition = {
    init() {
      document.body.classList.add('page-loaded');
      
      // Добавляем CSS для плавного появления
      const style = document.createElement('style');
      style.textContent = `
        body {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        body.page-loaded {
          opacity: 1;
        }
      `;
      document.head.appendChild(style);

      console.log('✓ Page transition initialized');
    }
  };

  /**
   * Обработка ошибок загрузки изображений
   */
  const ImageFallbacks = {
    init() {
      const images = document.querySelectorAll('img');
      
      images.forEach(img => {
        if (img.complete && img.naturalHeight === 0) {
          this.handleError(img);
        }
        
        img.addEventListener('error', () => this.handleError(img));
      });

      console.log('✓ Image fallbacks initialized');
    },

    handleError(img) {
      // Изображение уже имеет onerror в HTML, но это дополнительная защита
      if (!img.dataset.fallbackApplied) {
        img.dataset.fallbackApplied = 'true';
        img.style.backgroundColor = '#e2e8f0';
        img.alt = img.alt || 'Изображение недоступно';
      }
    }
  };

  /**
   * Инициализация всех модулей
   */
  function init() {
    PageTransition.init();
    ScrollAnimations.init();
    TestimonialsCarousel.init();
    VideoPlayer.init();
    LazyImages.init();
    StatCounters.init();
    ImageFallbacks.init();

    console.log('═══════════════════════════════════');
    console.log('  Oleg Suvorov IWE - Site Loaded   ');
    console.log('═══════════════════════════════════');
  }

  // Запуск при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

