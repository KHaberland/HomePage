/**
 * ===================================
 * МОБИЛЬНОЕ МЕНЮ — Oleg Suvorov IWE
 * ===================================
 */

(function() {
  'use strict';

  // DOM элементы
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const navLinks = document.querySelectorAll('.nav__link');

  // Состояние меню
  let isMenuOpen = false;

  /**
   * Переключение мобильного меню
   */
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    burger.classList.toggle('burger--active', isMenuOpen);
    nav.classList.toggle('nav--open', isMenuOpen);
    
    // Блокировка прокрутки при открытом меню
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    
    // Доступность
    burger.setAttribute('aria-expanded', isMenuOpen);
    nav.setAttribute('aria-hidden', !isMenuOpen);
  }

  /**
   * Закрытие меню
   */
  function closeMenu() {
    if (isMenuOpen) {
      isMenuOpen = false;
      burger.classList.remove('burger--active');
      nav.classList.remove('nav--open');
      document.body.style.overflow = '';
      burger.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Плавная прокрутка к секции
   * @param {string} targetId - ID целевого элемента
   */
  function scrollToSection(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;

    const headerHeight = header.offsetHeight;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  /**
   * Обработка клика по ссылке навигации
   * @param {Event} e - Событие клика
   */
  function handleNavClick(e) {
    const href = e.currentTarget.getAttribute('href');
    
    if (href.startsWith('#')) {
      e.preventDefault();
      closeMenu();
      scrollToSection(href);
    }
  }

  /**
   * Подсветка активного пункта меню при скролле
   */
  function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + header.offsetHeight + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }

  /**
   * Изменение стиля хедера при скролле
   */
  function handleHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  /**
   * Инициализация
   */
  function init() {
    // Обработчик клика по бургеру
    if (burger) {
      burger.addEventListener('click', toggleMenu);
    }

    // Обработчики кликов по ссылкам навигации
    navLinks.forEach(link => {
      link.addEventListener('click', handleNavClick);
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
      if (isMenuOpen && !nav.contains(e.target) && !burger.contains(e.target)) {
        closeMenu();
      }
    });

    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
        burger.focus();
      }
    });

    // Обработчики скролла
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleHeaderScroll();
          highlightActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Начальное состояние хедера
    handleHeaderScroll();

    // Закрытие меню при изменении размера окна
    window.addEventListener('resize', () => {
      if (window.innerWidth > 767 && isMenuOpen) {
        closeMenu();
      }
    });

    console.log('✓ Menu module initialized');
  }

  // Запуск при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

