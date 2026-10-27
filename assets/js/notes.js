/* UI enhancements for the static Hugo blog. Cat sources: THIRD_PARTY_NOTICES.md. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 760px)');
  const safeGet = (store, key) => { try { return window[store].getItem(key); } catch { return null; } };
  const safeSet = (store, key, value) => { try { window[store].setItem(key, value); } catch { /* Storage is optional. */ } };

  document.querySelectorAll('[data-reveal]').forEach((el, i) => el.style.setProperty('--reveal-order', Math.min(i, 5)));
  if (!reducedMotion.matches) document.documentElement.classList.add('notes-motion');
  reducedMotion.addEventListener('change', () => document.documentElement.classList.toggle('notes-motion', !reducedMotion.matches));

  const sidebar = document.querySelector('#notes-sidebar');
  const navigation = document.querySelector('[data-navigation-content]');
  const navDialog = document.querySelector('#notes-navigation');
  const tocDialog = document.querySelector('#notes-mobile-toc');
  let dialogOpener = null;
  const openDialog = (dialog, opener) => {
    if (!dialog || dialog.open) return;
    dialogOpener = opener;
    dialog.showModal();
    dialog.querySelector('[data-dialog-close]')?.focus();
  };
  const moveNavigation = () => {
    if (!navigation || !sidebar || !navDialog) return;
    if (!mobile.matches && navDialog.open) navDialog.close();
    const parent = mobile.matches ? navDialog.querySelector('[data-navigation-slot]') : sidebar;
    if (navigation.parentElement !== parent) parent.append(navigation);
  };
  moveNavigation();
  mobile.addEventListener('change', moveNavigation);
  document.querySelectorAll('[data-nav-open]').forEach(button => button.addEventListener('click', () => openDialog(navDialog, button)));
  document.querySelectorAll('[data-toc-open]').forEach(button => button.addEventListener('click', () => openDialog(tocDialog, button)));
  for (const dialog of [navDialog, tocDialog]) {
    if (!dialog) continue;
    dialog.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => { dialogOpener?.focus({preventScroll: true}); dialogOpener = null; });
  }
  navDialog?.querySelector('[data-navigation-slot]')?.addEventListener('click', event => {
    if (event.target.closest('a')) navDialog.close();
  });
  // Avoid nested modal dialogs on mobile: search replaces the navigation drawer.
  navigation?.querySelector('[data-search-open]')?.addEventListener('click', () => {
    if (navDialog?.open) navDialog.close();
  }, {capture: true});
  if (tocDialog && !tocDialog.querySelector('a[href^="#"]')) {
    document.querySelectorAll('[data-toc-open]').forEach(button => { button.hidden = true; button.style.display = 'none'; });
  }

  const treeScroll = document.querySelector('[data-tree-scroll]');
  document.querySelectorAll('[data-tree-key]').forEach(group => {
    const key = `notes:group:${group.dataset.treeKey}`;
    const previous = safeGet('localStorage', key);
    if (previous !== null && !group.hasAttribute('data-current-group')) group.open = previous === 'open';
    group.addEventListener('toggle', () => safeSet('localStorage', key, group.open ? 'open' : 'closed'));
  });
  if (treeScroll) {
    treeScroll.scrollTop = Number(safeGet('sessionStorage', 'notes:tree-position')) || 0;
    const active = treeScroll.querySelector('a[aria-current="page"]');
    if (active) {
      const item = active.getBoundingClientRect();
      const container = treeScroll.getBoundingClientRect();
      if (item.top < container.top || item.bottom > container.bottom) treeScroll.scrollTop += item.top - container.top - 24;
    }
    window.addEventListener('pagehide', () => safeSet('sessionStorage', 'notes:tree-position', String(treeScroll.scrollTop)));
  }

  const outlineLinks = [...document.querySelectorAll('.notes-outline a[href^="#"], .notes-mobile-outline a[href^="#"]')];
  const headingPairs = [];
  const seen = new Set();
  outlineLinks.forEach(link => {
    let id;
    try { id = decodeURIComponent(link.hash.slice(1)); } catch { return; }
    link.dataset.headingId = id;
    const heading = document.getElementById(id);
    if (heading && !seen.has(id)) { headingPairs.push({id, heading}); seen.add(id); }
    link.addEventListener('click', event => {
      if (!heading || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (tocDialog?.open) tocDialog.close();
      // Native anchors preserve shareable URLs and browser back/forward history.
      heading.setAttribute('tabindex', '-1');
      requestAnimationFrame(() => heading.focus({preventScroll: true}));
    });
  });
  const article = document.querySelector('[data-article]');
  const progressBar = document.querySelector('[data-reading-bar]');
  const progressLabel = document.querySelector('[data-reading-label]');
  let readingScheduled = false;
  let currentHeading = '';
  const updateReading = () => {
    readingScheduled = false;
    const threshold = mobile.matches ? 100 : 52;
    let active = headingPairs[0]?.id || '';
    headingPairs.forEach(({id, heading}) => { if (heading.getBoundingClientRect().top <= threshold) active = id; });
    if (active !== currentHeading) {
      outlineLinks.forEach(link => {
        if (link.dataset.headingId === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      currentHeading = active;
    }
    if (article && progressBar) {
      const box = article.getBoundingClientRect();
      const distance = box.height - window.innerHeight + threshold;
      const fraction = distance > 0 ? Math.max(0, Math.min(1, (threshold - box.top) / distance)) : (box.bottom <= window.innerHeight ? 1 : 0);
      progressBar.style.transform = `scaleX(${fraction})`;
      progressLabel.value = `${Math.round(fraction * 100)}%`;
      progressLabel.textContent = progressLabel.value;
    }
  };
  const scheduleReading = () => { if (!readingScheduled) { readingScheduled = true; requestAnimationFrame(updateReading); } };
  window.addEventListener('scroll', scheduleReading, {passive: true});
  window.addEventListener('resize', scheduleReading, {passive: true});
  window.addEventListener('hashchange', scheduleReading);
  if (article && 'ResizeObserver' in window) new ResizeObserver(scheduleReading).observe(article);
  scheduleReading();
  document.querySelector('[data-back-top]')?.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
    document.querySelector('#content')?.focus({preventScroll: true});
  });

  // Direction and bounded offsets adapted from Takane Ichinose's public MIT Pen.
  // The original centered-page math is adapted to each actual SVG eye position.
  const cat = document.querySelector('[data-cat]');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!cat) return;
  const eyes = [...cat.querySelectorAll('[data-eye]')];
  const pupils = [...cat.querySelectorAll('[data-pupil]')];
  const motion = pupils.map(() => ({x: 0, y: 0, targetX: 0, targetY: 0}));
  let visible = false;
  let frame = 0;
  const allowed = () => visible && !document.hidden && finePointer.matches && !reducedMotion.matches;
  const stop = () => { cancelAnimationFrame(frame); frame = 0; };
  const center = () => {
    stop();
    motion.forEach((state, index) => { state.x = state.y = state.targetX = state.targetY = 0; pupils[index].setAttribute('transform', 'translate(0 0)'); });
  };
  const draw = () => {
    frame = 0;
    if (!allowed()) return;
    let moving = false;
    motion.forEach((state, index) => {
      state.x += (state.targetX - state.x) * .16;
      state.y += (state.targetY - state.y) * .16;
      if (Math.abs(state.targetX - state.x) + Math.abs(state.targetY - state.y) > .001) moving = true;
      pupils[index].setAttribute('transform', `translate(${state.x.toFixed(4)} ${state.y.toFixed(4)})`);
    });
    if (moving) frame = requestAnimationFrame(draw);
  };
  const start = () => { if (!frame && allowed()) frame = requestAnimationFrame(draw); };
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (!visible) center(); });
  observer.observe(cat);
  window.addEventListener('pointermove', event => {
    if (!allowed() || event.pointerType === 'touch') return;
    eyes.forEach((eye, index) => {
      const box = eye.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      const angle = Math.atan2(dy, dx);
      const range = Number(eye.dataset.travel) || .42;
      const distance = Math.min(1, Math.hypot(dx, dy) / (window.innerWidth * .45)) * range;
      motion[index].targetX = Math.cos(angle) * distance;
      motion[index].targetY = Math.sin(angle) * distance;
    });
    start();
  }, {passive: true});
  document.documentElement.addEventListener('pointerleave', () => { motion.forEach(state => { state.targetX = state.targetY = 0; }); start(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) center(); });
  reducedMotion.addEventListener('change', center);
  finePointer.addEventListener('change', center);
  window.addEventListener('resize', center, {passive: true});
})();
