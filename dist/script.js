const experience = document.querySelector('#experience');
const indicator = document.querySelector('.scene-indicator');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let transitioning = false;

async function showScene(name) {
  if (transitioning || experience.dataset.scene === name) return;
  transitioning = true;
  const current = experience.querySelector('.scene:not([hidden])');
  const next = experience.querySelector(`.${name}`);
  current.inert = true;
  current.classList.add('leaving');
  await new Promise(resolve => setTimeout(resolve, reducedMotion.matches ? 0 : 650));
  current.hidden = true;
  current.classList.remove('leaving');
  current.inert = false;
  next.classList.add('entering');
  next.hidden = false;
  experience.dataset.scene = name;
  const index = name === 'intro' ? 0 : 1;
  indicator.setAttribute('aria-label', `Bagian ${index + 1} dari 2`);
  indicator.querySelector('.scene-number').textContent = `0${index + 1} / 02`;
  [...indicator.children].slice(0, 2).forEach((dot, i) => dot.classList.toggle('active', i === index));
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  next.classList.remove('entering');
  const heading = next.querySelector('h1, h2');
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  await new Promise(resolve => setTimeout(resolve, reducedMotion.matches ? 0 : 850));
  transitioning = false;
}

document.querySelector('#continue').addEventListener('click', () => showScene('outro'));
document.querySelector('#replay').addEventListener('click', () => showScene('intro'));
