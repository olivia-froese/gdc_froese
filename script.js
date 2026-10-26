const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');
const firstNavigationLink = navigation?.querySelector('a');

const closeNavigation = ({ returnFocus = false } = {}) => {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = 'Menu';
  navigation.classList.remove('is-open');
  if (returnFocus) menuToggle.focus();
};

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.textContent = isOpen ? 'Menu' : 'Close';
  navigation?.classList.toggle('is-open', !isOpen);
  if (!isOpen) firstNavigationLink?.focus();
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    closeNavigation();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
    closeNavigation({ returnFocus: true });
  }
});

document.addEventListener('click', (event) => {
  if (
    menuToggle?.getAttribute('aria-expanded') === 'true' &&
    navigation &&
    !navigation.contains(event.target) &&
    event.target !== menuToggle
  ) {
    closeNavigation();
  }
});

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.site-navigation a')];

const setActiveNavigation = (sectionId) => {
  navLinks.forEach((link) => {
    if (link.getAttribute('href') === `#${sectionId}`) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

if ('IntersectionObserver' in window && sections.length > 0) {
  const visibleSections = new Map();
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        visibleSections.set(entry.target, entry.intersectionRatio);
      } else {
        visibleSections.delete(entry.target);
      }
    });

    const activeSection = [...visibleSections.entries()]
      .sort(([, firstRatio], [, secondRatio]) => secondRatio - firstRatio)[0];
    if (activeSection) setActiveNavigation(activeSection[0].id);
  }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .25, .5, .75, 1] });

  sections.forEach((section) => sectionObserver.observe(section));
}