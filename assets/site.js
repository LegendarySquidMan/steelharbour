'use strict';

document.documentElement.classList.add('js');

const menuButton = document.querySelector('.nav-toggle');
const navigation = document.querySelector('.primary-nav');
const serviceMenu = document.querySelector('.services-nav details');
const wideScreen = window.matchMedia('(min-width: 901px)');

function closeNavigation() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (serviceMenu.open) {
    serviceMenu.open = false;
    serviceMenu.querySelector('summary').focus();
  } else if (navigation.classList.contains('is-open')) {
    closeNavigation();
    menuButton.focus();
  }
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.services-nav')) serviceMenu.open = false;
  if (!event.target.closest('.site-header')) closeNavigation();
});

serviceMenu.addEventListener('focusout', () => {
  // Wait for focus to reach its next element before deciding to close the list.
  window.setTimeout(() => {
    if (!document.activeElement.closest('.services-nav')) serviceMenu.open = false;
  }, 0);
});

const serviceNavigation = document.querySelector('.services-nav');
serviceNavigation.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'mouse' && wideScreen.matches) serviceMenu.open = true;
});
serviceNavigation.addEventListener('pointerleave', (event) => {
  if (event.pointerType === 'mouse' && !serviceNavigation.contains(document.activeElement)) serviceMenu.open = false;
});
wideScreen.addEventListener('change', () => {
  closeNavigation();
  serviceMenu.open = false;
});

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.querySelector('button[type="submit"]').disabled = false;
  const status = document.querySelector('#form-status');
  const emailLink = document.querySelector('#message-email');

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const data = new FormData(contactForm);
    const message = [
      'SteelHarbour Construction — project enquiry',
      '',
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Phone: ${data.get('phone') || 'Not provided'}`,
      `Company: ${data.get('company') || 'Not provided'}`,
      `Service: ${data.get('service') || 'General enquiry'}`,
      '',
      String(data.get('message'))
    ].join('\n');

    const subject = 'SteelHarbour Construction — project enquiry';
    const emailUrl = `mailto:info@steelharbour.ca?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    emailLink.href = emailUrl;
    status.hidden = false;
    status.focus();
    window.location.href = emailUrl;
  });

  // Hide the prepared email link when the enquiry changes.
  contactForm.addEventListener('input', () => {
    status.hidden = true;
    emailLink.removeAttribute('href');
  });
}
