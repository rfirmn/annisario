const experience = document.querySelector('#experience');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let transitioning = false;

function waitForFade(element, duration) {
  if (reducedMotion.matches) return Promise.resolve();
  return new Promise(resolve => {
    const finish = () => {
      clearTimeout(fallback);
      element.removeEventListener('transitionend', onEnd);
      resolve();
    };
    const onEnd = event => {
      if (event.target === element && event.propertyName === 'opacity') finish();
    };
    const fallback = setTimeout(finish, duration + 100);
    element.addEventListener('transitionend', onEnd);
  });
}

async function showScene(name) {
  if (transitioning || experience.dataset.scene === name) return;
  transitioning = true;
  const current = experience.querySelector('.scene:not([hidden])');
  const next = experience.querySelector(`.${name}`);
  document.documentElement.classList.add('scene-changing');
  current.inert = true;
  current.classList.add('leaving');
  await waitForFade(current, 400);
  current.hidden = true;
  current.classList.remove('leaving');
  current.inert = false;
  next.classList.add('entering');
  next.inert = true;
  next.hidden = false;
  experience.dataset.scene = name;
  window.scrollTo({ top: 0, behavior: 'instant' });
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  next.classList.remove('entering');
  await waitForFade(next, 700);
  next.inert = false;
  document.documentElement.classList.remove('scene-changing');
  const heading = next.querySelector('h1, h2');
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  transitioning = false;
}

document.querySelector('#continue').addEventListener('click', () => showScene('letter'));
document.querySelector('#replay').addEventListener('click', () => showScene('intro'));
document.querySelectorAll('[data-scene-target]').forEach(button => {
  button.addEventListener('click', () => showScene(button.dataset.sceneTarget));
});

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.poem-intro, .poem-paper, .closing-message').forEach(element => {
    element.classList.add('reveal-ready');
    observer.observe(element);
  });
}
