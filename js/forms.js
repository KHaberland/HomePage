/**
 * ===================================
 * ОБРАБОТКА ФОРМ — Oleg Suvorov IWE
 * ===================================
 */

(function() {
  'use strict';

  /**
   * Конфигурация
   */
  const CONFIG = {
    // Endpoint для отправки форм (замените на реальный)
    contactFormEndpoint: '/api/contact',
    newsletterEndpoint: '/api/newsletter',
    
    // Сообщения
    messages: {
      success: 'Спасибо! Ваше сообщение отправлено.',
      error: 'Произошла ошибка. Попробуйте позже.',
      validationError: 'Пожалуйста, заполните все обязательные поля.',
      emailError: 'Пожалуйста, введите корректный email.',
      sending: 'Отправка...',
      subscribed: 'Вы успешно подписались на рассылку!'
    }
  };

  /**
   * Валидация email
   * @param {string} email 
   * @returns {boolean}
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Показать сообщение пользователю
   * @param {HTMLElement} form 
   * @param {string} message 
   * @param {string} type - 'success' | 'error'
   */
  function showMessage(form, message, type = 'success') {
    // Удаляем предыдущее сообщение
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Создаём новое сообщение
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message--${type}`;
    messageEl.textContent = message;
    
    // Стили сообщения
    messageEl.style.cssText = `
      padding: 1rem;
      margin-top: 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      text-align: center;
      animation: fadeIn 0.3s ease;
      ${type === 'success' 
        ? 'background: rgba(56, 161, 105, 0.2); color: #38a169;' 
        : 'background: rgba(229, 62, 62, 0.2); color: #e53e3e;'
      }
    `;

    form.appendChild(messageEl);

    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
      messageEl.style.opacity = '0';
      messageEl.style.transition = 'opacity 0.3s ease';
      setTimeout(() => messageEl.remove(), 300);
    }, 5000);
  }

  /**
   * Установка состояния загрузки кнопки
   * @param {HTMLButtonElement} button 
   * @param {boolean} isLoading 
   */
  function setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.dataset.originalText = button.textContent;
      button.textContent = CONFIG.messages.sending;
      button.disabled = true;
      button.style.opacity = '0.7';
    } else {
      button.textContent = button.dataset.originalText || 'Отправить';
      button.disabled = false;
      button.style.opacity = '1';
    }
  }

  /**
   * Симуляция отправки формы (заменить на реальный API)
   * @param {string} endpoint 
   * @param {Object} data 
   * @returns {Promise}
   */
  async function sendForm(endpoint, data) {
    // Симуляция задержки сети
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // В реальном проекте здесь будет fetch запрос:
        // return fetch(endpoint, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });
        
        // Симуляция успешного ответа
        console.log('Form data:', data);
        resolve({ success: true });
      }, 1000);
    });
  }

  /**
   * Обработчик формы обратной связи
   */
  const ContactForm = {
    form: null,

    init() {
      this.form = document.getElementById('contact-form');
      if (!this.form) return;

      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Валидация в реальном времени
      const inputs = this.form.querySelectorAll('.form__input, .form__textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearError(input));
      });

      console.log('✓ Contact form initialized');
    },

    validateField(field) {
      const value = field.value.trim();
      
      if (field.required && !value) {
        this.setFieldError(field, 'Это поле обязательно');
        return false;
      }
      
      if (field.type === 'email' && value && !isValidEmail(value)) {
        this.setFieldError(field, 'Некорректный email');
        return false;
      }

      this.clearError(field);
      return true;
    },

    setFieldError(field, message) {
      field.style.borderColor = '#e53e3e';
      
      let errorEl = field.parentNode.querySelector('.field-error');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.style.cssText = 'color: #e53e3e; font-size: 0.75rem; margin-top: 0.25rem; display: block;';
        field.parentNode.appendChild(errorEl);
      }
      errorEl.textContent = message;
    },

    clearError(field) {
      field.style.borderColor = '';
      const errorEl = field.parentNode.querySelector('.field-error');
      if (errorEl) {
        errorEl.remove();
      }
    },

    async handleSubmit(e) {
      e.preventDefault();

      const button = this.form.querySelector('button[type="submit"]');
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());

      // Валидация
      let isValid = true;
      const requiredFields = this.form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });

      if (!isValid) {
        showMessage(this.form, CONFIG.messages.validationError, 'error');
        return;
      }

      // Отправка
      setButtonLoading(button, true);

      try {
        await sendForm(CONFIG.contactFormEndpoint, data);
        showMessage(this.form, CONFIG.messages.success, 'success');
        this.form.reset();
      } catch (error) {
        console.error('Form submission error:', error);
        showMessage(this.form, CONFIG.messages.error, 'error');
      } finally {
        setButtonLoading(button, false);
      }
    }
  };

  /**
   * Обработчик формы подписки на рассылку
   */
  const NewsletterForm = {
    form: null,

    init() {
      this.form = document.getElementById('newsletter-form');
      if (!this.form) return;

      this.form.addEventListener('submit', (e) => this.handleSubmit(e));

      console.log('✓ Newsletter form initialized');
    },

    async handleSubmit(e) {
      e.preventDefault();

      const button = this.form.querySelector('button[type="submit"]');
      const emailInput = this.form.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      // Валидация
      if (!email) {
        showMessage(this.form, CONFIG.messages.validationError, 'error');
        emailInput.focus();
        return;
      }

      if (!isValidEmail(email)) {
        showMessage(this.form, CONFIG.messages.emailError, 'error');
        emailInput.focus();
        return;
      }

      // Отправка
      setButtonLoading(button, true);

      try {
        await sendForm(CONFIG.newsletterEndpoint, { email });
        showMessage(this.form, CONFIG.messages.subscribed, 'success');
        this.form.reset();
      } catch (error) {
        console.error('Newsletter subscription error:', error);
        showMessage(this.form, CONFIG.messages.error, 'error');
      } finally {
        setButtonLoading(button, false);
      }
    }
  };

  /**
   * Добавление стилей для анимации сообщений
   */
  function addFormStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .form__input:focus,
      .form__textarea:focus,
      .blog__newsletter-input:focus {
        outline: none;
        border-color: var(--color-secondary, #f6ad55) !important;
      }
      
      .form-message {
        animation: fadeIn 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Инициализация
   */
  function init() {
    addFormStyles();
    ContactForm.init();
    NewsletterForm.init();

    console.log('✓ Forms module initialized');
  }

  // Запуск при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

