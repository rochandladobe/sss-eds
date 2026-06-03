// header.js — build full header HTML
import { getMetadata } from '../../scripts/aem.js';

function buildUSABanner() {
  return `<div class="usa-banner">
    <div class="usa-banner__header">
      <div class="usa-banner__inner">
        <img class="usa-banner__header-flag" src="/icons/us-flag.svg" alt="U.S. flag" width="16" height="11">
        <p class="usa-banner__header-text">An official website of the United States government</p>
        <button class="usa-banner__button" aria-expanded="false" aria-controls="usa-banner-content">
          <span class="usa-banner__button-text">Here's how you know</span>
          <svg class="usa-banner__button-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
    <div class="usa-banner__content" id="usa-banner-content" hidden>
      <div class="usa-banner__content-inner">
        <div class="usa-banner__guidance">
          <svg class="usa-banner__icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#005ea2" stroke="#005ea2"/><rect x="12" y="10" width="16" height="12" rx="1" fill="white"/><path d="M12 22l8 6 8-6" fill="white"/></svg>
          <div>
            <p><strong>Official websites use .gov</strong></p>
            <p>A <strong>.gov</strong> website belongs to an official government organization in the United States.</p>
          </div>
        </div>
        <div class="usa-banner__guidance">
          <svg class="usa-banner__icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#2e8540" stroke="#2e8540"/><rect x="14" y="16" width="12" height="12" rx="1" fill="white"/><path d="M16 16v-4a4 4 0 0 1 8 0v4" fill="none" stroke="white" stroke-width="2"/></svg>
          <div>
            <p><strong>Secure .gov websites use HTTPS</strong></p>
            <p>A <strong>lock</strong> or <strong>https://</strong> means you've safely connected to the .gov website. Share sensitive information only on official, secure websites.</p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function buildMobileMenuButton() {
  return `<button class="header__menu-btn" aria-expanded="false" aria-controls="header-nav-list" aria-label="Open navigation menu">
    <span class="header__menu-icon">
      <span></span><span></span><span></span>
    </span>
  </button>`;
}

export default async function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'header__wrapper';

  wrapper.innerHTML = `
    ${buildUSABanner()}
    <div class="header__main">
      <div class="header__logo">
        <a href="/" aria-label="Selective Service System Home">
          <img src="/icons/sss-seal.svg" alt="Selective Service System seal" width="64" height="64">
          <span class="header__logo-text">SELECTIVE<br>SERVICE SYSTEM</span>
        </a>
      </div>
      <div class="header__actions">
        <button class="header__search-btn" aria-label="Open search" aria-expanded="false">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
        <a href="https://www.sss.gov/register/" class="header__btn header__btn--primary">Register</a>
        <a href="https://www.sss.gov/verify/" class="header__btn header__btn--outline">Verify Registration</a>
        ${buildMobileMenuButton()}
      </div>
    </div>
    <div class="header__search-bar" id="header-search-bar" hidden>
      <form class="header__search-form" role="search" action="/search/" method="get">
        <label for="header-search-input" class="usa-sr-only">Search</label>
        <input id="header-search-input" class="header__search-input" type="search" name="q" placeholder="Search sss.gov..." autocomplete="off">
        <button class="header__search-submit" type="submit" aria-label="Submit search">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
      </form>
    </div>
    <nav class="header__nav" aria-label="Primary navigation">
      <ul class="nav__list" id="header-nav-list">
        <li class="nav__item nav__item--dropdown">
          <button class="nav__btn" aria-expanded="false" aria-haspopup="true">
            Registration
            <svg class="nav__caret" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
          </button>
          <ul class="nav__dropdown" role="menu">
            <li role="none"><a href="/register/" role="menuitem">Register Now</a></li>
            <li role="none"><a href="/register/who-needs-to-register/" role="menuitem">Who Needs to Register</a></li>
            <li role="none"><a href="/verify/" role="menuitem">Verify Status</a></li>
            <li role="none"><a href="/verify/update-info/" role="menuitem">Update Your Information</a></li>
            <li role="none"><a href="/register/benefits-and-penalties/" role="menuitem">Benefits &amp; Penalties</a></li>
          </ul>
        </li>
        <li class="nav__item"><a href="/faq/">Frequently Asked Questions</a></li>
        <li class="nav__item"><a href="/news/">News &amp; Media</a></li>
        <li class="nav__item"><a href="/reports/">Reports &amp; Publications</a></li>
        <li class="nav__item nav__item--dropdown">
          <button class="nav__btn" aria-expanded="false" aria-haspopup="true">
            About
            <svg class="nav__caret" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
          </button>
          <ul class="nav__dropdown" role="menu">
            <li role="none"><a href="/about/" role="menuitem">About Selective Service</a></li>
            <li role="none"><a href="/history-and-records/" role="menuitem">Records</a></li>
            <li role="none"><a href="/contact/" role="menuitem">Contact Us</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  `;

  block.textContent = '';
  block.appendChild(wrapper);

  // --- USA Banner toggle ---
  const bannerBtn = wrapper.querySelector('.usa-banner__button');
  const bannerContent = wrapper.querySelector('.usa-banner__content');
  bannerBtn?.addEventListener('click', () => {
    const expanded = bannerBtn.getAttribute('aria-expanded') === 'true';
    bannerBtn.setAttribute('aria-expanded', String(!expanded));
    bannerContent.hidden = expanded;
  });

  // --- Search toggle ---
  const searchBtn = wrapper.querySelector('.header__search-btn');
  const searchBar = wrapper.querySelector('.header__search-bar');
  const searchInput = wrapper.querySelector('.header__search-input');
  searchBtn?.addEventListener('click', () => {
    const expanded = searchBtn.getAttribute('aria-expanded') === 'true';
    searchBtn.setAttribute('aria-expanded', String(!expanded));
    searchBar.hidden = expanded;
    if (!expanded) {
      searchInput?.focus();
    }
  });

  // --- Dropdown toggles ---
  wrapper.querySelectorAll('.nav__btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // Close all other dropdowns
      wrapper.querySelectorAll('.nav__btn').forEach((b) => {
        if (b !== btn) {
          b.setAttribute('aria-expanded', 'false');
          b.nextElementSibling?.classList.remove('open');
        }
      });
      btn.setAttribute('aria-expanded', String(!expanded));
      btn.nextElementSibling?.classList.toggle('open', !expanded);
    });
  });

  // --- Close dropdowns on outside click ---
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      wrapper.querySelectorAll('.nav__btn').forEach((b) => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling?.classList.remove('open');
      });
      // Close search bar
      if (searchBar) {
        searchBar.hidden = true;
        searchBtn?.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // --- Close dropdowns on Escape ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      wrapper.querySelectorAll('.nav__btn').forEach((b) => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling?.classList.remove('open');
      });
      if (searchBar) {
        searchBar.hidden = true;
        searchBtn?.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // --- Mobile menu toggle ---
  const menuBtn = wrapper.querySelector('.header__menu-btn');
  const navList = wrapper.querySelector('#header-nav-list');
  menuBtn?.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    navList?.classList.toggle('open', !expanded);
    wrapper.querySelector('.header__nav')?.classList.toggle('open', !expanded);
  });

  // --- Keyboard navigation for dropdowns ---
  wrapper.querySelectorAll('.nav__dropdown').forEach((dropdown) => {
    const items = dropdown.querySelectorAll('[role="menuitem"]');
    items.forEach((item, index) => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          items[(index + 1) % items.length]?.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          items[(index - 1 + items.length) % items.length]?.focus();
        } else if (e.key === 'Tab' && index === items.length - 1) {
          // Close dropdown when tabbing past last item
          const btn = dropdown.previousElementSibling;
          btn?.setAttribute('aria-expanded', 'false');
          dropdown.classList.remove('open');
        }
      });
    });
  });
}
